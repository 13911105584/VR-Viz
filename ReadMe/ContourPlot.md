ContourPlot Component

<ContourPlot 
  style = {d.style}
  mark = {d.mark}
  x = {d.x}
  y = {d.y}
  z = {d.z}
/>


visualization={
  [
    {
      'type': 'ContourPlot',
      'style': {
        'origin': [0, 0, 0],
        'dimensions': {
          'width': 10,
          'height': 10,
          'depth': 10,
        },
        'axis-box': true,
        'axis-box-color': 'black',
      },
      'mark': {
        'path':{
          'type': 'line',
          'style': {
            'opacity': 0.4,
            'color': 'red',
          }
        }
      },
      'x': {
        'function': (y) => Math.sin(y),
        'axis': {
          'axis': true,
          'orient': 'bottom-back',
          'title': {
            'text': '',
            'font-size': 10,
            'color': 'black',
            'opacity': 1,
          },
          'ticks': {
            'no-of-ticks': 10,
            'tick-size': 0.1,
            'tick-color': 'black',
            'tick-opacity': 1,
            'grid': true,
            'grid-color': 'black',
            'grid-opacity': 1,
            'font': 'Arial',
            'font-size': 10,
          }
        },
      },
      'y': {
        'domain': [0, 2 * Math.PI],
        'range': [0, 10],
        'steps': 50,
        'axis': {
          'axis': true,
          'orient': 'bottom-back',
          'title': {
            'text': '',
            'font-size': 10,
            'color': 'black',
            'opacity': 1,
          },
          'ticks': {
            'no-of-ticks': 10,
            'tick-size': 0.1,
            'tick-color': 'black',
            'tick-opacity': 1,
            'grid': true,
            'grid-color': 'black',
            'grid-opacity': 1,
            'font-size': 10,
          }
        },
      },
      'z': {
        'function': (y) => Math.cos(y),
        'axis': {
          'axis': true,
          'orient': 'bottom-back',
          'title': {
            'text': '',
            'font-size': 10,
            'color': 'black',
            'opacity': 1,
          },
          'ticks': {
            'no-of-ticks': 10,
            'tick-size': 0.1,
            'tick-color': 'black',
            'tick-opacity': 1,
            'grid': true,
            'grid-color': 'black',
            'grid-opacity': 1,
            'font-size': 10,
          }
        },
      }
    }
  ]
}