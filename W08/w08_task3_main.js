d3.csv("https://hiroyauemura.github.io/InfoVis2022/W08/data.csv")
    .then( data => {
        data.forEach( d => {  d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius: Math.min( width, height ) / 2,
            margin: {top:10, right:10, bottom:10, left:10}
        };

        const piechart = new PieChart( config, data );
        piechart.update();
    })
    .catch( error => {
        console.log( error );
    });

class PieChart {
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            radius: Math.min( width, height ) / 2,
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
            .append('g')
            .attr('transform', `translate(${width/2}, ${height/2})`);

        self.pie = d3.pie()
            .value( d => d.value );

        self.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
    }

    update(){
      let self = this;
      self.render();
    }

    render(){
      let self = this;

      self.chart.selectAll('pie')
          .data(self.pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', 'black')
          .attr('stroke', 'white')
          .style('stroke-width', '2px');

    }
}
