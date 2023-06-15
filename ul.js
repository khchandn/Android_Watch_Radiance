var sqlheartdata;
var topHeartChart;
var time;
var extractedheartdata;
var dataa = [10,10,4,10,10,10,10];
// var originLabels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20'];
// var labels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20'];
// var topHeartOptions = {
// 	// display: true,
// 	labels: [],
// 	datasets: [{
// 	  label: 'Heart Beat Rate',
// 	  data: [],
// 	  borderColor: '#ffce37',
// 	  backgroundColor: 'transparent',
// 	  pointRadius: 3,
// 	  borderWidth: 1,
// 	  lineTension: 0
// 	},
// 	{
// 	//   display: true,
// 	  label: 'Breathing Rate',
// 	  data: [],
// 	  borderColor: '#8abe78',
// 	  backgroundColor: 'transparent',
// 	  pointRadius: 3,
// 	  borderWidth: 1,
// 	  lineTension: 0
// 	}]
// }

function update() {
  fetch('readdata.php')
    .then(response => response.json())
    .then(data => {
    //   console.log(data);
      sqlheartdata = data;
      labels.position = 0;

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
    time = sqlheartdata.slice(-7).map(function(item) {return new Date(item.x).toLocaleTimeString();});
    extractedheartdata = sqlheartdata.slice(-7).map(function(item) {return item.y});
    // console.log(time);
    // console.log(extractedheartdata);
    // console.log(dataa);
  }
}

var label = [1,2,3,4,5,6,7];
var dataa = [78,78,78,78,78,87,78];
var datab = [5,5,4,5,5,5,5];
const labels = label
var data = {            // Act Like topHeartOption
  labels: time,
  datasets: [
    {
      label: 'Dataset 1',
      data: extractedheartdata,
      borderColor: '#ffce37',
      backgroundColor: 'transparent',
    }
    // ,{
    //   label: 'Dataset 2',
    //   data: datab,
    //   borderColor: '#8abe78',
    //   backgroundColor: 'transparent',
    // }
  ]
};


const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  },
};


function initChart(element, data) {
	return new Chart(element, {
		type: 'line',
		data: data,
		options: {
			layout: {
				padding: 10
			},
			legend: {
				position: 'top',
				// display: data.display,
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
						return datasets[tooltipItem.datasetIndex].label + '.' + tooltipItem.xLabel + ':' + datasets[tooltipItem.datasetIndex].data[index]
					}
				}
				// displayColors: false
			}
		}
	})
}
function genGraph(){

  if(sqlheartdata){
    if (sqlheartdata && extractedheartdata) {
      // Use extractedheartdata as the data for the line chart
      var data = {
        labels: time,
        datasets: [
          {
            label: 'Dataset 1',
            data: extractedheartdata,
            borderColor: '#ffce37',
            backgroundColor: 'transparent',
          }
        ]
      }
    }
  }
  topHeartChart = initChart($('#heartRate').get(0).getContext('2d'), data);
}

function togglegraph(options){
  var leftBtn = options.leftBtn
	var rightBtn = options.rightBtn
	var ele = options.ele
	var data = options.data
	var labels = options.labels
	var chart = options.chart
	var chartOptions = options.options
  leftBtn.on('click', function () {})
  rightBtn.on('click', function () {})


}

// function testlog(){
//   if(sqlheartdata){
//     console.log(time);
//     console.log(extractedheartdata);
//     console.log(dataa);
//   }
// }
setInterval(update, 1000);
// setInterval(testlog, 1000);
setInterval(genGraph, 1000);


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








function togglegraph(options){
  var leftBtn = options.leftBtn
  var rightBtn = options.rightBtn
  var ele = options.ele
  var data = options.data
  var labels = options.labels
  var chart = options.chart
  var chartOptions = options.options

  var isPaused = false; // variable to track if the graph is paused

  leftBtn.on('click', function () {
    // If the graph is not paused, pause it and display the previous 30 data points
    if (!isPaused) {
      isPaused = true;
      display_time = time.slice(time.length < 60 ? 0 : -60, time.length < 30 ? 0 : -30);
      display_extractedheartdata = extractedheartdata.slice(extractedheartdata.length < 60 ? 0 : -60, extractedheartdata.length < 30 ? 0 : -30);
      var newData = {
        labels: display_time,
        datasets: [          {            label: 'Heart Beat Rate',            data: display_extractedheartdata,            borderColor: '#ffce37',            backgroundColor: 'transparent'          }        ]
      }
      chart.data = newData;
      chart.update({
        duration: 0,
        easing: 'linear'
      });
    }
  });

  rightBtn.on('click', function () {
    // If the graph is paused, resume updating it and display the latest data points
    if (isPaused) {
      isPaused = false;
      display_time = time.slice(time.length < 30 ? 0 : -30);
      display_extractedheartdata = extractedheartdata.slice(extractedheartdata.length < 30 ? 0 : -30);
      var newData = {
        labels: display_time,
        datasets: [          {            label: 'Heart Beat Rate',            data: display_extractedheartdata,            borderColor: '#ffce37',            backgroundColor: 'transparent'          }        ]
      }
      chart.data = newData;
      chart.update({
        duration: 0,
        easing: 'linear'
      });
    }
  });
}






function togglegraph(options){
  var leftBtn = options.leftBtn
  var rightBtn = options.rightBtn
  var ele = options.ele
  var data = options.data
  var labels = options.labels
  var chart = options.chart
  var chartOptions = options.options

  var isPaused = false; // variable to track if the graph is paused
  var startIndex = 0; // index of the first data point to be displayed

  leftBtn.on('click', function () {
    // If the graph is not paused, pause it and display the previous 30 data points
    if (!isPaused) {
      isPaused = true;
      startIndex = Math.max(startIndex - 30, 0); // decrement startIndex by 30, but ensure it doesn't go below 0
      display_time = time.slice(startIndex, startIndex + 30);
      display_extractedheartdata = extractedheartdata.slice(startIndex, startIndex + 30);
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
      chart.update({
        duration: 0,
        easing: 'linear'
      });
    }
  });

  rightBtn.on('click', function () {
    // If the graph is paused, resume updating it and display the latest data points
    if (isPaused) {
      isPaused = false;
      startIndex = Math.min(startIndex + 30, time.length - 30); // increment startIndex by 30, but ensure it doesn't go beyond the end of the array
      display_time = time.slice(startIndex, startIndex + 30);
      display_extractedheartdata = extractedheartdata.slice(startIndex, startIndex + 30);
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
      chart.update({
        duration: 0,
        easing: 'linear'
      });
    }
  });
}