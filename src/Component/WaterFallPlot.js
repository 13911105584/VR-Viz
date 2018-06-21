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
import 'aframe-meshline-component';

class WaterFallPlot extends Component {
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
      // Getting domain for axis
      let xDomain, yDomain, zDomain, colorDomain;

      if (this.props.mark.position.x) {
        if (!this.props.mark.position.x.domain) {
          xDomain = GetDomain(this.state.data, this.props.mark.position.x.field, this.props.mark.position.x.scaleType, this.props.mark.position.x.startFromZero)
        } else
          xDomain = this.props.mark.position.x.domain
      }

      if (this.props.mark.position.z) {
        if (!this.props.mark.position.z.domain) {
          console.log(Object.keys(this.state.data[0]))
          zDomain = [];
          for (let k = 0; k < Object.keys(this.state.data[0]).length; k++)
            if (Object.keys(this.state.data[0])[k] !== this.props.mark.position.x.field)
              zDomain.push(Object.keys(this.state.data[0])[k]);
        } else
          zDomain = this.props.mark.position.z.domain
      }



      if (this.props.mark.position.y) {
        if (!this.props.mark.position.y.domain) {
          let min = 9999999999999999, max = -99999999999999999;
          for (let k = 0; k < zDomain.length; k++) {
            for (let i = 0; i < this.state.data.length; i++) {
              if (min > this.state.data[i][zDomain[k]]) {
                min = this.state.data[i][zDomain[k]]
              }
              if (max < this.state.data[i][zDomain[k]])
                max = this.state.data[i][zDomain[k]]
            }
          }
          if (this.props.mark.position.y.startFromZero)
            yDomain = [0, max]
          else
            yDomain = [min, max]
        } else
          yDomain = this.props.mark.position.y.domain
      }


      //Adding Scale
      let zRange = [];
      for (let i = 0; i < zDomain.length; i++) {
        zRange.push(i * this.props.style.dimensions.depth / (zDomain.length - 1))
      }
      let xRange = [];
      for (let i = 0; i < xDomain.length; i++) {
        xRange.push(i * this.props.style.dimensions.width / (xDomain.length - 1))
      }

      let xScale, yScale, zScale, colorScale;

      if (this.props.mark.position.x.scaleType === 'ordinal')
        xScale = d3.scaleOrdinal()
          .range(xRange)
          .domain(xDomain);
      else
        xScale = d3.scaleLinear()
          .range([0, this.props.style.dimensions.width])
          .domain(xDomain);

      yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([0, this.props.style.dimensions.height])

      if (this.props.mark.position.z.scaleType === 'ordinal')
        zScale = d3.scaleOrdinal()
          .domain(zDomain)
          .range(zRange);
      else
        zScale = d3.scaleLinear()
          .domain(zDomain)
          .range(zRange);

      let strokeColorScale, strokeColorDomain = this.props.mark.position.z.field, strokeColorRange;


      if (this.props.mark.style.stroke.scaleType) {
        let strokeColorRange = d3.schemeCategory10;
        if (this.props.mark.style.stroke.color)
          strokeColorRange = this.props.mark.style.stroke.color;
        if (this.props.mark.style.stroke.scaleType === 'ordinal')
          strokeColorScale = d3.scaleOrdinal()
            .domain(strokeColorDomain)
            .range(strokeColorRange)
        else {
          let domain_temp = zDomain.map((d, i) => parseFloat(d))
          strokeColorDomain = [Math.min(...domain_temp), Math.max(...domain_temp)]
          strokeColorScale = d3.scaleLinear()
            .domain(strokeColorDomain)
            .range(strokeColorRange)
        }
      }

      let fillColorScale, fillColorDomain = this.props.mark.position.z.field, fillColorRange;


      if (this.props.mark.style.fill.scaleType) {
        let fillColorRange = d3.schemeCategory10;
        if (this.props.mark.style.fill.color)
          fillColorRange = this.props.mark.style.fill.color;
        if (this.props.mark.style.fill.scaleType === 'ordinal')
          fillColorScale = d3.scaleOrdinal()
            .domain(fillColorDomain)
            .range(fillColorRange)
        else {
          let domain_temp = zDomain.map((d, i) => parseFloat(d))
          console.log(domain_temp);
          fillColorDomain = [Math.min(...domain_temp), Math.max(...domain_temp)]
          fillColorScale = d3.scaleLinear()
            .domain(fillColorDomain)
            .range(fillColorRange)
        }
      }

      //Axis
      let xAxis, yAxis, zAxis;

      if (this.props.xAxis) {
        xAxis = <Axis
          domain={xDomain}
          tick={this.props.xAxis.ticks}
          scale={xScale}
          axis={'x'}
          orient={this.props.xAxis.orient}
          title={this.props.xAxis.title}
          dimensions={this.props.style.dimensions}
          scaleType={this.props.mark.position.x.scaleType}
        />
      }

      if (this.props.yAxis) {
        yAxis = <Axis
          domain={yScale.ticks(this.props.yAxis.ticks['noOfTicks'])}
          tick={this.props.yAxis.ticks}
          scale={yScale}
          axis={'y'}
          orient={this.props.yAxis.orient}
          title={this.props.yAxis.title}
          dimensions={this.props.style.dimensions}
          scaleType={this.props.mark.position.y.scaleType}
        />
      }

      if (this.props.zAxis) {
        zAxis = <Axis
          domain={zDomain}
          tick={this.props.zAxis.ticks}
          scale={zScale}
          axis={'z'}
          orient={this.props.zAxis.orient}
          title={this.props.zAxis.title}
          dimensions={this.props.style.dimensions}
          scaleType={this.props.mark.position.z.scaleType}
        />

      }

      let box;
      if (this.props.axisBox) {
        box = <AxisBox
          width={this.props.style.dimensions.width}
          height={this.props.style.dimensions.height}
          depth={this.props.style.dimensions.depth}
          color={this.props.axisBox.color}
        />
      }

      //Adding marks
      let marks, line;
      if (this.props.mark.style.stroke)
        line = zDomain.map((d, i) => {
          let path = ''
          for (let j = 0; j < this.state.data.length; j++) {
            if (j !== this.state.data.length - 1)
              path = path + ` ${xScale(this.state.data[j][this.props.mark.position.x.field])} ${yScale(this.state.data[j][d])} ${zScale(d)},`
            else
              path = path + ` ${xScale(this.state.data[j][this.props.mark.position.x.field])} ${yScale(this.state.data[j][d])} ${zScale(d)}`
          }
          switch (this.props.mark.style.stroke.scaleType) {
            case 'ordinal':
              return <a-entity meshline={`lineWidth: ${this.props.mark.style.stroke.width}; path:${path}; color: ${strokeColorScale(d)}`}></a-entity>
            case 'linear':
              return <a-entity meshline={`lineWidth: ${this.props.mark.style.stroke.width}; path:${path}; color: ${strokeColorScale(parseFloat(d))}`}></a-entity>
            default:
              return <a-entity meshline={`lineWidth: ${this.props.mark.style.stroke.width}; path:${path}; color: ${this.props.mark.style.stroke.color}`}></a-entity>
          }
        })
      if (this.props.mark.style.fill)
        marks = zDomain.map((d, i) => {
          let path = `0 0 ${zScale(d)},`
          for (let j = 0; j < this.state.data.length; j++) {
            if (j !== this.state.data.length - 1)
              path = path + ` ${xScale(this.state.data[j][this.props.mark.position.x.field])} ${yScale(this.state.data[j][d])},`
            else
              path = path + ` ${xScale(this.state.data[j][this.props.mark.position.x.field])} ${yScale(this.state.data[j][d])}`
          }
          path = path + `, ${xScale(this.state.data[this.state.data.length - 1][this.props.mark.position.x.field])} 0`
          let primitive = `primitive: map; vertices: ${path}; extrude: 0.00000001`;
          switch (this.props.mark.style.fill.scaleType) {
            case 'ordinal':
              return <a-entity key={i} position={`0 0 ${zScale(d)}`} geometry={primitive} material={`color: ${fillColorScale(d)}; side: double; opacity:${this.props.mark.style.fill.opacity}`} />
            case 'linear':
              return <a-entity key={i} position={`0 0 ${zScale(d)}`} geometry={primitive} material={`color: ${fillColorScale(parseFloat(d))}; side: double; opacity:${this.props.mark.style.fill.opacity}`} />
            default:
              return <a-entity key={i} position={`0 0 ${zScale(d)}`} geometry={primitive} material={`color: ${this.props.mark.style.fill.color}; side: double; opacity:${this.props.mark.style.fill.opacity}`} />
          }
        })
      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation}>
          {xAxis}
          {yAxis}
          {zAxis}
          {box}
          {marks}
          {line}
        </a-entity>
      )
    }
  }
}
export default WaterFallPlot