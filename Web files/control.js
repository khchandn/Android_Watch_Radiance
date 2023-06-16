Chart.pluginService.register({
	beforeDraw: function (chart) {
		if (chart.config.options.elements.center) {
			//Get ctx from string
			var ctx = chart.chart.ctx
			
			//Get options from the center object in options
			var centerConfig = chart.config.options.elements.center
			var fontStyle = centerConfig.fontStyle || 'Arial'
			var txt = centerConfig.text
			var color = centerConfig.color || '#000'
			var sidePadding = centerConfig.sidePadding || 20
			var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
			//Start with a base font of 30px
			ctx.font = '30px ' + fontStyle
			
			//Get the width of the string and also the width of the element minus 10 to give it 5px side padding
			var stringWidth = ctx.measureText(txt).width
			var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated
			
			// Find out how much the font can grow in width.
			var widthRatio = elementWidth / stringWidth
			var newFontSize = Math.floor(30 * widthRatio)
			var elementHeight = (chart.innerRadius * 2)
			
			// Pick a new font size so it will not be larger than the height of label.
			var fontSizeToUse = Math.min(newFontSize, elementHeight)
			
			//Set font settings to draw it correctly.
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2)
			var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2)
			ctx.font = fontSizeToUse + 'px ' + fontStyle
			ctx.fillStyle = color
			
			//Draw text in center
			ctx.fillText(txt, centerX, centerY)
		}
	}
})
var $select = $('select')
$select.each(function (index, item) {
	if (!$(item).val()) {
		$(item).addClass('disabled')
	} else {
		var $cardHeader = $(this).parents('.card').find('.card-header')
		$cardHeader.addClass('orange')
	}
})
$select.on('change', function () {
	var $cardHeader = $(this).parents('.card').find('.card-header')
	if ($(this).val()) {
		$(this).removeClass('disabled')
		$(this).trigger('blur')
		if ($cardHeader.hasClass('orange')) return
		$cardHeader.addClass('orange')
	} else {
		$(this).addClass('disabled')
		$cardHeader.removeClass('orange')
	}
})
// 上面第�?个图表�??�置
var originLabels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20']
var labels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20']
labels.position = 0
var data = [
	[10, 30, 40, 55, 30, 15, 50, 20, 60, 18],
	[40, 30, 60, 15, 60, 25, 35, 40, 30, 22]
]
var label = $('[name=rate]:checked').val()
var topHeartOptions = {
	labels: labels.slice(labels.position, 6),
	display: false,
	datasets: [{
		label: label,
		data: data[0].slice(labels.position, 6),
		borderColor: 'rgb(239, 54, 61)',
		backgroundColor: 'transparent',
		pointRadius: 1,
		borderWidth: 2,
		lineTension: 0
	}, {
		label: label,
		data: data[1].slice(labels.position, 6),
		borderColor: 'rgb(139, 144, 224)',
		backgroundColor: 'transparent',
		pointRadius: 1,
		borderWidth: 2,
		lineTension: 0
	}]
}
// 上面第�?个图表�??�置
var bloodLabels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20']
bloodLabels.position = 0
var bloodData = {
	'Blood Pressure 1': [20, 15, 40, 55, 30, 15, 40, 20, 20, 18],
	'Blood Pressure 2': [40, 30, 60, 35, 60, 25, 50, 40, 30, 22],
	'Blood Pressure 3': [33, 22, 36, 26, 73, 54, 67, 53, 30, 22],
}
var bloodOptions = {
	labels: bloodLabels.slice(bloodLabels.position, 6),
	display: false,
	datasets: [{
		label: 'Blood Pressure 1',
		data: bloodData['Blood Pressure 1'].slice(bloodLabels.position, 6),
		backgroundColor: 'rgba(16, 151, 233, .1)',
		pointRadius: 1,
		borderWidth: 3,
		borderColor: 'rgba(16, 151, 233, .1)'
	}, {
		label: 'Blood Pressure 2',
		data: bloodData['Blood Pressure 2'].slice(bloodLabels.position, 6),
		borderColor: '#1097e9',
		backgroundColor: 'transparent',
		pointRadius: 1,
		borderWidth: 3
	}, {
		label: 'Blood Pressure 3',
		data: bloodData['Blood Pressure 3'].slice(bloodLabels.position, 6),
		borderColor: 'rgb(239, 54, 61)',
		backgroundColor: 'transparent',
		pointRadius: 1,
		borderWidth: 3
	}]
}
// 上面两个心�??�表
var topHeartChart = initHeartChart($('#heartRate').get(0).getContext('2d'), topHeartOptions)
var bloodChart = initHeartChart($('#bloodPressure').get(0).getContext('2d'), bloodOptions)
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
toggleChart({
	leftBtn: $('.left-bottom-btn'),
	rightBtn: $('.right-bottom-btn'),
	ele: $('#bloodPressure').get(0).getContext('2d'),
	data: bloodData,
	labels: bloodLabels,
	legends: ['Blood Pressure 1', 'Blood Pressure 2', 'Blood Pressure 3'],
	chart: bloodChart,
	options: bloodOptions
})
$('[name=rate]').on('change', function  () {
	labels = originLabels.slice()
	labels.position = 0
	var val = $(this).val()
	if (val === 'Heart Beat Rate') {
		data = [
			[10, 30, 40, 55, 30, 15, 50, 20, 60, 18],
			[40, 30, 60, 15, 60, 25, 35, 40, 30, 22]
		]
	} else {
		data = [
			[15, 35, 24, 10, 21, 33, 44, 20, 60, 18],
			[18, 22, 40, 38, 60, 34, 14, 77, 30, 22]
		]
	}
	topHeartOptions = {
		labels: labels.slice(labels.position, 6),
		display: false,
		datasets: [{
			label: label,
			data: data[0].slice(labels.position, 6),
			borderColor: val === 'Heart Beat Rate' ? 'rgb(255, 80, 80)' : 'rgb(245, 188, 183)',
			backgroundColor: 'transparent',
			pointRadius: 1,
			borderWidth: 2,
			lineTension: 0
		}, {
			label: label,
			data: data[1].slice(labels.position, 6),
			borderColor: val === 'Heart Beat Rate' ? 'rgb(63, 77, 197)' : 'rgb(148, 215, 236)',
			backgroundColor: 'transparent',
			pointRadius: 1,
			borderWidth: 2,
			lineTension: 0
		}]
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
					title: function () {
						return false
					},
					// label(tooltipItem, data) {
					// 	var datasets = data.datasets
					// 	var index = tooltipItem.index
					// 	return datasets[tooltipItem.datasetIndex].label + '.' + tooltipItem.xLabel + ':' + datasets[tooltipItem.datasetIndex].data[index]
					// }
				}
				// displayColors: false
			}
		}
	})
}
function renderDoughnut(ele, options) {
	var labels = options.labels
	var total = options.data.reduce(function (prev, curr) {
		return prev + curr
	}, 0)
	new Chart(ele, {
		type: 'doughnut',
		data: {
			labels: labels,
			datasets: [{
				backgroundColor: options.backgroundColor,
				data: options.data
			}]
		},
		options: {
			responsive: true,
			elements: {
				center: {
					text: parseInt(options.data[0] * 100 / total) + '%',
					color: options.backgroundColor[0], //Default black
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
}
function toggleChart(options) {
	var leftBtn = options.leftBtn
	var rightBtn = options.rightBtn
	var ele = options.ele
	var data = options.data
	var labels = options.labels
	var chart = options.chart
	var legends = options.legends
	var chartOptions = options.options
	leftBtn.off('click').on('click', function () {
		if (labels.position === 0) return
		labels.position--
		chart.destroy()
		labels.unshift(labels.pop())
		chartOptions.labels = labels.slice(0, 6)
		legends.forEach(function (item, index) {
			data[item].unshift(data[item].pop())
			chartOptions.datasets[index].data = data[item].slice(0, 6)
		})
		chart = initHeartChart(ele, chartOptions)
	})
	rightBtn.off('click').on('click', function () {
		if (labels.position === labels.length - 6) return
		labels.position++
		chart.destroy()
		labels.push(labels.shift())
		chartOptions.labels = labels.slice(0, 6)
		legends.forEach(function (item, index) {
			data[item].push(data[item].shift())
			chartOptions.datasets[index].data = data[item].slice(0, 6)
		})
		chart = initHeartChart(ele, chartOptions)
	})
}

$('.input-group button').on('click', function () {
	var $parent = $(this).parents('.input-group')
	var val = $parent.find('input').val()
	var time = new Date().toLocaleTimeString()
	if (val && val.trim()) {
		$parent.siblings('.table-responsive').find('thead').after('<tr>\n' +
			'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td>' + time + '</td>\n' +
			'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td>' + val + '</td>\n' +
			'\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>')
		$parent.find('input').val('')
	}
})

renderDoughnut($('#heartBeat'), {
	labels: ['Heart Beat Rate'],
	backgroundColor: [
		'rgb(255, 80, 80)',
		'rgba(255, 80, 80, .1)',
	],
	data: [50, 50]
})
renderDoughnut($('#Breathing'), {
	labels: ['Breathing Rate'],
	backgroundColor: [
		'rgb(245, 188, 183)',
		'rgba(245, 188, 183, .1)',
	],
	data: [30, 70]
})
renderDoughnut($('#variability'), {
	labels: ['Heart Rate Variability'],
	backgroundColor: [
		'rgb(241, 86, 94)',
		'rgba(241, 86, 94, .1)',
	],
	data: [30, 70]
})
renderDoughnut($('#heartBeat1'), {
	labels: ['Heart Beat Rate'],
	backgroundColor: [
		'rgb(63, 77, 197)',
		'rgba(63, 77, 197, .1)',
	],
	data: [50, 50]
})
renderDoughnut($('#Breathing1'), {
	labels: ['Breathing Rate'],
	backgroundColor: [
		'rgb(148, 215, 236)',
		'rgba(148, 215, 236, .1)',
	],
	data: [30, 70]
})
renderDoughnut($('#variability1'), {
	labels: ['Heart Rate Variability'],
	backgroundColor: [
		'rgb(96, 134, 241)',
		'rgba(96, 134, 241, .1)',
	],
	data: [30, 70]
})

$('.toggle').on('click', function () {
	$(this).find('.fa').toggleClass('fa-caret-up')
	$(this).find('.fa').toggleClass('fa-caret-down')
	$(this).parent().find('.select-parent').slideToggle()
})
