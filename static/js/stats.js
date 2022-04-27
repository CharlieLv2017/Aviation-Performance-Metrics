class Stats {

    constructor() {
        this.hasContainer = {value: false};
    }

    updateStats(d) {

        let width = 400;
        let height = 200;

        let hasContainer = this.hasContainer;

        let updateDepBarChart = this.updateDepBarChart;
        let updateArrBarChart = this.updateArrBarChart;
        let updateLineChart = this.updateLineChart;
        let updateAreaChart = this.updateAreaChart;
        let rotateHour = this.rotateHour;
        let updateLegend = this.updateLegend;

        let removeContainer = this.removeContainer;
        let appendContainer = this.appendContainer;

        d3.csv("static/files/airports/"+d.iata_code+".csv", function (error, data) {

            if (error) {
                removeContainer();
                hasContainer.value = false;
                return;
            }

            if (!hasContainer.value) {
                appendContainer();
                hasContainer.value = true;
            }

            let monthData = [];
            let dayData = [];
            let hourData = [];
            for (let datum of data) {
                if (datum.Type == 'm')
                    monthData.push(datum)
                else if (datum.Type == 'd')
                    dayData.push(datum)
                else if (datum.Type == 'h')
                    hourData.push(datum)
            }

            let countScale = d3.scaleLinear()
                .domain([d3.max(monthData.map(function (obj) {
                    return obj.Count;
                })) * 1.5, 0])
                .range([0, height*0.8])

            let depDelayScale = d3.scaleLinear()
                .domain([d3.max(monthData.map(function (obj) {
                    return obj.DepDelay;
                })), d3.min(monthData.map(function (obj) {
                    return obj.DepDelay;
                }))])
                .range([0, height*0.8])

            let arrDelayScale = d3.scaleLinear()
                .domain([d3.max(monthData.map(function (obj) {
                    return obj.ArrDelay;
                })), d3.min(monthData.map(function (obj) {
                    return obj.ArrDelay;
                }))])
                .range([0, height*0.8])

            d3.select("#collapseOne")
                .attr("class", "collapse show reducedpadding");
            d3.select("#collapseTwo")
                .attr("class", "collapse show reducedpadding");
            d3.select("#collapseThree")
                .attr("class", "collapse show reducedpadding");

            updateDepBarChart("month1", monthData);
            updateDepBarChart("day1", dayData);
            updateDepBarChart("hour1", hourData);

            updateArrBarChart("month2", monthData);
            updateArrBarChart("day2", dayData);
            updateArrBarChart("hour2", hourData);

            updateLineChart("month3", monthData);
            updateLineChart("day3", dayData);
            updateLineChart("hour3", hourData);

            updateAreaChart("month4", monthData);
            updateAreaChart("day4", dayData);
            updateAreaChart("hour4", hourData);

            rotateHour();

            updateLegend("month");
            updateLegend("day");
            updateLegend("hour");
        });
    }

    appendContainer() {

        d3.select("#hrdiv").append("hr");
        d3.select("#accordion")
            .attr("class", "panelafter")

        for (let row of ["month", "day", "hour"]) {
            let rowdiv = d3.select("#"+row);
            for (let i = 1; i <= 4; i++) {
                let div = rowdiv.append("div")
                    .attr("class", "col-md-3");

                let svg = div.append("svg")
                    .attr("id", row+i)
                let legend = div.append("svg")
                    .attr("id", row+"legend"+i)
                svg.append("g").attr("id", row+i+"x")
                svg.append("g").attr("id", row+i+"y")
                let temp = svg.append("g").attr("id", row+i+"z")
                if (i == 1 || i == 2 || i == 3) {
                    temp.append("g").attr("id", row+i+"z1")
                    temp.append("g").attr("id", row+i+"z2")
                }
                svg.append("g").attr("id", row+i+"t")
            }
        }
    }

    removeContainer() {
        d3.select("#hrdiv").selectAll("hr").remove();
        for (let row of ["month", "day", "hour"]) {
            d3.select("#"+row).selectAll("div").remove();
        }
    }

    setHasContainer(has) {
        this.hasContainer.value = has;
    }

    updateDepBarChart(name, data) {

        let width = 400;
        let height = 200;

        let xScale = d3.scaleBand()
            .domain(data.map(function (obj) {
                return obj.Time;
            }))
            .range([0, width*0.8])
        let xAxis = d3.axisBottom()
            .scale(xScale)

        let limit = d3.max(data.map(function (obj) {
            return parseInt(obj.Count);
        })) * 1.2;
        let yScale = d3.scaleLinear()
            .domain([limit, 0])
            .range([0, height*0.8])
        let yAxis = d3.axisLeft()
            .scale(yScale)

        //Set chart to be responsive
        let svg = d3.select("#"+name)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox","0 0 "+width+" "+height * 1.2);

        d3.select("#"+name+"t").selectAll("text").remove();
        d3.select("#"+name+"t").append("text")
            .attr("transform", "translate("+ (width * 0.15) +", "+ (height* 0.1) +")")
            .text(function () {
                let type = name.slice(0, 1);
                if (type == "m")
                    return "Outbound flights distribution over year"
                if (type == "d")
                    return "Outbound flights distribution over week"
                if (type == "h")
                    return "Outbound flights distribution over day"
            })

        //draw xAxis
        let x = d3.select("#"+name+"x");
        x.attr("transform", "translate("+width*0.1+", "+height*0.95+")")
            .transition()
            .duration(1000)
            .call(xAxis);

        //draw yAxis
        let y = d3.select("#"+name+"y");
        y.selectAll(".texttoberemoved").remove();

        y.attr("transform", "translate("+width*0.1+", "+height*0.15+")")
            .transition()
            .duration(1000)
            .call(yAxis)
        y.append("text")
            .attr("transform", "translate(75, 10)")
            .attr("fill", "#000")
            .attr("class", "texttoberemoved")
            .text("number of flight")

        //creading tooltip
        let tip = d3.tip()
            .attr('class', 'chart-tip')
            .offset([-80, 0])
            .html(function(d) {
                return "<span><strong>Total Flights: </strong>"+ d.Count +"</span><br>"+
                    "<span><strong>15+min Delay: </strong>"+ (d["15minDepDelay"] * 100).toFixed(2)+"%</span>"
            })
        svg.call(tip);

        //draw bar chart1
        let barsgroup = d3.select("#"+name+"z1")
            .attr("transform", "translate("+(width*0.1+width*0.05/data.length)+", "+height*0.95+") scale(1,-1)");

        let bars = barsgroup.selectAll("rect")
            .data(data)
        bars.exit().remove();
        bars = bars.enter().append("rect").merge(bars)
            .attr("x", d => xScale(d.Time))
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .transition()
            .duration(1000)
            .attr("y", 0)
            .attr("width", width * 0.7 / data.length)
            .attr("height", d => (height*0.8 - yScale(parseInt(d.Count))))
            .attr("class", "bar1")


        //draw bar chart2
        let barsgroup2 = d3.select("#"+name+"z2")
            .attr("transform", "translate("+(width*0.1+width*0.05/data.length)+", "+height*0.95+") scale(1,-1)");

        let bars2 = barsgroup2.selectAll("rect")
            .data(data)
        bars2.exit().remove();
        bars2 = bars2.enter().append("rect").merge(bars2)
            .attr("x", d => xScale(d.Time))
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .transition()
            .duration(1000)
            .attr("y", 0)
            .attr("width", width * 0.7 / data.length)
            .attr("height", d => height*0.8 - yScale(parseInt(d.Count) * parseFloat(d["15minDepDelay"])))
            .attr("class", "bar2")
    }

    updateArrBarChart(name, data) {

        let width = 400;
        let height = 200;

        let xScale = d3.scaleBand()
            .domain(data.map(function (obj) {
                return obj.Time;
            }))
            .range([0, width*0.8])
        let xAxis = d3.axisBottom()
            .scale(xScale)

        let limit = d3.max(data.map(function (obj) {
            return parseInt(obj.Count2);
        })) * 1.2;
        let yScale = d3.scaleLinear()
            .domain([limit, 0])
            .range([0, height*0.8])
        let yAxis = d3.axisLeft()
            .scale(yScale)

        //Set chart to be responsive
        let svg = d3.select("#"+name)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox","0 0 "+width+" "+height * 1.2);

        d3.select("#"+name+"t").selectAll("text").remove();
        d3.select("#"+name+"t").append("text")
            .attr("transform", "translate("+ (width * 0.18) +", "+ (height*0.1) +")")
            .text(function () {
                let type = name.slice(0, 1);
                if (type == "m")
                    return "Inbound flights distribution over year"
                if (type == "d")
                    return "Inbound flights distribution over week"
                if (type == "h")
                    return "Inbound flights distribution over day"
            })

        //draw xAxis
        let x = d3.select("#"+name+"x");
        x.attr("transform", "translate("+width*0.1+", "+height*0.95+")")
            .transition()
            .duration(1000)
            .call(xAxis);

        //draw yAxis
        let y = d3.select("#"+name+"y");
        y.selectAll(".texttoberemoved").remove();

        y.attr("transform", "translate("+width*0.1+", "+ height*0.15+")")
            .transition()
            .duration(1000)
            .call(yAxis);
        y.append("text")
            .attr("transform", "translate(75, 10)")
            .attr("fill", "#000")
            .attr("class", "texttoberemoved")
            .text("number of flight")

        //creading tooltip
        let tip = d3.tip()
            .attr('class', 'chart-tip')
            .offset([-80, 0])
            .html(function(d) {
                return "<span><strong>Total Flights: </strong>"+ d.Count +"</span><br>"+
                    "<span><strong>15+min Delay: </strong>"+ (d["15minArrDelay"] * 100).toFixed(2)+"%</span>"
            })
        svg.call(tip);

        //draw bar chart1
        let barsgroup = d3.select("#"+name+"z1")
            .attr("transform", "translate("+(width*0.1+width*0.05/data.length)+", "+height*0.95+") scale(1,-1)");

        let bars = barsgroup.selectAll("rect")
            .data(data)
        bars.exit().remove();
        bars = bars.enter().append("rect").merge(bars)
            .attr("x", d => xScale(d.Time))
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .transition()
            .duration(1000)
            .attr("y", 0)
            .attr("width", width * 0.7 / data.length)
            .attr("height", d => (height*0.8 - yScale(parseInt(d.Count2))))
            .attr("class", "bar1")

        //draw bar chart2
        let barsgroup2 = d3.select("#"+name+"z2")
            .attr("transform", "translate("+(width*0.1+width*0.05/data.length)+", "+height*0.95+") scale(1,-1)");

        let bars2 = barsgroup2.selectAll("rect")
            .data(data)
        bars2.exit().remove();
        bars2 = bars2.enter().append("rect").merge(bars2)
            .attr("x", d => xScale(d.Time))
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .transition()
            .duration(1000)
            .attr("y", 0)
            .attr("width", width * 0.7 / data.length)
            .attr("height", d => height*0.8 - yScale(parseInt(d.Count2) * parseFloat(d["15minArrDelay"])))
            .attr("class", "bar2")
    }

    updateLineChart(name, data) {

        let width = 400;
        let height = 200;

        let xScale = d3.scaleBand()
            .domain(data.map(function (obj) {
                return obj.Time;
            }))
            .range([0, width*0.8])
        let xAxis = d3.axisBottom()
            // .tickSize(-height / 1.2)
            .scale(xScale)

        let limit = 40;
        let minusLimit = -5

        let yScale = d3.scaleLinear()
            .domain([minusLimit, limit])
            .range([height*0.8, 0])
        let yAxis = d3.axisLeft()
            .tickSize(-width)
            .scale(yScale)

        //Set chart to be responsive
        let svg = d3.select("#"+name)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox","0 0 "+width+" "+height * 1.2);

        d3.select("#"+name+"t").selectAll("text").remove();
        d3.select("#"+name+"t").append("text")
            .attr("transform", "translate("+ (width * 0.25) +", "+ (height*0.1) +")")
            .text(function () {
                let type = name.slice(0, 1);
                if (type == "m")
                    return "Average flight delay over year"
                if (type == "d")
                    return "Average flight delay over week"
                if (type == "h")
                    return "Average flight delay over day"
            })

        //draw xAxis
        let x = d3.select("#"+name+"x");
        x.attr("transform", "translate("+width*0.1+", "+height*0.95+")")
            .transition()
            .duration(1000)
            .call(xAxis);
        x.selectAll(".domain").remove();

        //draw yAxis
        let y = d3.select("#"+name+"y");
        y.selectAll(".texttoberemoved").remove();

        y.attr("transform", "translate("+width*0.1+", "+height*0.15+")")
            .transition()
            .duration(1000)
            .call(yAxis);
        y.selectAll(".domain").remove();
        y.append("text")
            .attr("transform", "translate(95, 10)")
            .attr("fill", "#000")
            .attr("class", "texttoberemoved")
            .text("average delay (min)")

        //creading tooltip
        let tip = d3.tip()
            .attr('class', 'chart-tip')
            .offset([-40, 0])
            .html(function(d) {
                console.log(d)
                return "<span><strong>Dep Delay: </strong>"+ parseFloat(d.DepDelay).toFixed(2) +"min</span><br>"+
                    "<span><strong>Arr Delay: </strong>"+ parseFloat(d.ArrDelay).toFixed(2) +"min</span>";
            })
        svg.call(tip);

        //setup line chart
        let linesgroup = d3.select("#"+name+"z")
            .attr("transform", "translate("+(width*0.1+width*0.4/data.length)+", "+height*0.15+")");

        let depGenerator = d3.line()
            .x(d => xScale(d.Time))
            .y(d => yScale(d.DepDelay));
        depGenerator = depGenerator(data);

        let arrGenerator = d3.line()
            .x(d => xScale(d.Time))
            .y(d => yScale(d.ArrDelay));
        arrGenerator = arrGenerator(data);

        let generator = [{name: "DepDelayTime", value: depGenerator},
                         {name: "ArrDelayTime", value: arrGenerator}];

        //draw line
        let depPath = linesgroup.selectAll("path")
            .data(generator);
        depPath.exit().remove();
        depPath = depPath.enter().append("path").merge(depPath)
            .attr("fill", "none")
            .attr("class", d => d.name)
            .transition()
            .duration(1000)
            .attr("d", d => d.value);

        //draw nodes
        let nodes1 = d3.select("#"+name+"z1").selectAll("circle")
            .data(data)
        nodes1.exit().remove();
        nodes1 = nodes1.enter().append("circle").merge(nodes1)
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .transition()
            .duration(1000)
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.DepDelay))
            .attr("r", 3)
            .attr("class", "linenode")


        let nodes2 = d3.select("#"+name+"z2").selectAll("circle")
            .data(data)
        nodes2.exit().remove();
        nodes2 = nodes2.enter().append("circle").merge(nodes2)
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .transition()
            .duration(1000)
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.ArrDelay))
            .attr("r", 3)
            .attr("class", "linenode")
    }

    updateAreaChart(name, data){

        let width = 400;
        let height = 200;

        let xScale = d3.scaleBand()
            .domain(data.map(function (obj) {
                return obj.Time;
            }))
            .range([0, width*0.8]);

        let xAxis = d3.axisBottom()
            .scale(xScale);

        let limit = d3.max(data.map(function (obj) {
            return parseFloat(obj.CarrierDelay) +
                parseFloat(obj.WeatherDelay) +
                parseFloat(obj.NASDelay) +
                parseFloat(obj.SecurityDelay) +
                parseFloat(obj.LateAircraftDelay);
        }));

        let yScale = d3.scaleLinear()
            .domain([0.0, limit])
            .range([height*0.8, 0.0])
        let yAxis = d3.axisLeft()
            .scale(yScale);

        //Set chart to be responsive
        let svg = d3.select("#"+name)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox","0 0 "+width+" "+height*1.2);

        d3.select("#"+name+"t").selectAll("text").remove();
        d3.select("#"+name+"t").append("text")
            .attr("transform", "translate("+ (width * 0.20) +", "+ (height*0.1) +")")
            .text(function () {
                let type = name.slice(0, 1);
                if (type == "m")
                    return "Percentage of causes of delay"
                if (type == "d")
                    return "Percentage of causes of delay"
                if (type == "h")
                    return "Percentage of causes of delay"
            })

        //draw xAxis
        d3.select("#"+name+"x")
            .attr("transform", "translate("+width*0.1+", "+height*0.95+")")
            .transition()
            .duration(1000)
            .call(xAxis);

        //draw yAxis
        d3.select("#"+name+"y")
            .attr("transform", "translate("+width*0.1+", "+height*0.15+")")
            .transition()
            .duration(1000)
            .call(yAxis);

        var area = d3.area()
            .x(function(d) { return xScale(d.data.Time); })
            .y0(function(d) { return yScale(d[0]); })
            .y1(function(d) { return yScale(d[1]); });

        let areasgroup = d3.select("#"+name+"z")
            .attr("transform", "translate("+(width*0.1+width*0.4/data.length)+", "+height*0.15+") scale(1,1)");

        var keys = ["CarrierDelay",
            "WeatherDelay",
            "NASDelay",
            "SecurityDelay",
            "LateAircraftDelay"];
        var stack = d3.stack();
        var z = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);
        stack.keys(keys);

        let areaPath = areasgroup.selectAll("path")
            .data(stack(data));
        areaPath.exit().remove();
        areaPath = areaPath.enter().append("path").merge(areaPath)
            .style("fill", function(d) { return z(d.key); })
            .transition()
            .duration(1000)
            .attr("d", area);
    }

    rotateHour() {
        for (let i = 1; i <= 4; i++) {
            d3.select("#hour" + i + "x").selectAll("text")
                .attr("transform", "translate(-24, 18), rotate(-45)");
        }

        for (let item of ["month", "day", "hour"]) {
            d3.select("#" + item + "3y").selectAll(".tick")
                .attr("class", "dashedtick")
        }
    }

    updateLegend(name) {

        let width = 400;
        let height = 50;

        //Set chart to be responsive
        for (let i = 1; i <= 4; i++) {
            let svg = d3.select("#"+name+"legend"+i)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox","0 0 "+width+", "+height*1.2);
            svg.selectAll("g").remove();
        }

        let legendgroup1 = d3.select("#"+name+"legend1").append("g")
            .attr("id", name+"legend1")
            .attr("transform", "translate("+(width / 4)+", "+(height / 4)+")");
        let legendgroup2 = d3.select("#"+name+"legend2").append("g")
            .attr("id", name+"legend2")
            .attr("transform", "translate("+(width / 4)+", "+(height / 4)+")");
        let legendgroup3 = d3.select("#"+name+"legend3").append("g")
            .attr("id", name+"legend3")
            .attr("transform", "translate("+(width / 3)+", "+(height / 4)+")");
        let legendgroup4 = d3.select("#"+name+"legend4").append("g")
            .attr("id", name+"legend4")
            .attr("transform", "translate("+(width / 15)+", "+(height / 4)+")");

        let colorScale12 = d3.scaleOrdinal()
            .domain(["regular", "delay for 15+ minutes"])
            .range(["LightGrey", "FireBrick"])
        let legendOrdinal12 = d3.legendColor()
            .orient("horizontal")
            .shape("path", d3.symbol().type(d3.symbolSquare).size(80)())
            .shapePadding(130)
            .scale(colorScale12);

        let colorScale3 = d3.scaleOrdinal()
            .domain(["departure", "arrival"])
            .range(["steelblue", "crimson"])
        let legendOrdinal3 = d3.legendColor()
            .orient("horizontal")
            .shape("path", d3.symbol().type(d3.symbolSquare).size(80)())
            .shapePadding(130)
            .scale(colorScale3);

        let colorScale4 = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(["Carrier Delay", "Weather Delay", "N A S Delay", "Security Delay", "Late Aircraft Delay"]);
        let legendOrdinal4 = d3.legendColor()
            .orient("horizontal")
            .labelWrap(85)
            .shape("path", d3.symbol().type(d3.symbolSquare).size(80)())
            .shapePadding(70)
            .scale(colorScale4);

        legendgroup1.call(legendOrdinal12);
        legendgroup2.call(legendOrdinal12);
        legendgroup3.call(legendOrdinal3);
        legendgroup4.call(legendOrdinal4);
    }
}