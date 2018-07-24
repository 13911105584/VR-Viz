import React, { Component } from 'react';
import 'aframe';
import BarGraph from './BarGraph.js';
import ScatterPlot from './ScatterPlot.js';
import StackedBarGraph from './StackedBarGraph.js';
import SurfacePlot from './SurfacePlot.js';
import ContourPlot from './ContourPlot.js';
import PointCloud from './PointCloud.js';
import ConnectedScatterPlot from './ConnectedScatterPlot.js';
import ForceDirectedGraph from './ForceDirectedGraph.js';
import PrismMap from './PrismMap.js';
import MapBarChart from './MapBarChart.js';
import MapStackedBarChart from './MapStackedBarChart.js';
import MapContourLines from './MapContourLines.js';
import FlowMap from './FlowMap.js';
import ContourMap from './ContourMap.js';
import ParametricCurvePlot from './ParametricCurvePlot.js';
import ParametricSurfacePlot from './ParametricSurfacePlot.js';
import TreeMap from './TreeMap.js';
import WaterFallPlot from './WaterFallPlot.js';
import MeshPlot from './MeshPlot.js';
import RectangleChart from './RectangleChart.js';
import TimeSeries from './TimeSeries.js';
import MapTimeBars from './MapTimeBars.js';
import SpiralChart from './SpiralChart.js';


require('aframe-teleport-controls');

class Visualization extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    let light, camera, sky, floor, obj;
    if (this.props.scene) {
      //Light system
      light = this.props.scene.lights.map((item, i) => {
        let intensity, decay
        if (!item.intensity)
          intensity = 1
        else
          intensity = item.intensity;
        if (!item.decay)
          decay = 1
        else
          decay = item.decay;
        if (item.type === 'ambient')
          return <a-entity light={`type:${item.type}; color: ${item.color}; intensity: ${intensity}; decay: ${decay}`} key={i} />
        else
          return <a-entity light={`type:${item.type}; color: ${item.color}; castShadow: true; intensity: ${intensity}; decay: ${decay}`} position={item.position} key={i} />
      })

      //Camera Rig and Camera
      let fov
      if (!this.props.scene.camera.fov)
        fov = 80
      else
        fov = this.props.scene.camera.fov;
      let nearClipping
      if (!this.props.scene.camera.nearClipping)
        nearClipping = 0.005
      else
        nearClipping = this.props.scene.camera.nearClipping;
      let cameraSettings = `active: true;near:${nearClipping};fov:${fov}`
      camera = <a-entity id="cameraRig" position={this.props.scene.camera.position} rotation={this.props.scene.camera.rotation} wasd-controls="camera: #head">
        <a-entity id="head" camera={cameraSettings} position="0 1.6 0" look-controls >
        </a-entity>
        <a-entity id="left-hand" windows-motion-controls="hand: left" vive-controls="hand: left" teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head;">
        </a-entity>
        <a-entity id="right-hand" windows-motion-controls="hand: right" vive-controls="hand: right" gearvr-controls daydream-controls teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head;">
          <a-entity cursor="fuse: true; fuseTimeout: 50"
            position="0 0 -0.1"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
            material="color: black; shader: flat"
            raycaster="far: 1000; interval: 100;objects: .clickable;showLine: true;" />
          <a-entity
            id="hover"
            geometry="primitive: plane; height: auto; width: auto"
            material="color: #000; opacity: 1"
            position="3 -0.1 -5"
            rotation='0 0 0'
            text="align: center; color: #fff; anchor: center; value: "
            visible={false} />
        </a-entity>
      </a-entity>

      //Sky
      sky = this.props.scene.sky.style.texture === false ? <a-sky id="bg" color={this.props.scene.sky.style.color} /> : <a-sky id="bg" src={this.props.scene.sky.style.img} />;

      //Floor
      if (this.props.scene.floor) {
        if (this.props.scene.floor.style.texture) {
          if (this.props.scene.floor.style.repeat === null)
            floor = <a-plane src={this.props.scene.floor.style.img} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.depth}`} />
          else
            floor = <a-plane src={this.props.scene.floor.style.img} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.depth}`} repeat={this.props.scene.floor.style.repeat} />
        } else {
          floor = <a-plane color={this.props.scene.floor.style.color} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.depth}`} />
        }
      }

      //3D-Object
      if (this.props.scene['3D-objects']) {
        obj = this.props.scene['3D-objects'].map((item, i) => {
          return (
            <a-assets>
              <a-asset-item id={item.objectID} src={item.objectFile} />
              <a-asset-item id={item.materialID} src={item.materialFile} />
            </a-assets>
          )
        })
      }
    }
    // Adding Visualization

    let visualization = this.props.graph.map((d, i) => {
      switch (d.type) {
        case 'BarGraph': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<BarGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<BarGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'ConnectedScatterPlot': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ConnectedScatterPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<ConnectedScatterPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'ContourMap': {
          let heightThreshold;
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (!d.mark.heightThreshold)
            heightThreshold = 0
          else
            heightThreshold = d.mark.heightThreshold
          if (d.axis)
            return (<ContourMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              heightThreshold={heightThreshold}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<ContourMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              heightThreshold={heightThreshold}
              index={`Graph${i}`}
            />)
        }
        case 'ContourPlot': {
          if ((!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ContourPlot
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<ContourPlot
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'FlowMap': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<FlowMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<FlowMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'ForceDirectedGraph': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ForceDirectedGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<ForceDirectedGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'MapBarChart': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<MapBarChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<MapBarChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'MapStackedBarChart': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<MapStackedBarChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<MapStackedBarChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'ParametricCurvePlot': {
          if ((!d.style) || (!d.mark) || (!d.parameter))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ParametricCurvePlot
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              parameter={d.parameter}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<ParametricCurvePlot
              style={d.style}
              mark={d.mark}
              parameter={d.parameter}
              index={`Graph${i}`}
            />)
        }
        case 'ParametricSurfacePlot': {
          if ((!d.style) || (!d.mark) || (!d.parameter))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ParametricSurfacePlot
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              parameter={d.parameter}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<ParametricSurfacePlot
              style={d.style}
              mark={d.mark}
              parameter={d.parameter}
              index={`Graph${i}`}
            />)
        }
        case 'PointCloud': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<PointCloud
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<PointCloud
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'PrismMap': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<PrismMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<PrismMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'ScatterPlot': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ScatterPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<ScatterPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'StackedBarGraph': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<StackedBarGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<StackedBarGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'SurfacePlot': {
          if ((!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<SurfacePlot
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<SurfacePlot
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'TreeMap': {
          if ((!d.style) || (!d.data) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<TreeMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<TreeMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'WaterFallPlot': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<WaterFallPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<WaterFallPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'MeshPlot': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<MeshPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<MeshPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'RectangleChart': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<RectangleChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<RectangleChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'TimeSeries': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<TimeSeries
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<TimeSeries
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'MapTimeBars': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<MapTimeBars
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
            />)
          else
            return (<MapTimeBars
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'MapContourLines': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<MapContourLines
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
          else
            return (<MapContourLines
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
            />)
        }
        case 'SpiralChart': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.axis))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<SpiralChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              axis={d.axis}
              index={`Graph${i}`}
            />)
          else
            return (<SpiralChart
              data={d.data}
              style={d.style}
              index={`Graph${i}`}
            />)
        }
        default: {
          console.log('The visualization type does not match the set in the library.')
          break;
        }
      }

    })
    console.log(light)
    if (this.props.scene)
      return (
        <a-scene>
          {floor}
          {sky}
          {camera}
          {light}
          {obj}
          {visualization}
        </a-scene>
      )
    else
      return (
        { visualization }
      )
  }
}
export default Visualization