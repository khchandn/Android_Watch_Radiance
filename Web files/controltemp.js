var sqlheartdata;
var topHeartChart;
var douHeartChart;
var time1;
var extractedheartdata1;
var display_time1; // for display default 30 datas
var display_extractedheartdata1; // for display default 30 datas

var time2;
var extractedheartdata2;
var display_time2; // for display default 30 datas
var display_extractedheartdata2; // for display default 30 datas


// var dataa = [10,10,4,10,10,10,10];
var startIndex;
var countIndex;
var firstUserID;

// register a custom plugin
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


const config = { // config of the graph
    type: 'line',
    data: topHeartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        }
      }
    },
  };



function initChart(element, data) {   // init the graph
	return new Chart(element, {
		type: 'line',
		data: data,
		options: {
			layout: {
				padding: 10
			},
			legend: {
				// position: 'top',
        display: false,
				// display: data.display,
				labels: {
					boxWidth: 12
				}
			},
        animation: false,
			scales: {
				xAxes: [{
					gridLines: {
						display: false
					}
				}],
				yAxes: [{
					ticks: {
						// max: 100,
						// // stepSize: 20,
						// min: 40
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
            var xLabel = tooltipItem.xLabel;
            var yLabel = tooltipItem.yLabel;
						return datasets[tooltipItem.datasetIndex].label + '.' + tooltipItem.xLabel + ' Heart Beat Rate:' + tooltipItem.yLabel
					}
				}
				// displayColors: false
			}
		}
	})
}

var topHeartData = {
	labels: [],
	datasets: [{
		label: 'User A',
		data: [],
		borderColor: 'rgb(239, 54, 61)',
		backgroundColor: 'transparent',
	}, {
		label: 'User B',
		data: [],
		borderColor: 'rgb(139, 144, 224)',
		backgroundColor: 'transparent',
	}]
}

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


topHeartChart = initChart($('#heartRate').get(0).getContext('2d'), topHeartData);
var bloodChart = initChart($('#bloodPressure').get(0).getContext('2d'), bloodOptions)


function extractData(orgdata) {
    // extract data from database
    if (orgdata) {
      if (!time1 && !extractedheartdata1) {
        console.log('empty');
        firstUserID = orgdata[0].userID;
        console.log(firstUserID);
        // extract data for User A
        display_time1 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
          .filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return new Date(item.x).toLocaleTimeString();});
        time1 = orgdata.filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return new Date(item.x).toLocaleTimeString();});
        display_extractedheartdata1 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
          .filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return item.y});
        extractedheartdata1 = orgdata
          .filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return item.y});
        // extract data for User B
        var userIDSet = new Set();
        for (var i = 0; i < orgdata.length; i++) {
          userIDSet.add(orgdata[i].userID);
        }
        var userIDCount = userIDSet.size;
        if (userIDCount > 1) {
          var secondUserID = Array.from(userIDSet).find(function(userID) {
            return userID != firstUserID;
          });
          display_time2 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
            .filter(function(item) {return item.userID == secondUserID})
            .map(function(item) {return new Date(item.x).toLocaleTimeString();});
          time2 = orgdata.filter(function(item) {return item.userID == secondUserID})
            .map(function(item) {return new Date(item.x).toLocaleTimeString();});
          display_extractedheartdata2 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
            .filter(function(item) {return item.userID == secondUserID})
            .map(function(item) {return item.y});
          extractedheartdata2 = orgdata
            .filter(function(item) {return item.userID == secondUserID})
            .map(function(item) {return item.y});
          // upGraph();
        }
        upDonut(douHeartBeatChartA);
      }

      if (new Date(sqlheartdata[sqlheartdata.length - 1].x).toLocaleTimeString() > time1[time1.length - 1]) {
        firstUserID = orgdata[0].userID;
        console.log(firstUserID);
        // extract data for User A
        display_time1 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
          .filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return new Date(item.x).toLocaleTimeString();});
        time1 = orgdata.filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return new Date(item.x).toLocaleTimeString();});
        display_extractedheartdata1 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
          .filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return item.y});
        extractedheartdata1 = orgdata
          .filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return item.y});
        // extract data for User B
        var userIDSet = new Set();
        for (var i = 0; i < orgdata.length; i++) {
          userIDSet.add(orgdata[i].userID);
        }
        var userIDCount = userIDSet.size;
        if (userIDCount > 1) {
          var secondUserID = Array.from(userIDSet).find(function(userID) {
            return userID != firstUserID;
          });
          display_time2 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
            .filter(function(item) {return item.userID == secondUserID})
            .map(function(item) {return new Date(item.x).toLocaleTimeString();});
          time2 = orgdata.filter(function(item) {return item.userID == secondUserID})
            .map(function(item) {return new Date(item.x).toLocaleTimeString();});
          display_extractedheartdata2 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
            .filter(function(item) {return item.userID == secondUserID})
            .map(function(item) {return item.y});
          extractedheartdata2 = orgdata
            .filter(function(item) {return item.userID == secondUserID})
            .map(function(item) {return item.y});
          // upGraph();
      }
      upDonut(douHeartBeatChartA);
    }
    startIndex = time1?time1.length:0;
    countIndex = startIndex;
  }
}


function renderDoughnut(ele, options) {
	var labels = options.labels
	var total = options.data.reduce(function (prev, curr) {
		return prev + curr
	}, 0)
	var chart = new Chart(ele, {
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
					text: ' ',
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
  console.log('rened donut');
  return chart;
}

function update() { // fetch data from database and update the chart
    fetch('readdataduouser.php')
      .then(response => response.json())
      .then(data => {
      //   console.log(data);
        sqlheartdata = data;
        // labels.position = 0;
  
        // Update chart options with new data
      //   var chart = Chart.instances[0];
      //   chart.options.scales.yAxes[0].ticks.max = Math.max(...sqlheartdata) + 10;
      //   chart.data = topHeartOptions;
      //   chart.update();
      })
      .catch(error => console.error(error));
      // console.log(sqlheartdata.slice(-6).map(function(item) {return item.y;}));
      // console.log(sqlheartdata.slice(-6).map(function(item) {return item.x;}));
      extractData(sqlheartdata);
      // console.log(sqlheartdata);
//     if(sqlheartdata){
//       if(!time1&&!extractedheartdata1){
//         console.log('empty');
//         firstUserID = sqlheartdata[0].userID;
//         //extract User A Data
//         display_time1 = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30)
//         .filter(function(item) {return item.userID == firstUserID})
//         .map(function(item) {return new Date(item.x).toLocaleTimeString();});
//         time1 = sqlheartdata.filter(function(item) {return item.userID == firstUserID})
//         .map(function(item) {return new Date(item.x).toLocaleTimeString();});
//         display_extractedheartdata1 = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30)
//         .filter(function(item) {return item.userID == firstUserID})
//         .map(function(item) {return item.y});
//         extractedheartdata1 = sqlheartdata
//         .filter(function(item) {return item.userID == firstUserID})
//         .map(function(item) {return item.y});
//         //extract User B Data
//         var userIDCounts = sqlheartdata.reduce(function(obj, item) {
//             if (!obj[item.userID]) {
//               obj[item.userID] = 0;
//             }
//             obj[item.userID]++;
//             return obj;
//           }, {});

//         var userIDCount = Object.keys(userIDCounts).length;
//         if (userIDCount > 1) {
//             display_time2 = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30)
//             .filter(function(item) {return item.userID != firstUserID})
//             .map(function(item) {return new Date(item.x).toLocaleTimeString();});
//             time2 = sqlheartdata.filter(function(item) {return item.userID != firstUserID})
//             .map(function(item) {return new Date(item.x).toLocaleTimeString();});
//             display_extractedheartdata2 = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30)
//             .filter(function(item) {return item.userID != firstUserID})
//             .map(function(item) {return item.y});
//             extractedheartdata2 = sqlheartdata
//             .filter(function(item) {return item.userID != firstUserID})
//             .map(function(item) {return item.y});
//             // upGraph();
//         }
//         upGraph(topHeartChart);
//         console.log('filled');
//       }
//       console.log(new Date(sqlheartdata[sqlheartdata.length - 1].x).toLocaleTimeString());
//       console.log((display_time1[display_time1.length - 1]));
//       if (new Date(sqlheartdata[sqlheartdata.length - 1].x).toLocaleTimeString() > time1[time1.length - 1]) {
//       console.log('new time');
//       display_time1 = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30).map(function(item) {return new Date(item.x).toLocaleTimeString();});
//       time1 = sqlheartdata.map(function(item) {return new Date(item.x).toLocaleTimeString();});
//       display_extractedheartdata1 = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30).map(function(item) {return item.y});
//       extractedheartdata1 = sqlheartdata.map(function(item) {return item.y});
//       // console.log(extractedheartdata);
//       // console.log(dataa);
//       topHeartData.labels = time1;
//       topHeartData.datasets[0].data = extractedheartdata1;
//       startIndex = time?time.length:0;
//       countIndex = startIndex;
  
  
//       // Updating the Heart Beat Rate dounut chart
//     //   douHeartChartCircle = [extractedheartdata[extractedheartdata.length - 1], 100 - extractedheartdata[extractedheartdata.length - 1]];
//     //   douHeartChart.data.datasets[0].data = douHeartChartCircle; // the array in javascript need a index (the database one)
//     //   douHeartChart.options.elements.center.text = extractedheartdata[extractedheartdata.length - 1];
//     //   douHeartChart.update();
//     }
//     else{
//       // time.length = 0;
//       // display_time.length = 0;
//       // extractedheartdata.length = 0;
//       // display_extractedheartdata.length = 0;
//       // upGraph(topHeartChart);
//     }
  
//   }
    upGraph(topHeartChart);
}


function upGraph(chart){    // update the graph

    if(sqlheartdata){
      if (sqlheartdata && extractedheartdata1) {
        // Use extractedheartdata as the data for the line chart
        // var data = {
        //   labels: display_time1,
        //   datasets: [
        //     {
        //       label: 'Heart Beat Rate',
        //       data: display_extractedheartdata1,
        //       borderColor: '#ffce37',
        //       backgroundColor: 'transparent',
        //     }
        //   ]
        // }

        topHeartData.labels = display_time1;
        topHeartData.datasets[0].data = display_extractedheartdata1;
        if(extractedheartdata2)
        topHeartData.datasets[1].data = display_extractedheartdata2;

      }
    }
    chart.update();
    console.log('updated graph');
}

function upDonut(){
  if(douHeartBeatChartA&&douHeartBeatChartB&&display_extractedheartdata1){
    douHeartBeatChartA.data.datasets[0].data = [display_extractedheartdata1.slice(-1), 120 - display_extractedheartdata1.slice(-1)]
    douHeartBeatChartA.options.elements.center.text = display_extractedheartdata1.slice(-1);
    douHeartBeatChartB.data.datasets[0].data = [display_extractedheartdata2.slice(-1), 120 - display_extractedheartdata2.slice(-1)]
    douHeartBeatChartB.options.elements.center.text = display_extractedheartdata2.slice(-1);
  }
  douHeartBeatChartA.update();
  douHeartBeatChartB.update();
}


function toggleChart(options,chart){
    var leftBtn = options.leftBtn
      var rightBtn = options.rightBtn
    var clearBtn = options.clearBtn
    var tempBtn = options.tempBtn
    var historyBtn = options.historyBtn
      var ele = options.ele
      var data = options.data
      // var labels = options.labels
      // var chart = options.chart
      // var chartOptions = options.options
    // leftBtn.on('click', function () {})
    // rightBtn.on('click', function () {})
    var isPaused = false; // variable to track if the graph is paused
    
    clearBtn.on('click', function(){
      // $.ajax({
      //   url: 'http://43.252.167.19:9012/cleardata.php',
      //   type: 'POST',
      //   success: function(response) {
      //     console.log(response);
      //   },
      //   error: function(xhr, status, error) {
      //     console.error(error);
      //   }
      // });
      // // console.log("clear button clicked");
    });
  
    tempBtn.on('click', function () {
        console.log("temp button clicked");
        if (isPaused) {
          isPaused = false;
          intervalId = setInterval(function(){update();console.log('run update');}, 500);
      }
      display_time1 = time1.slice(-30);
      display_extractedheartdata1 = extractedheartdata1.slice(-30);
      if(extractedheartdata2){
        display_time2 = time2.slice(-30);
        display_extractedheartdata2 = extractedheartdata2.slice(-30);
      }
      upGraph(chart);
  
    });
  
    leftBtn.on('click', function () {
      // If the graph is not paused, pause it and display the previous 30 data points
      console.log('left button clicked');
      if (!isPaused) {
        isPaused = true;
        clearInterval(intervalId); 
      }
        countIndex = Math.max(countIndex - 30, 0); // decrement countIndex by 30, but ensure it doesn't go below 0
        console.log(countIndex);
        display_time1 = time1.slice(countIndex, countIndex + 30);
        display_extractedheartdata1 = extractedheartdata1.slice(countIndex, countIndex + 30);
        if(extractedheartdata2){
            display_time2 = time2.slice(countIndex, countIndex + 30);
            display_extractedheartdata2 = extractedheartdata2.slice(countIndex, countIndex + 30)
          }
        upGraph(chart);
        chart.update();
        console.log('review data from ' + countIndex );
    });
  
    rightBtn.on('click', function () {
      console.log('right button clicked');
      if (!isPaused) {
        isPaused = true;
        clearInterval(intervalId); 
      }
        countIndex = Math.min(countIndex + 30, startIndex - 30); // increment countIndex by 30, but ensure it doesn't go above starting
        console.log(startIndex - 30);
        console.log(countIndex + 30);
        console.log(countIndex);
        display_time1 = time1.slice(countIndex, countIndex + 30);
        display_extractedheartdata1 = extractedheartdata1.slice(countIndex, countIndex + 30);
        if(extractedheartdata2){
            display_time2 = time2.slice(countIndex, countIndex + 30);
            display_extractedheartdata2 = extractedheartdata2.slice(countIndex, countIndex + 30);
        }
        upGraph(chart);
        chart.update();
        console.log('review data from ' + countIndex );
      // if (isPaused) {
      //   isPaused = false;
      //   intervalId = setInterval(update,500);
      // }
      // console.log(chart);
    })
  
    historyBtn.on('click', function () {
      console.log('history button clicked');
      if (!isPaused) {
        isPaused = true;
        clearInterval(intervalId); 
      }
      display_time1 = time1;
      display_extractedheartdata1 = extractedheartdata1;
      display_time2 = time2;
      display_extractedheartdata2 = extractedheartdata2;
      upGraph(chart);
      chart.update();
      console.log('Show History Data');
  
    })
  
  
}


var douHeartBeatChartA = renderDoughnut($('#heartBeatA').get(0).getContext('2d'), {
	labels: ['Heart Beat Rate'],
	backgroundColor: [
		'rgb(255, 80, 80)',
		'rgba(255, 80, 80, .1)',
	],
	data: [50, 50]
})

var douHeartBeatChartB = renderDoughnut($('#heartBeatB').get(0).getContext('2d'), {
	labels: ['Heart Beat Rate'],
	backgroundColor: [
		'rgb(63, 77, 197)',
		'rgba(63, 77, 197, .1)',
	],
	data: [50, 50]
})

var douBreathingChartA = renderDoughnut($('#BreathingA').get(0).getContext('2d'), {
	labels: ['Breathing Rate'],
	backgroundColor: [
		'rgb(245, 188, 183)',
		'rgba(245, 188, 183, .1)',
	],
	data: [50, 50]
})

var douBreathingChartB = renderDoughnut($('#BreathingB').get(0).getContext('2d'), {
	labels: ['Breathing Rate'],
	backgroundColor: [
		'rgb(148, 215, 236)',
		'rgba(148, 215, 236, .1)',
	],
	data: [50, 50]
})


var douBreathingChartA = renderDoughnut($('#VariabilityA').get(0).getContext('2d'), {
	labels: ['Heart Beat Interval'],
	backgroundColor: [
		'rgb(241, 86, 94)',
		'rgba(241, 86, 94, .1)',
	],
	data: [50, 50]
})

var douBreathingChartB = renderDoughnut($('#VariabilityB').get(0).getContext('2d'), {
	labels: ['Heart Beat Interval'],
	backgroundColor: [
		'rgb(96, 134, 241)',
		'rgba(96, 134, 241, .1)',
	],
	data: [50, 50]
})






toggleChart({
	leftBtn: $('.left-top-btn'),
	rightBtn: $('.right-top-btn'),
  clearBtn: $('#clear-btn'),
  tempBtn: $('#temp-btn'),
  historyBtn: $('#history-btn'),
	ele: $('#heartRate').get(0).getContext('2d'),
	data: topHeartData,
	// labels: labels,
	// chart: topHeartChart,
	// options: data
}, topHeartChart)

// douHeartBeatChartA.update();
// douHeartBeatChartB.update();

  var intervalId = setInterval(function(){update();console.log('run update');}, 500);