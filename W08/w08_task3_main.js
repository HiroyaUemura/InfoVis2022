d3.csv("https://hiroyauemura.github.io/InfoVis2022/W08/data.csv")
    .then( data => {
        data.forEach( d => {  d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius: 128,
            margin: {top:0, right:0, bottom:0, left:0}
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
            radius: config.radius || 128,
            margin: config.margin || {top:0, right:0, bottom:0, left:0}
        }
        this.data = data;
        this.init();
    }

    init(){
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

        self.pie = d3.pie()
            .value( d => d.value );

        self.arc = d3.arc()
            .innerRadius(50)
            .outerRadius(self.config.radius);

  //      self.text = d3.arc()
  //          .innerRadius(self.config.radius - 30)
  //          .outerRadius(self.config.radius - 30);

        self.color = d3.scaleOrdinal()
            .range(["#DC3912", "#3366CC", "#109618", "#FF9900", "#990099"]);
    }

    update(){
      let self = this;
      self.render();
    }

    render(){
      let self = this;

      self.pieGroup = self.svg.selectAll('pie')
          .data(self.pie(self.data))
          .enter()
          .append('g')
          .attr('class', 'pie');

      self.pieGroup
          .append('path')
          .attr('d', self.arc)
          .attr('fill', function(d) { return self.color(d.index) })
          .attr('stroke', 'white')
          .style('stroke-width', '2px');

      self.pieGroup
          .append("text")
          .attr("fill", "black")
          .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")"; })
          .attr("dy", "5px")
          .attr("font", "10px")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.data.label; });

    }
}
