var sqlheartdata
var originLabels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20'];
var labels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20'];
var topHeartOptions = {
	// display: true,
	labels: [],
	datasets: [{
	  label: 'Heart Beat Rate',
	  data: [],
	  borderColor: '#ffce37',
	  backgroundColor: 'transparent',
	  pointRadius: 3,
	  borderWidth: 1,
	  lineTension: 0
	},
	{
	//   display: true,
	  label: 'Breathing Rate',
	  data: [],
	  borderColor: '#8abe78',
	  backgroundColor: 'transparent',
	  pointRadius: 3,
	  borderWidth: 1,
	  lineTension: 0
	}]
}

function update() {
  fetch('readdata.php')
    .then(response => response.json())
    .then(data => {
    //   console.log(data);
      sqlheartdata = data;
      labels.position = 0;

      topHeartOptions = {
		// display: true,
        labels: sqlheartdata.slice(-6).map(function(item) {return item.x;}),
        datasets: [{
          label: 'Heart Beat Rate',
          data: sqlheartdata.slice(-6).map(function(item) {return item.y;}),
          borderColor: '#ffce37',
          backgroundColor: 'transparent',
          pointRadius: 3,
          borderWidth: 1,
          lineTension: 0
        },
        {
		//   display: true,
          label: 'Breathing Rate',
          data: sqlheartdata.slice(-6).map(function(item) {return item.y;}),
          borderColor: '#8abe78',
          backgroundColor: 'transparent',
          pointRadius: 3,
          borderWidth: 1,
          lineTension: 0
        }]
      };

      // Update chart options with new data
    //   var chart = Chart.instances[0];
    //   chart.options.scales.yAxes[0].ticks.max = Math.max(...sqlheartdata) + 10;
    //   chart.data = topHeartOptions;
    //   chart.update();
    })
    .catch(error => console.error(error));
	toggleChart({
		leftBtn: $('.left-top-btn'),
		rightBtn: $('.right-top-btn'),
		ele: $('#heartRate').get(0).getContext('2d'),
		data: sqlheartdata.slice(-6).map(function(item) {return item.y;}),
		labels: labels,
		chart: topHeartChart,
		options: topHeartOptions
	})
	console.log(sqlheartdata.slice(-6).map(function(item) {return item.y;}));
	console.log(sqlheartdata.slice(-6).map(function(item) {return item.x;}));
}

Chart.pluginService.register({
  beforeDraw: function (chart) {
    if (chart.config.options.elements.center) {
      //Get ctx from string
      var ctx = chart.chart.ctx;

      //Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
      //Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight);

      //Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});

var bloodLabels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20']
bloodLabels.position = 0
var bloodData = {
	'2018': [20, 15, 40, 55, 30, 15, 40, 20, 20, 18],
	'2019': [40, 30, 60, 35, 60, 25, 50, 40, 30, 22]
}

var bloodOptions = {
	labels: bloodLabels.slice(bloodLabels.position, 6),
	display: false,
	datasets: [{
		label: 'Heart Beat Rate',
		data: bloodData['2019'].slice(bloodLabels.position, 6),
		backgroundColor: 'rgba(16, 151, 233, .1)',
		pointRadius: 3,
		borderWidth: 1,
		borderColor: 'rgba(16, 151, 233, .1)'
	}, {
		label: 'Breathing Rate',
		data: bloodData[2018].slice(bloodLabels.position, 6),
		borderColor: '#1097e9',
		backgroundColor: 'transparent',
		pointRadius: 1,
		borderWidth: 5
	}]
}
//Three donut graph
new Chart($('#topRate').get(0).getContext('2d'), {
	type: 'doughnut',
	data: {
		labels: ['Heart Rate Variability'],
		datasets: [{
			backgroundColor: [
				'#6084fd',
				'rgb(208, 227, 254)'
			],
			data: [50, 50]
		}]
	},
	options: {
		responsive: true,
		elements: {
			center: {
				text: '50%',
				color: '#6084fd', //Default black
				fontStyle: 'Helvetica', //Default Arial
				sidePadding: 30 //Default 20 (as a percentage)
			}
		},
		legend: {
			position: 'bottom',
			display: true,
			labels: {
				boxWidth: 8,
				fontSize: 12
			}
		},
		tooltips: {
			enabled: false
		}
	}
})
new Chart($('#topPressure').get(0).getContext('2d'), {
	type: 'doughnut',
	data: {
		labels: ['Heart Beat Rate'],
		datasets: [{
			backgroundColor: [
				'#feb23a',
				'rgb(255, 245, 229)'
			],
			data: [30, 70]
		}]
	},
	options: {
		responsive: true,
		elements: {
			center: {
				text: '30%',
				color: '#feb23a', //Default black
				fontStyle: 'Helvetica', //Default Arial
				sidePadding: 30 //Default 20 (as a percentage)
			}
		},
		legend: {
			position: 'bottom',
			display: true,
			labels: {
				boxWidth: 8,
				fontSize: 12
			}
		},
		tooltips: {
			enabled: false
		}
	}
})
new Chart($('#topPressure2').get(0).getContext('2d'), {
	type: 'doughnut',
	data: {
		labels: ['Breathing Rate'],
		datasets: [{
			backgroundColor: [
				'#8abe78',
				'rgb(231, 251, 223)'
			],
			data: [30, 70]
		}]
	},
	options: {
		responsive: true,
		elements: {
			center: {
				text: '30%',
				color: '#8abe78', //Default black
				fontStyle: 'Helvetica', //Default Arial
				sidePadding: 30 //Default 20 (as a percentage)
			}
		},
		legend: {
			position: 'bottom',
			display: true,
			labels: {
				boxWidth: 8,
				fontSize: 12
			}
		},
		tooltips: {
			enabled: false
		}
	}
})

var topHeartChart = initHeartChart($('#heartRate').get(0).getContext('2d'), topHeartOptions)
var bloodChart = initHeartChart($('#bloodPressure').get(0).getContext('2d'), bloodOptions)	
toggleChart({
	leftBtn: $('.left-top-btn'),
	rightBtn: $('.right-top-btn'),
	ele: $('#heartRate').get(0).getContext('2d'),
	data: sqlheartdata,
	labels: labels,
	chart: topHeartChart,
	options: topHeartOptions
})
toggleChart({
	leftBtn: $('.left-bottom-btn'),
	rightBtn: $('.right-bottom-btn'),
	ele: $('#bloodPressure').get(0).getContext('2d'),
	data: bloodData,
	labels: bloodLabels,
	chart: bloodChart,
	options: bloodOptions
})
$('[name=rate]').on('change', function  () {
	labels = originLabels.slice()
	labels.position = 0
	var val = $(this).val()
	if (val === '2019') {
		topHeartOptions = {
			labels: labels.slice(labels.position, 6),
			datasets: [{
				label: 'Breathing Rate',
				data: data['2019'].slice(labels.position, 6),
				borderColor: '#8abe78',
				backgroundColor: 'transparent',
				pointRadius: 3,
				borderWidth: 1,
				lineTension: 0
			}]
		}
	} else {
		topHeartOptions = {
			labels: labels.slice(labels.position, 6),
			datasets: [{
				label: 'Heart Beat Rate',
				data: data[2018].slice(labels.position, 6),
				borderColor: '#ffce37',
				backgroundColor: 'transparent',
				pointRadius: 3,
				borderWidth: 1,
				lineTension: 0
			}]
		}
	}
	var canvas = $('#heartRate').get(0).getContext('2d')
	topHeartChart.destroy()
	topHeartChart = initHeartChart(canvas, topHeartOptions)
	toggleChart({
		leftBtn: $('.left-top-btn'),
		rightBtn: $('.right-top-btn'),
		ele: $('#heartRate').get(0).getContext('2d'),
		data: data,
		labels: labels,
		legends: [0, 1],
		chart: topHeartChart,
		options: topHeartOptions
	})
})

function initHeartChart(ele, data) {
	return new Chart(ele, {
		type: 'line',
		data: data,
		options: {
			layout: {
				padding: 10
			},
			legend: {
				position: 'top',
				display: data.display,
				labels: {
					boxWidth: 12
				}
			},
			scales: {
				xAxes: [{
					gridLines: {
						display: false
					}
				}],
				yAxes: [{
					ticks: {
						max: 100,
						stepSize: 20,
						min: 0
					},
					gridLines: {
						display: true
					}
				}]
			},
			tooltips: {
				callbacks: {
					title() {
						return false
					},
					label(tooltipItem, data) {
						var datasets = data.datasets
						var index = tooltipItem.index
						return datasets[tooltipItem.datasetIndex].label + '.' + tooltipItem.xLabel + ':' + datasets[tooltipItem.datasetIndex].data[index]
					}
				}
				// displayColors: false
			}
		}
	})
}

function toggleChart(options) {
	var leftBtn = options.leftBtn
	var rightBtn = options.rightBtn
	var ele = options.ele
	var data = options.data
	var labels = options.labels
	var chart = options.chart
	var chartOptions = options.options
	if (sqlheartdata && sqlheartdata.length) {
		var labels = sqlheartdata.map(function(dataPoint) { 
		  return new Date(dataPoint.x).toLocaleString()
		});
	  }
	if (data && data.length) {
		var labels = sqlheartdata.map(function(dataPoint) { 
		  return new Date(dataPoint.x).toLocaleString()
		});
	  }

	leftBtn.on('click', function () {
		if (labels.position === 0) return
		labels.position--
		console.log(labels.position)
		chart.destroy()
		labels.unshift(labels.pop())
		chartOptions.labels = labels.slice(0, 6)
		console.log(data.pop())
		// data[2018].unshift(data[2018].pop())
		// data[2019].unshift(data[2019].pop())
		chartOptions.datasets[0].data = data.slice(0, 6)
		// chartOptions.datasets[1] && (chartOptions.datasets[1].data = data[2018].slice(0, 6))
		chart = initHeartChart(ele, chartOptions)
	})

	rightBtn.on('click', function () {
		if (labels.position === labels.length - 6) return
		labels.position++
		console.log(labels.position)
		chart.destroy()
		labels.push(labels.shift())
		chartOptions.labels = labels.slice(0, 6)
		data.push(data.shift())
		// data[2018].push(data[2018].shift())
		// data[2019].push(data[2019].shift())
		chartOptions.datasets[0].data = data.slice(0, 6)
		// chartOptions.datasets[1] && (chartOptions.datasets[1].data = data[2018].slice(0, 6))
		chart = initHeartChart(ele, chartOptions)
	})
}
$('.info button').on('click', function () {
	/*var $parent = $(this).parents('.event-card')
	var val = $parent.find('input').val()
	var time = new Date().toLocaleDateString()
	if (val && val.trim()) {
		$parent.find('.table-responsive').find('thead').after('<tr>\n' +
			'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td>' + time + '</td>\n' +
			'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td>'+ val +'</td>\n' +
			'\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>')
		$parent.find('input').val('')
  }
  	*/
      var tmin = Math.floor(sec / 60);
    var tsec = sec % 60;

    if (tmin < 10) { tmin = "0" + tmin };
    if (tsec < 10) { tsec = "0" + tsec };

    var temp = "<tr><td>" + tmin + ":" + tsec + "</td><td>" + document.getElementById('log-input').value + "</td></tr>";
    document.getElementById("table-log").innerHTML = temp + document.getElementById("table-log").innerHTML;  
  
})
$('.toggle').on('click', function () {
  $(this).find('.fa').toggleClass('fa-caret-up')
	$(this).find('.fa').toggleClass('fa-caret-down')
	$(this).parent().find('.select-parent').slideToggle()
})






setInterval(update, 1000);