import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

export interface DataModel {
  account_name: string;
  total_movements: number;
}

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
  datePreviousMonth: String;

  margin = {top: 20, right: 20, bottom: 30, left: 40};

  constructor() { }

  ngOnChanges(): void {
    if (!this.data) { return; }

    this.getDates();
    this.createChart();
  }

  onResize() {
    this.createChart();
  }

  private getDates(): void {
    this.dateNow = new Date().toLocaleString().split(',')[0];
    let datePreviousMonth = new Date();
    datePreviousMonth.setMonth(datePreviousMonth.getMonth() - 1);
    this.datePreviousMonth = datePreviousMonth.toLocaleString().split(',')[0];
  }
  private createChart(): void {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    const data = this.data;

    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map(d => d.account_name));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.total_movements)]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(4))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Total');

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.account_name))
      .attr('y', d => y(d.total_movements))
      .attr('width', x.bandwidth())
      .attr('height', d => contentHeight - y(d.total_movements));
  }
}
