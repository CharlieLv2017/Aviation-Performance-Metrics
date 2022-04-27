am4core.disposeAllCharts();
am4core.useTheme(am4themes_animated);

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.dateFormatter.dateFormat = "yyyy-MM-dd";

// Set up data source
chart.dataSource.url = "/static/files/DailyDelayCancelled.csv";
chart.dataSource.parser = new am4core.CSVParser();
chart.dataSource.parser.options.useColumnNames = true;

// Create axes

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.title.text = "[bold]Time";

dateAxis.dateFormats.setKey("MMM dd", "[bold]yyyy");
dateAxis.periodChangeDateFormats.setKey("MMM dd", "[bold]yyyy");
//dateAxis.groupData = true;


// Create value axis
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.title.text = "[bold]Percentage";


// Create series
var series1 = chart.series.push(new am4charts.LineSeries());
series1.dataFields.valueY = "DepDelay";
series1.dataFields.dateX = "FlightDate";
series1.name = "Departure Delay";
series1.strokeWidth = 1.5;
series1.stroke = am4core.color("#ff0000");
series1.tooltipText = "Delayed Departures: [b]{valueY}[/]%";
series1.tensionX = 0.7;
//series1.bullets.push(new am4charts.CircleBullet());

var series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.valueY = "ArrDelay";
series2.dataFields.dateX = "FlightDate";
series2.name = "Arrival Delay";
series2.strokeWidth = 1.5;
series2.stroke = am4core.color("#00ff00");
series2.tooltipText = "Delayed Arrivals: [b]{valueY}[/]%";
series2.tensionX = 0.7;
//series2.bullets.push(new am4charts.CircleBullet());

var series3 = chart.series.push(new am4charts.LineSeries());
series3.dataFields.valueY = "Cancelled";
series3.dataFields.dateX = "FlightDate";
series3.name = "Cancelled";
series3.strokeWidth = 1.5;
series3.stroke = am4core.color("#0000ff");
series3.tooltipText = "Cancellations: [b]{valueY}[/]%";
series3.tensionX = 0.7;
//series3.bullets.push(new am4charts.CircleBullet());


function createSeries(field, name) {
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = field;
  series.dataFields.dateX = "FlightDate";
  series.name = name;
  series.tooltipText = "{dateX}: [b]{valueY}[/]";
  series.strokeWidth = 2;
  
  var bullet = series.bullets.push(new am4charts.CircleBullet());
  bullet.circle.stroke = am4core.color("#fff");
  bullet.circle.strokeWidth = 2;
  
  return series;
}

var series4 = createSeries("void", "Toggle All");

series4.events.on("hidden", function() {
  series1.hide();
  series2.hide();
  series3.hide();
});

series4.events.on("shown", function() {
  series1.show();
  series2.show();
  series3.show();
});


// Add scrollbar
chart.scrollbarX = new am4charts.XYChartScrollbar();
chart.scrollbarY = new am4charts.XYChartScrollbar();
//chart.scrollbarX.showTooltipOn = "always";

// customizeGrip(chart.scrollbarX.startGrip);
// customizeGrip(chart.scrollbarX.endGrip);
// grip.background.fill = am4core.color("#f00");
// grip.background.fillOpacity = 0.5;

chart.scrollbarX.parent = chart.bottomAxesContainer;
chart.scrollbarY.parent = chart.leftAxesContainer;




chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
chart.scrollbarX.thumb.background.fillOpacity = 0.9;

chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;

chart.scrollbarX.unselectedOverlay.fill = am4core.color("#999999");
chart.scrollbarX.unselectedOverlay.fillOpacity = 0.9;
//========================
chart.scrollbarY.thumb.background.fill = am4core.color("#FF8000");
chart.scrollbarY.thumb.background.fillOpacity = 0.9;
chart.scrollbarX.unselectedOverlay.fill = am4core.color("#999999");
chart.scrollbarX.unselectedOverlay.fillOpacity = 0.9;

chart.scrollbarY.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
chart.scrollbarY.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
chart.scrollbarY.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
chart.scrollbarY.thumb.background.states.getKey('down').properties.fillOpacity = 1;
//chart.scrollbarX.text.push("ABCD");
//chart.scrollbarX.series.push(series);


chart.legend = new am4charts.Legend();

// Add cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "zoomXY";
dateAxis.tooltipDateFormat = "d MMM, yyyy";
// chart.cursor.xAxis = dateAxis;
// chart.cursor.yAxis = valueAxis;
//chart.cursor.snapToSeries = series3;
