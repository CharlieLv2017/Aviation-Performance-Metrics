function initchart(plotSelection, title)
{
  $('#ChartHeader').text(title)
  if(plotSelection==1)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/StateDepOrigin.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "state";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]State Name[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "DepDelay";
    series.dataFields.categoryX = "state";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;

    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    series.columns.template.tooltipHTML = `<b>State: {state}</b><br>Avg. Delay: {DepDelay}`;
    
  }
  else
  if(plotSelection==2)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/StateArrDest.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "state";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]State Name[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Arrival Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ArrDelay";
    series.dataFields.categoryX = "state";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;

    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    series.columns.template.tooltipHTML = `<b>State: {state}</b><br>Avg. Delay: {ArrDelay}`;
  }
  else
  if(plotSelection==3)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/CityDepOrigin.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "CityName";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]City Name[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "DepDelay";
    series.dataFields.categoryX = "CityName";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;

    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    series.columns.template.tooltipHTML = `<b>City: {CityName}</b><br>Avg. Delay: {DepDelay}`;
    
  }
  else
  if(plotSelection==4)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/CityArrDest.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "CityName";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]City Name[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Arrival Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ArrDelay";
    series.dataFields.categoryX = "CityName";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;

    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    series.columns.template.tooltipHTML = `<b>City: {CityName}</b><br>Avg. Delay: {ArrDelay}`;
  }
  else
  if(plotSelection==11)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/Files/WholeCSVs/AirPortDepDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Origin";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Airport Name[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "DepDelay";
    series.dataFields.categoryX = "Origin";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    //series.columns.template.tooltipHTML = '<b>{Origin}</b><br><a href="https://en.wikipedia.org/wiki/{Origin.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Airport: {Origin}</b><br>Avg. Delay: {DepDelay}<br><input type="button" value="More info" onclick="location.href='https://en.wikipedia.org/wiki/{Origin.urlEncode()} Airport';" />`;

  }
  else
  if(plotSelection==12)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/AirPortArrDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Dest";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Airport Name[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ArrDelay";
    series.dataFields.categoryX = "Dest";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    // series.tooltip.getFillFromObject = false;
    // series.tooltip.background.fill = am4core.color("#FFFFFF");
    series.tooltip.keepTargetHover = true;

    // series3.columns.template.tooltipHTML = `<center><strong>Details {Dest}</strong></center>
    //   <hr />
    //   <table>
    //   <tr>
    //     <th align="left">Avg. Delay</th>
    //     <td>{ArrDelay} mins</td>
    //   </tr>
    //   </table>
    //   <hr />
    //   <center><input type="button" value="More info" onclick="location.href='https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport';" /></center>`;

    // series.columns.template.tooltipHTML = '<b>{Dest}</b><br><a href="https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Airport: {Dest}</b><br>Avg. Delay: {ArrDelay}<br><input type="button" value="More info" onclick="location.href='https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport';" />`;

  }
  else
  if(plotSelection==21)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/AirlineDepDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "IATA_Airline";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Airline Name[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "DepDelay";
    series.dataFields.categoryX = "IATA_Airline";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    //series.columns.template.tooltipHTML = '<b>{Origin}</b><br><a href="https://en.wikipedia.org/wiki/{Origin.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Airline: {IATA_Airline}</b><br>Avg. Delay: {DepDelay}`;

  }
  else
  if(plotSelection==22)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/AirlineArrDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "IATA_Airline";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Airline Name[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ArrDelay";
    series.dataFields.categoryX = "IATA_Airline";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    // series.tooltip.getFillFromObject = false;
    // series.tooltip.background.fill = am4core.color("#FFFFFF");
    series.tooltip.keepTargetHover = true;

    // series3.columns.template.tooltipHTML = `<center><strong>Details {Dest}</strong></center>
    //   <hr />
    //   <table>
    //   <tr>
    //     <th align="left">Avg. Delay</th>
    //     <td>{ArrDelay} mins</td>
    //   </tr>
    //   </table>
    //   <hr />
    //   <center><input type="button" value="More info" onclick="location.href='https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport';" /></center>`;

    // series.columns.template.tooltipHTML = '<b>{Dest}</b><br><a href="https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Airline: {IATA_Airline}</b><br>Avg. Delay: {ArrDelay}`;

  }
  else
  if(plotSelection==31)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/YearlyDepDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Year[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "DepDelay";
    series.dataFields.categoryX = "Year";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    //series.columns.template.tooltipHTML = '<b>{Origin}</b><br><a href="https://en.wikipedia.org/wiki/{Origin.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Year: {Year}</b><br>Avg. Delay: {DepDelay}`;
  }
  else
  if(plotSelection==32)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/YearlyArrDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Year[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ArrDelay";
    series.dataFields.categoryX = "Year";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    // series.tooltip.getFillFromObject = false;
    // series.tooltip.background.fill = am4core.color("#FFFFFF");
    series.tooltip.keepTargetHover = true;

    // series3.columns.template.tooltipHTML = `<center><strong>Details {Dest}</strong></center>
    //   <hr />
    //   <table>
    //   <tr>
    //     <th align="left">Avg. Delay</th>
    //     <td>{ArrDelay} mins</td>
    //   </tr>
    //   </table>
    //   <hr />
    //   <center><input type="button" value="More info" onclick="location.href='https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport';" /></center>`;

    // series.columns.template.tooltipHTML = '<b>{Dest}</b><br><a href="https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Year: {Year}</b><br>Avg. Delay: {ArrDelay}`;

  }
  else
  if(plotSelection==33)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/MonthNameDepDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Month[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "DepDelay";
    series.dataFields.categoryX = "Month";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    //series.columns.template.tooltipHTML = '<b>{Origin}</b><br><a href="https://en.wikipedia.org/wiki/{Origin.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Month: {Month}</b><br>Avg. Delay: {DepDelay}`;
  }
  else
  if(plotSelection==34)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/MonthNameArrDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Month[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ArrDelay";
    series.dataFields.categoryX = "Month";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    // series.tooltip.getFillFromObject = false;
    // series.tooltip.background.fill = am4core.color("#FFFFFF");
    series.tooltip.keepTargetHover = true;

    // series3.columns.template.tooltipHTML = `<center><strong>Details {Dest}</strong></center>
    //   <hr />
    //   <table>
    //   <tr>
    //     <th align="left">Avg. Delay</th>
    //     <td>{ArrDelay} mins</td>
    //   </tr>
    //   </table>
    //   <hr />
    //   <center><input type="button" value="More info" onclick="location.href='https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport';" /></center>`;

    // series.columns.template.tooltipHTML = '<b>{Dest}</b><br><a href="https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Month: {Month}</b><br>Avg. Delay: {ArrDelay}`;

  }
  else
  if(plotSelection==35)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/DayNameDepDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "DayName";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Day of Week[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "DepDelay";
    series.dataFields.categoryX = "DayName";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    //series.columns.template.tooltipHTML = '<b>{Origin}</b><br><a href="https://en.wikipedia.org/wiki/{Origin.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Day of Week: {DayName}</b><br>Avg. Delay: {DepDelay}`;
  }
  else
  if(plotSelection==36)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/DayNameArrDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "DayName";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]DayName[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ArrDelay";
    series.dataFields.categoryX = "DayName";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    // series.tooltip.getFillFromObject = false;
    // series.tooltip.background.fill = am4core.color("#FFFFFF");
    series.tooltip.keepTargetHover = true;

    // series3.columns.template.tooltipHTML = `<center><strong>Details {Dest}</strong></center>
    //   <hr />
    //   <table>
    //   <tr>
    //     <th align="left">Avg. Delay</th>
    //     <td>{ArrDelay} mins</td>
    //   </tr>
    //   </table>
    //   <hr />
    //   <center><input type="button" value="More info" onclick="location.href='https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport';" /></center>`;

    // series.columns.template.tooltipHTML = '<b>{Dest}</b><br><a href="https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Day of Week: {DayName}</b><br>Avg. Delay: {ArrDelay}`;

  }
  else
  if(plotSelection==37)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/DailyDepDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Day";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Day of Month[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "DepDelay";
    series.dataFields.categoryX = "Day";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    //series.columns.template.tooltipHTML = '<b>{Origin}</b><br><a href="https://en.wikipedia.org/wiki/{Origin.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Day of Month: {Day}</b><br>Avg. Delay: {DepDelay}`;
  }
  else
  if(plotSelection==38)
  {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.dataSource.url = "/static/files/wholeCSVs/DailyArrDelay.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Day";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.title.text = "[bold]Day of Month[/]";


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "[bold]Average Departure Delay (in minutes)[/]";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ArrDelay";
    series.dataFields.categoryX = "Day";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    //Scroll bar
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.thumb.background.fill = am4core.color("#FF8000");
    chart.scrollbarX.thumb.background.fillOpacity = 0.9;

    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('hover').properties.fillOpacity = 0.6;
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fill = am4core.color("#ff0000");
    chart.scrollbarX.thumb.background.states.getKey('down').properties.fillOpacity = 1;


    // Set up tooltips
    series.tooltip.label.interactionsEnabled = true;
    // series.tooltip.getFillFromObject = false;
    // series.tooltip.background.fill = am4core.color("#FFFFFF");
    series.tooltip.keepTargetHover = true;

    // series3.columns.template.tooltipHTML = `<center><strong>Details {Dest}</strong></center>
    //   <hr />
    //   <table>
    //   <tr>
    //     <th align="left">Avg. Delay</th>
    //     <td>{ArrDelay} mins</td>
    //   </tr>
    //   </table>
    //   <hr />
    //   <center><input type="button" value="More info" onclick="location.href='https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport';" /></center>`;

    // series.columns.template.tooltipHTML = '<b>{Dest}</b><br><a href="https://en.wikipedia.org/wiki/{Dest.urlEncode()} Airport">More info</a>';
    series.columns.template.tooltipHTML = `<b>Day of Month: {Day}</b><br>Avg. Delay: {ArrDelay}`;

  }
}