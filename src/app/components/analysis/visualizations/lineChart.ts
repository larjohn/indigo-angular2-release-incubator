/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, Directive, Attribute as MetadataAttribute, OnChanges, DoCheck, ElementRef, OnInit, SimpleChange,
  AfterViewInit, ViewChild
} from '@angular/core';
import {Inject, NgZone, ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import {Observable} from "rxjs";
import * as $ from 'jquery'

import {Store} from "@ngrx/store";

@Component({
  selector: 'analytics-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./lineChart.html'),
  styles: [`

  
  .bar:hover {
    stroke: indigo;
  }
  
  .axis {
    font: 10px sans-serif;
  }
  
  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }
  
  .x.axis path {
    display: none;
  }

  `]
})
export class LineChartVisualization extends AfterViewInit {
  get values(): any {
    return this._values;
  }
  @Input()
  set values(value: any) {
    debugger;
    this._values = value;
    this.ref.detectChanges();
  }
  ngAfterViewInit(): void {

    let that = this;


  }
  xAxis;
  yAxis;


  @ViewChild('vizCanvas') vizCanvas;
  @Input() values$: Observable<any>;
 private _values: any;

  private generateBarChart(data: Object, tuple) {
    let colors = d3.scale.category20();
    let that = this;
    let baseSvg = d3.select(that.vizCanvas.nativeElement).append("svg")
      .attr("width", that.width + that.margin.left + that.margin.right)
      .attr("height", that.height + that.margin.top + that.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
    that.x = d3.scale.ordinal()
      .rangeRoundBands([0, that.width], .1);

    that.y = d3.scale.linear()
      .range([that.height, 0]);

    that.xAxis = d3.svg.axis()
      .scale(that.x)
      .orient("bottom");

    that.yAxis = d3.svg.axis()
      .scale(that.y)
      .orient("left")
      .ticks(20, ".0s");

    that.x.domain(data.attributes);


    that.x.domain(data.cells.map(function (d) {
      return d[data.attributes[0]]
    }));
    that.y.domain([0, d3.max(data.cells, function (d) {
      return d[data.aggregates[0]];

    })]);
    baseSvg.html("");
    baseSvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + that.height + ")")
      .call(that.xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");

    baseSvg.append("g")
      .attr("class", "y axis")
      .call(that.yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".31em")
      .style("text-anchor", "end")
      .text(data.aggregates[0]);

    baseSvg.selectAll(".bar")
      .data(data.cells)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", function (d, i) {
        return colors(i)
      })
      .attr("x", function (d) {
        return that.x(d[data.attributes[0]]);
      })
      .attr("width", that.x.rangeBand())
      .attr("y", function (d) {
        return that.y(d[data.aggregates[0]]);
      })
      .attr("height", function (d) {
        return that.height - that.y(d[data.aggregates[0]]);
      });


    if (tuple) {
      baseSvg.append("text")
        .attr("x", (that.width / 2))
        .attr("y", 0 - (that.margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(JSON.stringify(tuple));
    }


  }

  init(values: any) {


    let that = this;

    d3.select(that.vizCanvas.nativeElement).html("");



    this.generateBarChart(data, null);




  }


  x;
  y;




  constructor(@Inject(ElementRef) elementRef: ElementRef,
              private ref: ChangeDetectorRef) {


  }


}
