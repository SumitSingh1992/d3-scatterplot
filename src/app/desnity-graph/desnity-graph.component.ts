import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-desnity-graph',
  templateUrl: './desnity-graph.component.html',
  styleUrls: ['./desnity-graph.component.css']
})
export class DesnityGraphComponent implements OnInit {

  @Input() data = [];
  // set the dimensions and margins of the graph
  margin = { top: 10, right: 30, bottom: 50, left: 50 };
  width = 460 - this.margin.left - this.margin.right;
  height = 120 - this.margin.top - this.margin.bottom;
  svg;
  dataToBind;
  years;
  dots;
  line;
  color;
  worldPopulation;
  ngOnInit() {
    this.createSVG();
    this.plotGrapgh();
  }

  createSVG() {
    // append the svg object to the body of the page
    this.svg = d3.select("#density")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  plotGrapgh() {
    // add the x Axis
    const x = d3.scaleLinear()
      .domain([1950, 2021])
      .range([0, this.width]);
    // add the y Axis
    const y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, 10]);

    // Plot the area
    this.svg.append("path")
      .datum(this.data)
      .attr("fill", "#f0e030")
      .attr("stroke", "#fca503")
      .attr("stroke-width", 1)
      .attr("d", d3.area()
        .x(function (d) { return x(d.year); })
        .y0(y(0))
        .y1(function (d) { return y(Number(d.population)); })
      );

    // Add  labels:
    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 30)
      .attr("y", this.height + this.margin.top+10)
      .text(this.data[0].year);

      this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", this.width)
      .attr("y", this.height + this.margin.top+10)
      .text(this.data[this.data.length-1].year);

      this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 40)
      .attr("y", 30)
      .text(this.data[0].population+" Bn");

      this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", this.width)
      .attr("y", 7)
      .text(this.data[this.data.length-1].population +" Bn");
  }
}
