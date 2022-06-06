let bar_chart;
let japan_map;

d3.csv("https://hiroyauemura.github.io/InfoVis2022/FinalTask/data.csv")
    .then( data => {
        data.forEach( d => {
           d.pref = +d.pref;
           d.all = +d.all;
           d.male = +d.male;
           d.female = +d.female;
        });

        let config_BarChart{
            parent: '#drawing_BarChart',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:20, left:60}
        };
        let config_map{
            parent: '#drawing_Map',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:20, left:60}
        };

        bar_chart = new BarChart( config_BarChart, data );
        bar_chart.update();

        japan_map = new Map( config_map, data );

    })
    .catch( error => {
        console.log( error );
    });

class BarChart {
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:20, left:60}
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

      self.chart.selectAll("rect")
          .data(self.data)
          .enter()
          .append("rect")
          .attr("x", 0)
          .attr("y", d => self.yscale(d.pref))
          .attr("width", d => self.xscale(d.all))
          .attr("height", self.yscale.bandwidth());

      self.xaxis_group
          .call( self.xaxis );
      self.yaxis_group
          .call( self.yaxis );
    }
}

class Map {
}
