import {Component,ElementRef,Input,OnChanges,ViewChild,ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import {count} from 'rxjs-compat/operator/count';

export interface DataModel {
  account_name: string;
  total_movements: number;
}

const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
];


@Component({
  selector: 'app-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @ViewChild('chart')
  private chartContainer: ElementRef;

  @Input()
  data: DataModel[];
  dateNow: String;
  month: String;
  showBarChart: Boolean = true;

  margin = {top: 20,right: 20,bottom: 30,left: 40};

  constructor() {
  }

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0 || !this.hasMovements(this.data)) {
      this.showBarChart = false;
      return;
    }
    this.getDates();
    this.createChart();
  }

  onResize() {
    if (!this.data || this.data.length === 0 || !this.hasMovements(this.data)) {
      this.showBarChart = false;
      return;
    }
    this.createChart();
  }

  private hasMovements(data: DataModel[]) {
    return data.reduce((a,{total_movements}) => a + total_movements,0) !== 0;
  }

  private getDates(): void {
    this.dateNow = new Date().toLocaleString();
    const d = new Date();
    this.month = MONTHS[d.getMonth()];
  }

  private createChart(): void {
    d3.select('svg').remove();

    const data = this.data;

    if (this.chartContainer) {
      const element = this.chartContainer.nativeElement;

      const svg = d3.select(element).append('svg')
        .attr('width',element.offsetWidth)
        .attr('height',element.offsetHeight);

      const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
      const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

      const x = d3
        .scaleBand()
        .rangeRound([0,contentWidth])
        .padding(0.1)
        .domain(data.map(d => d.account_name));

      const y = d3
        .scaleLinear()
        .rangeRound([contentHeight,0])
        .domain([0,d3.max(data,d => d.total_movements)]);

      const g = svg.append('g')
        .attr('transform','translate(' + this.margin.left + ',' + this.margin.top + ')');

      g.append('g')
        .attr('class','axis axis--x')
        .attr('transform','translate(0,' + contentHeight + ')')
        .call(d3.axisBottom(x));

      g.append('g')
        .attr('class','axis axis--y')
        .call(d3.axisLeft(y).ticks(4))
        .append('text')
        .attr('transform','rotate(-90)')
        .attr('y',6)
        .attr('dy','0.71em')
        .attr('text-anchor','end')
        .text('Total');

      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class','bar')
        .attr('x',d => x(d.account_name))
        .attr('y',d => y(d.total_movements))
        .attr('width',x.bandwidth())
        .attr('height',d => contentHeight - y(d.total_movements))
        .on('mouseover',function(d) {
          return tooltip.style('visibility','visible').text(d.total_movements + '€');
        })
        .on('mousemove',function(d) {
          return tooltip.style('top',
            (d3.event.pageY - 10) + 'px').style('left',`${d3.event.pageX + 10}px`).text(d.total_movements + '€');
        })
        .on('mouseout',function() {
          return tooltip.style('visibility','hidden');
        });

      let tooltip = d3.select('body')
        .append('div')
        .style('position','absolute')
        .style('z-index','10')
        .style('visibility','hidden')
        .style('padding','2px')
        .style('background-color','black')
        .style('color','white');


      this.showBarChart = true;

    }
  }


}
