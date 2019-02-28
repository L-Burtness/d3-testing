import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { jobData } from './jobData'

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

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
    let parseDate = d3.timeParse("%b %Y");
    this.data = jobData.map(d => {
      return {
        date: parseDate(d.date),
        rate: +d.rate
      }
    });
  }

  drawChart() {
    const svg = d3.select('#line-svg');
    const container = d3.select('#line-container');

    container.style('text-align', 'center');

    svg.attr('width', this.svgWidth)
        .attr('height', this.svgHeight);

    const chart = svg.append('g')
                     .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    /*********** X Scale *******************/
    const xScale = d3.scaleTime()
                      .domain(d3.extent(this.data, d => d && d.date))
                      .range([0, this.width])
                
    chart.append('g')
          .attr('transform', `translate(0, ${this.height})`)
          .call(d3.axisBottom(xScale));
    /***************************************/

    /************ Y Scale *******************/
    const yScale = d3.scaleLinear()
                      .domain([0, d3.max(this.data, d => d && d.rate)])
                      .range([this.height, 0]);

    chart.append('g')
          .call(d3.axisLeft(yScale));
    /****************************************/

    /************* Line Generator *************/
    var line = d3.line()
                  .defined(d => d && !isNaN(d.rate))
                  .x(d => xScale(d.date))
                  .y(d => yScale(d.rate))
    /*****************************************/

    /***************** Append Path ************/
    var path = chart.append('path')
        .datum(this.data)
        .attr('d', line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
    /******************************************/

    /************ Title and labels *******************/
    svg.append('text')
        .attr('class', 'label')
        .attr('x', -(this.svgHeight / 2))
        .attr('y', this.margin.left / 2)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Rate (%)')
        .style('font-size', 16);

    svg.append('text')
        .attr('class', 'label')
        .attr('x', this.svgWidth / 2)
        .attr('y', this.svgHeight - (this.margin.bottom / 4))
        .attr('text-anchor', 'middle')
        .text('Year')
        .style('font-size', 16);

    svg.append('text')
        .attr('class', 'title')
        .attr('x', this.svgWidth / 2)
        .attr('y', this.margin.top * 0.6)
        .attr('text-anchor', 'middle')
        .text('U.S. Unemployment Rate, January 1969 - January 2019')
        .style('font-size', 24);

    svg.append('text')
        .attr('class', 'source')
        .attr('x', this.svgWidth - this.margin.right)
        .attr('y', this.svgHeight - (this.margin.bottom / 4))
        .attr('text-anchor', 'end')
        .text('Source: Bureau of Labor Statistics, 2018')
        .style('font-size', 12);
    /************************************************/

    /**************** Animation *********************/
    // Variable to Hold Total Length
    var totalLength = path.node().getTotalLength();

    // Set Properties of Dash Array and Dash Offset and initiate Transition
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition() // Call Transition Method
      .duration(4000) // Set Duration timing (ms)
      .ease(d3.easeLinear) // Set Easing option
      .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition
    /************************************************/
  }

}
