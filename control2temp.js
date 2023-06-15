var sqlheartdata;
var topHeartChart;
var douHeartChart;
var time;
var extractedheartdata;
var display_time; // for display default 30 datas
var display_extractedheartdata; // for display default 30 datas
// var dataa = [10,10,4,10,10,10,10];
var startIndex;
var countIndex
var data = {
  labels: display_time,
  datasets: [
      {
        label: 'Heart Beat Rate',
        data: display_extractedheartdata,
        borderColor: '#ffce37',
        backgroundColor: 'transparent'
      }
  ]
};


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

topHeartChart = initChart($('#heartRate').get(0).getContext('2d'), data);

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
douHeartChart = new Chart($('#topPressure').get(0).getContext('2d'), {
	type: 'doughnut',
	data: {
		labels: ['Heart Beat Rate'],
		datasets: [{
			backgroundColor: [
				'#feb23a',
				'rgb(255, 245, 229)'
			],
			data: [50, 50]
		}]
	},
	options: {
		responsive: true,
		elements: {
			center: {
				text: '',
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


function update() { // fetch data from database and update the chart
  fetch('readdata.php')
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
  if(sqlheartdata){
    if(!time&&!extractedheartdata){
      console.log('empty');
      display_time = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30).map(function(item) {return new Date(item.x).toLocaleTimeString();});
      time = sqlheartdata.map(function(item) {return new Date(item.x).toLocaleTimeString();});
      display_extractedheartdata = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30).map(function(item) {return item.y});
      extractedheartdata = sqlheartdata.map(function(item) {return item.y});
      // upGraph();
      upGraph(topHeartChart);
      console.log('filled');
    }
    console.log(new Date(sqlheartdata[sqlheartdata.length - 1].x).toLocaleTimeString());
    console.log((display_time[display_time.length - 1]));
    if (new Date(sqlheartdata[sqlheartdata.length - 1].x).toLocaleTimeString() > time[time.length - 1]) {
    console.log('new time');
    display_time = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30).map(function(item) {return new Date(item.x).toLocaleTimeString();});
    time = sqlheartdata.map(function(item) {return new Date(item.x).toLocaleTimeString();});
    display_extractedheartdata = sqlheartdata.slice(sqlheartdata.length<30?-sqlheartdata.length:-30).map(function(item) {return item.y});
    extractedheartdata = sqlheartdata.map(function(item) {return item.y});
    // console.log(extractedheartdata);
    // console.log(dataa);
    var newData = {
      labels: display_time,
      datasets: [
          {
            label: 'Heart Beat Rate',
            data: display_extractedheartdata,
            borderColor: '#ffce37',
            backgroundColor: 'transparent'
          }
        ]
      }
      // console.log(topHeartChart);
      topHeartChart.data = newData;
      topHeartChart.update({
        duration: 0,
        easing: 'linear'
      });
    }
    startIndex = time?time.length:0;
    countIndex = startIndex;

    douHeartChart.data.datasets.data = [extractedheartdata[extractedheartdata.length - 1], 100 - extractedheartdata[extractedheartdata.length - 1]];
    console.log(douHeartChart.data.datasets.data);
    douHeartChart.options.elements.center.text = extractedheartdata[extractedheartdata.length - 1];
    douHeartChart.update();
  }
  else{
    // time.length = 0;
    // display_time.length = 0;
    // extractedheartdata.length = 0;
    // display_extractedheartdata.length = 0;
    // upGraph(topHeartChart);
  }

}





// var label = [1,2,3,4,5,6,7];
// var dataa = [78,78,78,78,78,87,78];
// var datab = [5,5,4,5,5,5,5];
// const labels = label

var data = {            // data for the graph
  labels: display_time,
  datasets: [
    {
      label: 'Heart Beat Rate',
      data: display_extractedheartdata,
      borderColor: '#ffce37',
      backgroundColor: 'transparent'
    }
    // ,{
    //   label: 'Dataset 2',
    //   data: datab,
    //   borderColor: '#8abe78',
    //   backgroundColor: 'transparent',
    // }
  ]
};


const config = { // config for the graph
  type: 'line',
  data: data,
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
      // animation: false,
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
						return datasets[tooltipItem.datasetIndex].label + '.' + tooltipItem.xLabel + ':' + tooltipItem.yLabel
					}
				}
				// displayColors: false
			}
		}
	})
}
function upGraph(chart){    // generate the graph

  if(sqlheartdata){
    if (sqlheartdata && extractedheartdata) {
      // Use extractedheartdata as the data for the line chart
      var data = {
        labels: display_time,
        datasets: [
          {
            label: 'Heart Beat Rate',
            data: display_extractedheartdata,
            borderColor: '#ffce37',
            backgroundColor: 'transparent',
          }
        ]
      }
    }
  }
  chart.data = data;
  chart.update();
  console.log('updated graph');
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
    $.ajax({
      url: 'http://43.252.167.19:9012/cleardata.php',
      type: 'POST',
      success: function(response) {
        console.log(response);
      },
      error: function(xhr, status, error) {
        console.error(error);
      }
    });
    // console.log("clear button clicked");
  });

  tempBtn.on('click', function () {
      console.log("temp button clicked");
      if (isPaused) {
        isPaused = false;
        intervalId = setInterval(update,500);
    }
    display_time = time.slice(-30);
    display_extractedheartdata = extractedheartdata.slice(-30);
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
      display_time = time.slice(countIndex, countIndex + 30);
      display_extractedheartdata = extractedheartdata.slice(countIndex, countIndex + 30);
      var newData = {
        labels: display_time,
        datasets: [
          {
            label: 'Heart Beat Rate',
            data: display_extractedheartdata,
            borderColor: '#ffce37',
            backgroundColor: 'transparent'
          }
        ]
      }
      chart.data = newData;
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
      display_time = time.slice(countIndex, countIndex + 30);
      display_extractedheartdata = extractedheartdata.slice(countIndex, countIndex + 30);
      var newData = {
        labels: display_time,
        datasets: [
          {
            label: 'Heart Beat Rate',
            data: display_extractedheartdata,
            borderColor: '#ffce37',
            backgroundColor: 'transparent'
          }
        ]
      }
      chart.data = newData;
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
    display_time = time;
    display_extractedheartdata = extractedheartdata;
    var newData = {
      labels: display_time,
      datasets: [
        {
          label: 'Heart Beat Rate',
          data: display_extractedheartdata,
          borderColor: '#ffce37',
          backgroundColor: 'transparent'
        }
      ]
    }
    chart.data = newData;
    chart.update();
    console.log('Show History Data');

  })


}

// $('#clear-btn').on('click', function () { // clear data
//   $.ajax({
//     url: 'http://43.252.167.19:9012/cleardata.php',
//     type: 'POST',
//     success: function(response) {
//       console.log(response);
//     },
//     error: function(xhr, status, error) {
//       console.error(error);
//     }
//   });
//   // console.log("clear button clicked");
// });


// $('#temp-btn').on('click', function () {
//   console.log("temp button clicked");
// });

// $('.right-top-btn').on('click', function () {
//   console.log(extractedheartdata);
// });

// $('.left-top-btn').on('click', function () {
//   console.log("left top button clicked");
// });

// function testlog(){
//   if(sqlheartdata){
//     console.log(time);
//     console.log(extractedheartdata);
//     console.log(dataa);
//   }
// }
toggleChart({
	leftBtn: $('.left-top-btn'),
	rightBtn: $('.right-top-btn'),
  clearBtn: $('#clear-btn'),
  tempBtn: $('#temp-btn'),
  historyBtn: $('#history-btn'),
	ele: $('#heartRate').get(0).getContext('2d'),
	data: data,
	// labels: labels,
	// chart: topHeartChart,
	// options: data
}, topHeartChart)





var intervalId = setInterval(function(){update();console.log('run update');}, 500);
// setInterval(testlog, 1000);
// setInterval(upGraph, 1000);


