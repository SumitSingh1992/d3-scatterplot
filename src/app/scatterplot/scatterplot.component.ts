import { Component } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.css']
})
export class ScatterplotComponent {
  desktop = screen.width > 700 ? true:false;

  margin = { top: 30, right: 100, bottom: 60, left: 110 };
  width = this.desktop ? screen.width - 250 : screen.width;
  
  height = screen.height - 300;
  svg;
  data;
  dataToBind;
  years;
  dots;
  line;
  color;
  worldPopulation;
  densityData = [];
  constructor() { }

  ngOnInit(): void {
    this.getData();
  }
  async getData() {
    this.data = await d3.csv('./assets/data/population.csv');
    this.years = this.data.map(item => item.Year).filter((item, ind, arr) => {
      return arr.indexOf(item) === ind;
    });
    // this.densityData = 
    const temp = [];
    for (let i = 0; i < this.data.length; i++) {
      var elem = this.data[i];
      const array = this.data.filter(val => val.Year == elem.Year);
      const pop = array.reduce((sum, item) => {
        const val = Number(item['Population (000s)'].replaceAll(',', ''));
        return sum + val;
      }, 0);
      const obj = { year: elem.Year, population: (pop/1000000).toFixed(1) };
      if (temp.indexOf(elem.Year) >= 0) {
        break;
      }
      else {
        temp.push(elem.Year);
        this.densityData.push(obj);
      }
    }


    this.dataToBind = this.data.filter(item => item.Year == '1950');
    this.worldPopulation = this.dataToBind.reduce((sum, item) => {
      const val = Number(item['Population (000s)'].replaceAll(',', ''));
      return sum + val;
    }, 0);
    this.worldPopulation = this.worldPopulation / 1000000;
    this.createSvg();
    this.plotGrapgh();
  }

  update(val) {
    // Add X axis --> it is a date format
    const x = this.getXscale();
    // Add Y axis
    const y = this.getYscale();
    this.dataToBind = this.data.filter(item => item.Year == val.target.value);
    this.worldPopulation = this.dataToBind.reduce((sum, item) => {
      const val = Number(item['Population (000s)'].replaceAll(',', ''));
      return sum + val;
    }, 0);
    this.worldPopulation = this.worldPopulation / 1000000;
    this.dots
      .data(this.dataToBind)
      .transition()
      .duration(1000)
      .attr("cx", function (d) { return x(parseInt(d.Population_Density)) })
      .attr("cy", function (d) { return y(parseInt(d.Population_Growth_Rate)) })
  }


  private createSvg(): void {
    // append the svg object to the body of the page
    this.svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(this.years)
      .enter()
      .append('option')
      .text(function (d) { return 'Year: ' + d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
  }

  getXscale() {
    return d3.scaleLinear()
      .domain([0, 1000])
      .range([0, this.width]);
  }
  getYscale() {
    return d3.scaleLinear()
      .domain([-100, 100])
      .range([this.height, 0]);
  }

  getColor() {
    return d3.scaleOrdinal()
      .domain(["Asia and Pacific", "Europe and Africa", "America"])
      .range(["#fca503", "#30a6f0", "#a630f0"])
  }
  async plotGrapgh() {
    // Add X axis --> it is a date format
    const x = this.getXscale();
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = this.getYscale();
    this.svg.append("g")
      .call(d3.axisLeft(y));


    // Add X axis label:
    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", this.width - 300)
      .attr("y", this.height + this.margin.top + 20)
      .text("Population Density");

    // Y axis label:
    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -this.margin.left + 40)
      .attr("x", -this.margin.top - 50)
      .text("Population Growth (%)")

    this.svg.append("text")
      .attr("x", 10)
      .attr("y", 0 - (this.margin.top / 2))
      .style("font-size", "20px")
      .text("Population Growth vs Density Correlation");

    // Initialize dots with group a
    const color = this.getColor();
    this.dots = await this.svg
      .selectAll('circle')
      .data(this.dataToBind)
      .enter()
      .append('circle')
      .attr("cx", function (d) { return x(parseInt(d.Population_Density)) })
      .attr("cy", function (d) { return y(parseInt(d.Population_Growth_Rate)) })
      .attr("r", function (d) {
        const val = Number(d['Population (000s)'].replaceAll(',', ''));
        return val / 10000
      })
      .style("fill", function (d) { return color(d.Country) })
  }
}
