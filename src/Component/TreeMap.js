import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import ReadPLY from '../Utils/ReadPLY.js';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

class TreeMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    if (this.props.data) {
      switch (this.props.data.fileType) {
        case 'json': {
          json(this.props.data.dataFile, (error, data) => {

            if (error) {
              this.setState({
                error: true,
              });
            } else {
              this.setState({
                data: data,
              });
            }
          });
          break;
        }
        case 'csv': {
          csv(this.props.data.dataFile, (error, data) => {
            data = data.map(d => {
              for (let i = 0; i < this.props.data.fieldDesc.length; i++) {
                if (this.props.data.fieldDesc[i][1] === 'number')
                  d[this.props.data.fieldDesc[i][0]] = +d[this.props.data.fieldDesc[i][0]]
                if ((this.props.data.fieldDesc[i][1] === 'date') || (this.props.data.fieldDesc[i][1] === 'time'))
                  d[this.props.data.fieldDesc[i][0]] = moment(d[this.props.data.fieldDesc[i][0]], this.props.data.fieldDesc[i][2])['_d']
              }
              return d
            })
            if (error) {
              this.setState({
                error: true,
              });
            } else {
              this.setState({
                data: data,
              });
            }
          });
          break;
        }
        case 'ply': {
          let data = ReadPLY(this.props.data.dataFile);
          this.setState({
            data: data,
          })
          break;
        }
        case 'text': {
          text(this.props.data.dataFile, (error, text) => {

            let data = d3.csvParseRows(text).map(function (row) {
              return row.map(function (value) {
                return +value;
              });
            });
            if (error) {
              this.setState({
                error: true,
              });
            } else {
              this.setState({
                data: data,
              });
            }
          });
          break;
        }
        default: {
          csv(this.props.data.dataFile, (error, data) => {
            data = data.map(d => {
              for (let i = 0; i < this.props.data.fieldDesc.length; i++) {
                if (this.props.data.fieldDesc[i][1] === 'number')
                  d[this.props.data.fieldDesc[i][0]] = +d[this.props.data.fieldDesc[i][0]]
              }
              return d
            })
            if (error) {
              this.setState({
                error: true,
              });
            } else {
              this.setState({
                data: data,
              });
            }
          });
          break;
        }
      }
    } else {
      this.setState({
        data: 'NA',
      });
    }
  }

  render() {
    if (!this.state.data) {
      return <a-entity />
    }
    else {

      // Data manipulation

      const treemap = d3.treemap()
        .size([this.props.style.dimensions.width, this.props.style.dimensions.depth])
        .paddingInner(this.props.mark.style.paddingInner)
        .paddingOuter(this.props.mark.style.paddingOuter);

      const root = d3.hierarchy(this.state.data, (d) => d.children)
        .sum((d) => d.size);

      const tree = treemap(root);

      let parent = []
      for (let i = 0; i < tree.leaves().length; i++) {
        if ((parent.indexOf(tree.leaves()[i].parent.data.name) == -1) && (tree.leaves()[i].parent.data.name !== null))
          parent.push(tree.leaves()[i].parent.data.name)
      }



      let heightDomain;
      if (!this.props.mark.style.extrusion.domain) {
        if (this.props.mark.style.extrusion.startFromZero)
          heightDomain = [0, d3.max(tree.leaves(), d => d.data[this.props.mark.style.extrusion.field])]
        else
          heightDomain = [d3.min(tree.leaves(), d => d.data[this.props.mark.style.extrusion.field]), d3.max(tree.leaves(), d => d.data[this.props.mark.style.extrusion.field])]
      } else
        heightDomain = this.props.mark.style.extrusion.domain

      let heightScale
      if (this.props.mark.style.extrusion.value)
        heightScale = d3.scaleLinear()
          .domain(heightDomain)
          .range(this.props.mark.style.extrusion.value);
      else
        heightScale = d3.scaleLinear()
          .domain(heightDomain)
          .range([0, this.props.style.dimensions.height]);


      let colorScale;
      if (this.props.mark.style.fill.scaleType) {
        let colorRange = d3.schemeCategory10;
        if (this.props.mark.style.fill.color)
          colorRange = this.props.mark.style.fill.color;
        colorScale = d3.scaleOrdinal()
          .domain(parent)
          .range(colorRange)
      }


      let marks = tree.leaves().map((d, i) => {
        let width = (d.x1 - d.x0).toFixed(3);
        let posX = (d.x0 + (d.x1 - d.x0) / 2).toFixed(3);
        let depth = (d.y1 - d.y0).toFixed(3);
        let posZ = (d.y0 + (d.y1 - d.y0) / 2).toFixed(3);
        let height = (heightScale(d.data[this.props.mark.style.extrusion.field])).toFixed(3);
        if (this.props.mark.style.fill.scaleType)
          return <a-box id={`width${width}posX${posX}dx${d.x0}`} key={i} color={`${colorScale(d.parent.data.name)}`} opacity={this.props.mark.style.fill.opacity} depth={`${depth}`} height={`${height}`} width={`${width}`} position={`${posX} ${height / 2} ${posZ}`} />
        else
          return <a-box id={`width${width}posX${posX}dx${d.x0}`} key={i} color={`${this.props.mark.style.fill.color}`} opacity={this.props.mark.style.fill.opacity} depth={`${depth}`} height={`${height}`} width={`${width}`} position={`${posX} ${height / 2} ${posZ}`} />
      });
      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {marks}
        </a-entity>
      )
    }
  }
}
export default TreeMap