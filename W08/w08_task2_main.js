d3.csv("https://hiroyauemura.github.io/InfoVis2022/W08/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
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
            .x( d => d.x )
            .y( d => d.y );
    }

    update(){
      let self = this;
      self.render();
    }

    render(){
      let self = this;

      self.chart.selectAll("path")
          .data(self.data)
          .enter()
          .append("path")
          .attr('stroke', 'black')
          .attr('fill', 'none');
    }
}
