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

var userIDSet;

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
    type: 'scatter',
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
		type: 'scatter',
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

topHeartChart = initChart($('#heartRate').get(0).getContext('2d'), topHeartData);


function extractData(orgdata) {
    // extract data from database
    if (orgdata) {
      if (!time1) {
        console.log('empty');
        firstUserID = orgdata[0].userID;
        // console.log(firstUserID);
        // extract data for User A
        display_time1 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
          .filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return new Date(item.x).toLocaleTimeString();});
        time1 = orgdata.filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return new Date(item.x).toLocaleTimeString();});
        topHeartData.datasets[0].data = orgdata.filter(o => o.userID == firstUserID).slice(orgdata.length < 30 ? -orgdata.length : -30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
        topHeartData.datasets[1].data = orgdata.filter(o => o.userID != firstUserID).slice(orgdata.length < 30 ? -orgdata.length : -30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
        console.log(orgdata.filter(o => o.userID == firstUserID).slice(orgdata.length < 30 ? -orgdata.length : -30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y })))
      }

      if (new Date(sqlheartdata[sqlheartdata.length - 1].x).toLocaleTimeString() > time1[time1.length - 1]) {
        firstUserID = orgdata[0].userID;
        // console.log(firstUserID);
        // extract data for User A
        display_time1 = orgdata.slice(orgdata.length < 30 ? -orgdata.length : -30)
          .filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return new Date(item.x).toLocaleTimeString();});
        time1 = orgdata.filter(function(item) {return item.userID == firstUserID})
          .map(function(item) {return new Date(item.x).toLocaleTimeString();});
          topHeartData.datasets[0].data = orgdata.filter(o => o.userID == firstUserID).slice(orgdata.length < 30 ? -orgdata.length : -30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
        topHeartData.datasets[1].data = orgdata.filter(o => o.userID != firstUserID).slice(orgdata.length < 30 ? -orgdata.length : -30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
      upGraph();
    }
    startIndex = time1?time1.length:0;
    countIndex = startIndex;
  }
}

function update() { // fetch data from database and update the chart
    fetch('readdataduouser.php')
      .then(response => response.json())
      .then(data => {
        sqlheartdata = data;

      })
      .catch(error => console.error(error));

      extractData(sqlheartdata);

    upGraph(topHeartChart);
}


function upGraph(chart){    // update the graph

    if(sqlheartdata){
      // if (sqlheartdata && extractedheartdata1) {
        if(sqlheartdata){

        topHeartData.labels = display_time1;
        }
        chart.update();
        console.log('updated graph');
    }
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
  
    tempBtn.on('click', function () { // update
        console.log("temp button clicked");
        if (isPaused) {
          isPaused = false;
          intervalId = setInterval(function(){update();console.log('run update');}, 500);
      }
      display_time1 = time1.slice(-30);
      // display_extractedheartdata1 = extractedheartdata1.slice(-30);
      // if(extractedheartdata2){
      //   display_time2 = time2.slice(-30);
      //   display_extractedheartdata2 = extractedheartdata2.slice(-30);
      // }
      topHeartData.datasets[0].data = sqlheartdata.filter(o => o.userID == firstUserID).slice(sqlheartdata.length < 30 ? -orgdata.length : -30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
        topHeartData.datasets[1].data = sqlheartdata.filter(o => o.userID != firstUserID).slice(sqlheartdata.length < 30 ? -orgdata.length : -30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
      upGraph(chart);
  
    }
  );
  
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
        // display_extractedheartdata1 = extractedheartdata1.slice(countIndex, countIndex + 30);
        // if(extractedheartdata2){
        //     display_time2 = time2.slice(countIndex, countIndex + 30);
        //     display_extractedheartdata2 = extractedheartdata2.slice(countIndex, countIndex + 30)
        //   }

        topHeartData.datasets[0].data = sqlheartdata.filter(o => o.userID == firstUserID).slice(countIndex, countIndex + 30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
        topHeartData.datasets[1].data = sqlheartdata.filter(o => o.userID != firstUserID).slice(countIndex, countIndex + 30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
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
        // display_extractedheartdata1 = extractedheartdata1.slice(countIndex, countIndex + 30);
        // if(extractedheartdata2){
        //     display_time2 = time2.slice(countIndex, countIndex + 30);
        //     display_extractedheartdata2 = extractedheartdata2.slice(countIndex, countIndex + 30);
        topHeartData.datasets[0].data = sqlheartdata.filter(o => o.userID == firstUserID).slice(countIndex, countIndex + 30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
        topHeartData.datasets[1].data = sqlheartdata.filter(o => o.userID != firstUserID).slice(countIndex, countIndex + 30).map(o => ({ x: new Date(o.x).toLocaleTimeString(), y: o.y }));
        
        // }
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
      // display_extractedheartdata1 = extractedheartdata1;
      // display_time2 = time2;
      // display_extractedheartdata2 = extractedheartdata2;
      upGraph(chart);
      chart.update();
      console.log('Show History Data');
  
    })
  
  
}


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



  var intervalId = setInterval(function(){update();console.log('run update');}, 500);