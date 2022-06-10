let bar_chart;
let japan_map;

d3.csv("https://hiroyauemura.github.io/InfoVis2022/FinalTask/data.csv")
    .then( data => {
        data.forEach( d => {
           //d.pref = +d.pref;
           d.all = +d.all;
           d.male = +d.male;
           d.female = +d.female;
        });

        var config_BarChart = {
            parent: '#drawing_BarChart',
            width: 512,
            height: 512,
            margin: {top:60, right:10, bottom:20, left:60}
        };
        var config_map = {
            parent: '#drawing_Map',
            width: 512,
            height: 512,
            scale: 1200,
            margin: {top:60, right:10, bottom:20, left:60}
        };

        bar_chart = new BarChart( config_BarChart, data );
        bar_chart.update();

        japan_map = new JapanMap( config_map, data );

    })
    .catch( error => {
        console.log( error );
    });

class BarChart {
    constructor( config_BarChart, data ) {
        this.config = {
            parent: config_BarChart.parent,
            width: config_BarChart.width || 256,
            height: config_BarChart.height || 256,
            margin: config_BarChart.margin || {top:20, right:10, bottom:20, left:60}
        }
        this.data = data;
        this.init();
    }

    init(){
        let self = this;
        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.all)])
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .domain(self.data.map(d => d.pref))
            .range([0, self.inner_height])
            .paddingInner(0.1);

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call( self.xaxis );

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        self.yaxis_group = self.chart.append('g')
            .call( self.yaxis );
    }

    update(){
      let self = this;

      self.xscale.domain([0, d3.max(self.data, d => d.all)]);
      self.yscale.domain(self.data.map(d => d.pref));

      self.render();
    }

    render(){
      let self = this;

      const color = d3.scaleLinear()
                      .interpolate(d3.interpolate)
                      .domain([0, d3.max(self.data, d => d.all)])
                      .range(["White", "Blue"]);

      self.chart.selectAll("rect")
          .data(self.data)
          .enter()
          .append("rect")
          .attr("x", 0)
          .attr("y", d => self.yscale(d.pref))
          .attr("width", d => self.xscale(d.all))
          .attr("height", self.yscale.bandwidth())
          .style("fill", function(d){
              return color(d.all);
          });

      self.chart.append("text")
          .attr("x", (self.inner_width+self.config.margin.right)/2 - 200)
          .attr("y", -20)
          .attr("font-size", "16px")
          .attr("text-anchor", "top")
          .attr("font-weight", "middle")
          .text("Number of suicides per 100,000 population");

      self.xaxis_group
          .call( self.xaxis );
      self.yaxis_group
          .call( self.yaxis );

    }
}

class JapanMap {
  constructor(config_map, data) {
      this.config_map = {
          parent: config_map.parent,
          width: config_map.width || 256,
          height: config_map.height || 256,
          margin: config_map.margin || { top: 20, right: 10, bottom: 20, left: 60 },
          scale: config_map.scale || 1500,
      }
      this.data = data;
      this.map_render();
  }

  map_render(){
    let self = this;

    const gProjection = d3.geoMercator()
        .center([136.0, 38.6])
        .translate([self.config_map.width / 2, self.config_map.height / 2])
        .scale(self.config_map.scale);

    const gPath = d3.geoPath().projection(gProjection);

    const svg = d3.select(self.config_map.parent)
              //    .append("svg")
                  .attr("width", self.config_map.width)
                  .attr("height", self.config_map.height);

    const color = d3.scaleLinear()
                    .interpolate(d3.interpolate)
                    .domain([d3.min(self.data, d => d.all), d3.max(self.data, d => d.all)])
                    .range(["White", "Blue"]);

    d3.json("https://hiroyauemura.github.io/InfoVis2022/FinalTask/japan.geo.json")
      .then(function (japan){
        for (var i = 0; i < 47; i++) {
            for (var j = 0; j < japan.features.length; j++) {
               if (self.data[i].pref == japan.features[j].properties.name_ja) {
                 japan.features[j].properties.value = self.data[i].all;
                 break;
               }
            }
        }

         let map = svg.append("g").selectAll("path")
            .data(japan.features)
            .enter()
            .append("path")
            .attr("d", gPath)
            .attr(`stroke`, `#666`)
            .attr(`stroke-width`, 0.25)
            .attr(`fill-opacity`, 1)
  //          .attr("fill", "Blue");
            .attr("fill", function(d){
              return color(d.properties.value);
            });

        map
          .on('mouseover', function(e,d) {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Suicide rate</div>(${d.properties.name_ja}, ${d.properties.value})`);
          })
          .on('mousemove', (e) => {
              const padding = 10;
              d3.select('#tooltip')
                  .style('left', (e.pageX + padding) + 'px')
                  .style('top', (e.pageY + padding) + 'px');
          })
          .on('mouseleave', function() {
              d3.select('#tooltip')
                  .style('opacity', 0);
          });
    });
//console.log(color(25));
  }
}
