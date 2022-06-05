d3.csv("https://hiroyauemura.github.io/InfoVis2022/FinalTask/data.csv")
    .then( data => {
        data.forEach( d => {  d.paper = +d.paper;  d.digital = +d.digital; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:30, left:60}
        };

        const barchart = new BarChart( config, data );
        barchart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 512,
            height: config.height || 512,
            margin: config.margin || {top:10, right:10, bottom:30, left:60}
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

        self.stackGen = d3.stack().keys(["paper", "digital"]);

        self.series = self.stackGen(self.data);
    //    self.series = d3.stack().keys(["paper", "digital"])(self.data);

        self.color = d3.scaleOrdinal()
            .domain(self.series.map(d => d.key))
            .range(d3.schemeCategory10.slice(0, self.series.length))
            .unknown("#ccc");

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleBand()
            .domain(self.data.map(d => d.year))
            .range([0, self.inner_width])
            .paddingInner(0.1);

        self.yscale = d3.scaleLinear()
            .domain([0, d3.max(self.series, d => d3.max(d, d => d[1]))])
            .range([self.inner_height, 0]);

        self.xaxis = self.chart.append('g')
            .attr("transform", `translate(0, ${self.inner_height})`)
            .call(d3.axisBottom(self.xscale)
            .tickSizeOuter(0)
            .tickFormat(self.year))
            .call(g => g.selectAll(".domain").remove());

        self.yaxis = self.chart.append('g')
            .call(d3.axisLeft(self.yscale)
            .ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove());
    }

    update(){
      let self = this;
      self.render();
    }

    render(){
      let self = this;

//      console.log(self.data);
//      console.log(self.series);

      self.chart.selectAll("g")
          .data(self.series)
          .enter().append("g")
            .attr("fill", function(d) { return self.color(d.key); } )
          .selectAll("rect")
          .data(function(d) { return d; })
      //    .enter().append("rect")
          .join("rect")
            .attr("x", function(d) { return self.xscale(d.data.year); } )
  //          .attr("y", 0)
            .attr("y", function(d) { return self.yscale(d[0]); } )
        //    .attr("fill", d => self.color(d.key))
            .attr("width", self.xscale.bandwidth())
            .attr("height", function(d) { return self.yscale(d[1]) - self.yscale(d[0]); } );




  //    self.xaxis
//          .call( self.xaxis );
//      self.yaxis
  //        .call( self.yaxis );
    }
}
