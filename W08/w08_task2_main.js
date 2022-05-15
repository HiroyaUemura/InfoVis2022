d3.csv("https://hiroyauemura.github.io/InfoVis2022/W08/data2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:0, right:0, bottom:0, left:0}
        };

        const linechart = new LineChart( config, data );
        linechart.update();
    })
    .catch( error => {
        console.log( error );
    });

class LineChart {
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init(){
        let self = this;
        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.line = d3.line()
            .x( d => d.x + 20)
            .y( d => d.y );

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.value)])
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height]);


        self.xaxis = d3.axisBottom( self.xscale )
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
      self.render();
    }

    render(){
      let self = this;
      self.svg.append('path')
         .attr('d', self.line(self.data))
         .attr('stroke', 'black')
         .attr('fill', 'none');

      self.chart.selectAll("circle")
         .data(self.data)
         .enter()
         .append("circle")
         .attr("cx", self.line.x() )
         .attr("cy", self.line.y() )
         .attr("r", 5 );

      self.xaxis_group
         .call( self.xaxis );
      self.yaxis_group
         .call( self.yaxis );
    }
}
