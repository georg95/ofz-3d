

function parseOfzCsv(row) {
  var values = row.split(';')
  return values.slice(0, 1).concat(values.slice(2).map(value => Number(value.replace(',', '.'))));
}

function averageCurve(curves) {
  var MMYY = curves[0][0].split('.').slice(1).join('.')
  let resultCurve = [MMYY].concat(new Array (curves[0].length - 1).fill(0))
  curves.forEach(curve => {
    curve.forEach((value, i) => {
      if (i >= 1) {
        resultCurve[i] += value / curves.length
      }
    })
  })
  return resultCurve
}

function averageByMonths(data) {
  var resultCurve = []
  var monthData = {}
  data.forEach(curve => {
    var MMYY = curve[0].split('.').slice(1).join('.')
    if (!monthData[MMYY]) { monthData[MMYY] = [] }
    monthData[MMYY].push(curve)
  })
  
  var y_data = []
  for (var MMYY in monthData) {
    y_data.push(new Array(monthData[MMYY].length - 1).fill(new Date(MMYY.split('.').reverse().join('-') + '-01')))
    resultCurve.push(averageCurve(monthData[MMYY]).slice(1))
  }
  var x_data = resultCurve.map(c => ['0.25 лет','0.5 лет','0.75 лет','1 год','2 года','3 года','5 лет','7 лет','10 лет','15 лет','20 лет','30 лет'])
  return [resultCurve, x_data, y_data]
}

var [z_data, x_data, y_data] = averageByMonths(window.yuieldCsv.split('\n').map(parseOfzCsv))

console.log(z_data)

var data = [{
           z: z_data,
           x: x_data,
           y: y_data,
           type: 'surface',
           autocolorscale: false,
           colorscale: [
              [0, 'rgb(25, 33, 177)'],
              [0.2, 'rgb(0, 182, 79)'],
              [0.4, 'rgb(255, 241, 0)'],
              [0.6, 'rgb(255, 146, 0)'],
              [0.8, 'rgb(255, 24, 0)'],
              [1, 'rgb(203, 0, 119)']]
        }];

var layout = {
  title: 'Кривая бескупонной доходности ОФЗ',
  margin: {
    l: 40,
    r: 40,
    b: 40,
    t: 90,
  },
  scene: {
    aspectratio: {
       x: 1, y: 4, z: 3
    },
    camera: {
      center: { x: 0, y: 1, z: -0.8 },
      eye: { x: -2.5, y: 0, z: -0.5 }
    }
  }
};
Plotly.newPlot('ofzVisualize', data, layout);
