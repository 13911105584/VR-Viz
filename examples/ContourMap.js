import React, { Component } from 'react';
import './App.css';
import Visualization from './Component/Visualization.js'
import mapData from './mapData/mapData.json'

class App extends Component {
  render() {
    return (
      <Visualization
        scene={
          {
            'sky': {
              'style': {
                'color': '#ccc',
                'texture': false,
              }
            },
            'lights': [
              {
                'type': 'directional',
                'color': '#fff',
                'position': '0 1 1',
                'intensity': 1,
                "decay": 1,
              },
              {
                'type': 'ambient',
                'color': '#fff',
                'intensity': 1,
                "decay": 1,
              }
            ],
            'camera': {
              'position': '0 0 10',
              'rotation': '0 0 0',
            },
          }
        }
        graph={
          [
            {
              'type': 'ContourMap',
              'data': {
                'dataFile': "data/contourMapData.csv",
                'fileType': 'text',
              },
              'style': {
                'origin': [0, 0, 0],
              },
              'mark': {
                'style': {
                  'opacity': 0.4,
                  'fill': {
                    'scale': true,
                    'color': ['green', 'blue'],
                  },
                  'stroke': {
                    'width': 1,
                    'color': 'black',
                  },
                  'scale': {
                    'ground': 0.1,
                    'height': 0.1,
                  }
                },
              },
              'heightThreshold': 100,
            }
          ]
        }
      />
    );
  }
}

export default App;

