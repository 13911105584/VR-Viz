Bargraph Component

<BarGraph 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
  x = {d.x}
  y = {d.y}
  z = {d.z}
/>


visualization={
  [
    {
      'type': 'BarGraph',
      'data': {
        'dataFile': "data/barGraph.csv",
        'fileType': 'csv',
        'fieldDesc': [['Year', 'text'], ['Month', 'text'], ['Tornadoes', 'number'], ['Deaths', 'number']]
      },
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
        'bars':{
          'type': 'box',
          'style': {
            'depth': 0.2,
            'width': 0.2,
            'opacity': 0.4,
            'color': {
              'scale': true,
              'scaleType': 'linear',
              'field': 'Deaths',
              'fill': ['red', 'green'],
            },
          }
        }
      },
      'x': {
        'type': 'ordinal',
        'field': 'Month',
        'domain': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
        'type': 'linear',
        'field': 'Tornadoes',
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
        'type': 'ordinal',
        'field': 'Year',
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