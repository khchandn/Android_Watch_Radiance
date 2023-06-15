var sqlheartdata

// function update(){
// 	var xhr = new XMLHttpRequest();
// 	xhr.onreadystatechange = function(){
// 		if (this.readyState == 4 && this.status == 200) {
// 			sqlheartdata = JSON.parse(this.responseText);
// 			var url = "readdata.php?nocache=" + Math.random();
// 			xhr.open("GET", url, true);
// 			xhr.send();

// 		}
// 	}
// }
function update(){
fetch('readdata.php')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    sqlheartdata = data;

  })
  .catch(error => console.error(error));
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
			var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
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
			ctx.font = fontSizeToUse+"px " + fontStyle;
			ctx.fillStyle = color;
			
			//Draw text in center
			ctx.fillText(txt, centerX, centerY);
		}
	}
});

var originLabels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20']
var labels = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20']
labels.position = 0


var topHeartOptions = {
	labels: labels.slice(labels.position, 6),
	datasets: [{
		label: 'Heart Beat Rate',
		data: sqlheartdata.slice(labels.position, 6),
		borderColor: '#ffce37',
		backgroundColor: 'transparent',
		pointRadius: 3,
		borderWidth: 1,
		lineTension: 0
	},
  {
		label: 'Breathing Rate',
		data: sqlheartdata.slice(labels.position, 6),
		borderColor: '#8abe78',
		backgroundColor: 'transparent',
		pointRadius: 3,
		borderWidth: 1,
		lineTension: 0
	}]
}