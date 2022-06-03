d3.csv("https://hiroyauemura.github.io/InfoVis2022/FinalTask/data.csv")
    .then( data => {
        data.forEach( d => {  d.paper = +d.paper;  d.digital = +d.digital; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:10, right:10, bottom:20, left:60}
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
            width: config.width || 256,
            height: config.height || 128,
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

        self.series = d3.stack().keys(["paper","digital"])(data);

        self.color = d3.scaleOrdinal()
            .domain(self.series.map(d => d.key))
            .range(d3.schemeCategory10.slice(0, self.series.length))
            .unknown("#ccc");

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleBand()
            .domain(self.data.map(d => d.year))
            .range([0, self.inner_width])
            .paddingInner(0.1);

        self.yscale = d3.scaleLinear()
            .domain([0, d3.max(self.series, d => d3.max(d, d => d[1]))])
            .range([self.inner_height, 0]);

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

      self.xscale.domain(self.data.map(d => d.year));
      self.yscale.domain([0, d3.max(self.series, d => d3.max(d, d => d[1]))]);

      self.render();
    }

    render(){
      let self = this;

      self.chart.selectAll("g")
          .data(self.series)
          .join("g")
            .attr("fill", d => color(d.key))
          .selectAll("rect")
          .data(d => d)
          .join("rect")
            .attr("x", (d, i) => self.xscale(d.data.year))
            .attr("y", d => self.yscale(d[1]))
            .attr("height", d => self.yscale(d[0]) - self.yscale(d[1]))
            .attr("width", self.xscale.bandwidth());

      self.xaxis_group
          .call( self.xaxis );
      self.yaxis_group
          .call( self.yaxis );
    }
}
