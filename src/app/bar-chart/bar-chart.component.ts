import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { languages } from './languages'

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  data = [];
  margin = {top: 60, right: 60, bottom: 60, left: 60};
  svgWidth = window.innerWidth - this.margin.left - this.margin.right;
  svgHeight = window.innerHeight - (this.margin.top * 4);
  width = this.svgWidth - this.margin.left - this.margin.right;
  height = this.svgHeight - this.margin.top - this.margin.bottom;

  constructor() { }

  ngOnInit() {
    this.getData();
    this.drawChart();
  }

  getData() {
    this.data = languages;
  }

  drawChart() {
    const svg = d3.select('svg');
    const container = d3.select('#container');

    container.style('text-align', 'center');

    svg.attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .style('background-color', '#00a3cc');

    const chart = svg.append('g')
                     .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    
    /***************** X Scale *************************/
    const xScale = d3.scaleBand()
                      .domain(this.data.map((s) => s.language))
                      .range([0, this.width])
                      .padding(0.2);

    chart.append('g')
          .attr('transform', `translate(0, ${this.height})`)
          .call(d3.axisBottom(xScale));
    /**************************************************/

    /**************** Y Scale ***************************/
    const yScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([this.height, 0]);

    chart.append('g')
         .call(d3.axisLeft(yScale));
    /**************************************************/
    
    /********* Horizontal lines ************************/
    const makeYLines = () => d3.axisLeft()
                               .scale(yScale)

    chart.append('g')
          .attr('class', 'grid')
          .call(makeYLines()
            .tickSize(-this.width, 0, 0)
            .tickFormat(''))
          .style('stroke', '#9FAAAE')
    /**************************************************/

    /************ Draw bars with no events **************/
    const barGroups = chart.selectAll()
      .data(this.data)
      .enter()
      .append('g')

    barGroups
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (g) => xScale(g.language))
      .attr('y', (g) => yScale(g.value))
      .attr('height', (g) => this.height - yScale(g.value))
      .attr('width', xScale.bandwidth())
      .style('fill', '#e6ffff')                                               /* Fill color */
    /*************************************************/

    /************* Total numbers on bars *****************/
    barGroups.append('text')
      .attr('class', 'value')
      .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
      .attr('y', (a) => yScale(a.value) + 30)
      .attr('text-anchor', 'middle')
      .text((a) => `${a.value}%`);
    /****************************************************/

    /************ Title and labels *******************/
    svg.append('text')
        .attr('class', 'label')
        .attr('x', -(this.svgHeight / 2))
        .attr('y', this.margin.left / 2)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Love meter (%)')
        .style('font-size', 16);

    svg.append('text')
        .attr('class', 'label')
        .attr('x', this.svgWidth / 2)
        .attr('y', this.svgHeight - (this.margin.bottom / 4))
        .attr('text-anchor', 'middle')
        .text('Languages')
        .style('font-size', 16);

    svg.append('text')
        .attr('class', 'title')
        .attr('x', this.svgWidth / 2)
        .attr('y', this.margin.top * 0.6)
        .attr('text-anchor', 'middle')
        .text('Most loved programming languages in 2018')
        .style('font-size', 24);

    svg.append('text')
        .attr('class', 'source')
        .attr('x', this.svgWidth - this.margin.right)
        .attr('y', this.svgHeight - (this.margin.bottom / 4))
        .attr('text-anchor', 'end')
        .text('Source: Stack Overflow, 2018')
        .style('font-size', 12);
    /************************************************/

    /************************** Events ********************/
    barGroups.on('mouseenter', function (actual, i) {
      d3.selectAll('.value')
        .attr('opacity', 0)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (a) => xScale(a.language) - 5)
        .attr('width', xScale.bandwidth() + 10)

      const y = yScale(actual.value)

      chart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', this.width)
        .attr('y2', y)
        .style('stroke', 'red');

      barGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) + 30)
        .attr('text-anchor', 'middle')
        .text((a, idx) => {
          const divergence = (a.value - actual.value)
          
          let text = ''
          if (divergence > 0) text += '+'
          text += `${divergence.toFixed(1)}%`

          return idx !== i ? text : '';
        })

    })
    .on('mouseleave', function () {
      d3.selectAll('.value')
        .attr('opacity', 1)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (a) => xScale(a.language))
        .attr('width', xScale.bandwidth())

      chart.selectAll('#limit').remove()
      chart.selectAll('.divergence').remove()
    })
    /****************** Events ***************************/


  }

}
