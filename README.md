# VR-Viz

A-Frame based React component for data visualization in VR and AR.

VR-Viz provides a higher-level react components for data visualization in webVR. VR-Viz is a collection of reusable visualization React components. VR-Viz combines A-Frame with React (for DOM manipulation) and D3 (for data visualizations) to generate visualization in VR. 

### Goal
The goal is to create a library of reusable React components that can be used to make reusable charts, visualizations, or dashboards in VR or custom visualization or data stories in VR. 

### How?
Under the hood, VR-Viz uses D3 for the data manipulation and generating layouts for certain visualization types and React for DOM manipulation and to add A-Frame entities and geometry to the 3D scene.

### Supported Visualization
* [3D Bar Graph](/ReadMe/BarGraph.md)
* [3D Stacked Bar Graph](/ReadMe/StackedBarGraph.md)
* [3D Scatter Plot / 3D Bubble Chat](/ReadMe/ScatterPlot.md)
* [3D Connected Scatter Plot](/ReadMe/ConnectedScatterPlot.md)
* [3D Contour Plot](/ReadMe/ContourPlot.md)
* [3D Surface Plot](/ReadMe/SurfacePlot.md)
* [3D Force Directed Graph](/ReadMe/ForceDirectedGraph.md)
* [3D Prism Map](/ReadMe/PrismMap.md)
* [3D Map Bar Graph](/ReadMe/MapBarChart.md)
* [3D Flow Map](/ReadMe/FlowMap.md)
* [3D Contour Map](/ReadMe/ContourMap.md)
* [3D Point Cloud](/ReadMe/PointCloud.md)

###### To-Do
* 3D TreeMap
* Waterfall Plot
* 3D Parametric Curve Plot
* 3D Parametric Surface Plot
* 3D Mesh Plot
* 3D Map Stacked Bar Graph
* 3D Time Series
* Interactivity
* Animation

### Start using VR-Viz - Setting Up the Visualization Scene


##### Installation

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This project uses yarn. Install it as described here [https://yarnpkg.com/lang/en/](https://yarnpkg.com/lang/en/) if you haven't already.

To install this project, simply clone the repo and run yarn

##### Local Development
In the project directory, you can run:
```
yarn start
```
Runs the app in the development mode.
