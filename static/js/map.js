const markerFColorDefault = '#F00';
const markerSColorDefault = '#00A';
const markerColorSelected = '#00F';
const markerColorGreyOut = '#B1B1B1';
const markerFColorDefaultNight = '#FF4DD2';
const markerSColorDefaultNight = '#52DD4B';
const markerColorSelectedNight = '#29EDFF';
const markerColorGreyOutNight = '#003B7A';

const textColorDefault = 'rgba(255,255,255,1)';
const textColorNightGreyOut = 'rgba(255,255,255,0.4)';

const pathColorDefault = "#9900cc";
const pathColorSelected = "#18B948";
const pathColorDefaultNight = "#FFFF29";
const pathColorSelectedNight = "FFFFFF";
/* 90.00 N -> 90d0m0s */
function convertDDToDms(dd, isLng) {
    let dir = dd < 0 ? isLng ? 'W' : 'S' : isLng ? 'E' : 'N';
    let absDd = Math.abs(dd);
    let deg = absDd | 0;
    let frac = absDd - deg;
    let min = (frac * 60) | 0;
    /* Round it to 2 decimal points. */
    let sec = Math.round((frac * 3600 - min * 60) * 100) / 100;
    return deg + "°" + min + "'" + sec + '"' + dir;
}

function initMap() {
    /* The map, centered at C */
    const mapDefaultOptions = {
        zoom: 5,
        center: { lat: 39, lng: -96 },
        styles: '',
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    const mapDefaultNightOptions = {
        zoom: 5,
        center: { lat: 39, lng: -96 },
        styles: nightModeStyle,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    let map = new google.maps.Map(document.getElementById('map'), mapDefaultOptions);
    let mode = "airport"; // Mode, default: Airport Mode
    let currentZoomLevel = map.getZoom(); // current zoom level
    let IATA_LatLngDict = {}; // Get lat,lng of IATA
    let IATA_OrgDestsDict = {}; // Routes dict: orgIATA destIATA_Array
    let IATA_DetailDict = {};
    let keyPressedStack = {}; // Astack of pressed keys

    let airportMarkers = []; // Markers of airports
    let allRoutes = []; // All (originIATA,destIATA) pairs (route mode) { origin: origin, dest: dest }
    let allPaths = []; // Polylines of allRoutes
    let selectedOrgDestPaths = []; // Polylines of (selectedIATA,dest) pairs
    let selectedOrgDestHoverPaths = []; // Polylines of (selectedIATA,dest) pairs when hovering (route mode)

    let infoWindow = new google.maps.InfoWindow();
    let infoWindowSwitch = true; // infoWindow on/off switch
    let currentSelectedMarker; // The selected marker 
    let currentDestAirportsForSelected = []; // IATA destination of currentSelectedAirports

    let routeButton = document.getElementById('route');
    let airportButton = document.getElementById('airport');

    function ColorEvaluate(onTime) {
        return mode == 'route' ? markerFColorDefaultNight : "rgb(" + Math.max(Math.min(213 + 21 * (onTime - 73), 255), 150) + ", 0, 0)";
    }
    function scaleEvaluate(numDest) {
        let bias = currentZoomLevel - 5;
        let nightAirportScale = Math.max(7 + 3 * bias, 1);
        let majorAirportScale = Math.max(11.5 + 4 * bias, 1);
        let mediumAirportScale = Math.max(8 + 3 * bias, 1);
        let minorAirportScale = Math.max(4.5 + 2 * bias, 1);
        return mode == 'route' ? nightAirportScale : (numDest > 50) ? majorAirportScale : (numDest < 10) ? minorAirportScale : mediumAirportScale;
    }
    function fontEvaluate(numDest) {
        let bias = currentZoomLevel - 5;
        let nightFontSize = Math.max(7 + 3 * bias, 0) + 'px';
        let majorAirportFontSize = Math.max(10 + 3 * bias, 0) + 'px';
        let mediumAirportFontSize = Math.max(2 + 3 * bias, 0) + 'px';
        let minorAirportFontSize = Math.max(0 + 3 * bias, 0) + 'px';
        return mode == 'route' ? nightFontSize : (numDest > 50) ? majorAirportFontSize : (numDest < 10) ? minorAirportFontSize : mediumAirportFontSize;
    }
    function fillOpacityEvaluate() {
        let bias = currentZoomLevel - 5;
        return mode == 'route' ? Math.max(0.9 - 0.08 * bias, 0) : Math.max(0.8 - 0.1 * bias, 0);
    }
    function strokeOpacityEvaluate() {
        let bias = currentZoomLevel - 5;
        return mode == 'route' ? Math.max(0.8 - 0.05 * bias, 0) : Math.max(0.8 - 0.05 * bias, 0);
    }
    function strokeWeightEvaluate(isHover) {
        let bias = currentZoomLevel - 5;
        return mode == 'route' ? isHover ? 2 + 0.1 * bias : Math.max(0.06 + 0.04 * bias, 0.06) : 1;
    }

    const markerIconTemplate = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: markerFColorDefault,
        fillOpacity: 1,
        strokeColor: markerSColorDefault,
        strokeOpacity: 1,
        strokeWeight: 1,
        zIndex: 1
    };

    const markerIconNightTemplate = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: markerFColorDefaultNight,
        fillOpacity: 1,
        strokeColor: markerSColorDefaultNight,
        strokeOpacity: 1,
        strokeWeight: 1,
        zIndex: 1
    };


    d3.csv("/static/files/Origin_Dest_List.csv", data => {
        return data;
    }).then(function (data) {
        data.map(route => {
            orgAirport = route['origin'];
            destAirports = route['dest'].replace(/^\s+|s+$/g, '').split(/\s+/g);
            IATA_OrgDestsDict[orgAirport] = destAirports;
            destAirports.forEach(dest => {
                if (!allRoutes.some(route => route.origin === dest && route.dest === origin))
                    allRoutes.push({
                        origin: orgAirport,
                        dest: dest
                    });
            });
        });
    });

    /* Guarantee data loaded */
    d3.csv("/static/files/MapAirportSummary.csv", data => {
        return data;
    }).then(summaryData => {
        summaryData.map(airport => IATA_DetailDict[airport['Airport']] = airport);

        /* Plot all the markers with airport mode */
        for (let airport of data) {
            let airportPos = {
                lat: parseFloat(airport['Latitude']),
                lng: parseFloat(airport['Longitude'])
            };
            let markerIconCustom = markerIconTemplate;
            let numDest = airport['NumOfDest'];
            let onTime = (IATA_DetailDict[airport['IATA_Code']] == undefined) ? 100 : IATA_DetailDict[airport['IATA_Code']]['OnTimeDepRate'];
            markerIconCustom['scale'] = scaleEvaluate(numDest);
            markerIconCustom['fillColor'] = ColorEvaluate(onTime);
            markerIconCustom['fillOpacity'] = fillOpacityEvaluate();
            markerIconCustom['strokeColor'] = ColorEvaluate(onTime);
            markerIconCustom['strokeOpacity'] = strokeOpacityEvaluate();
            /* route mode regards every airport as of identical size */
            airportMarkers.push(new google.maps.Marker({
                label: {
                    text: airport['IATA_Code'],
                    color: textColorDefault,
                    fontSize: fontEvaluate(numDest),
                    numOfdest: numDest,
                    onTime: onTime
                },
                position: airportPos,
                icon: markerIconCustom,
                map: map,
            }));  // Custom marker let markerIconStar = google.maps.MarkerImage("icons/star.png");  
            IATA_LatLngDict[airport['IATA_Code']] = airportPos;
        }

        //-------------------------------Legend------------------------------
        let legend = document.getElementById('mapLegend');
        let scaleList = [10, 17, 23];
        let labelList = ['<10 Dests', '11-50 Dests', '>50 Dests'];
        let div;
        for (let i = 0; i < scaleList.length; i++) {
            div = document.createElement('div');
            div.innerHTML = "<img src='data:image/svg+xml;utf8,<svg viewBox=\"0 0 100 100\" height=\"" + scaleList[i] + "\" width=\"" + scaleList[i] + "\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"50\" style=\"fill: red; stroke: red; stroke-width: 1;\" opacity=\"1\"/></svg>'> " + labelList[i];
            legend.appendChild(div);
        }
        /* Push Legend to Right Bottom */
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

        //--------------------------Search bar---------------------------
        /* Add options */
        for (let airport of data)
            $('#airport_list').append('<option id="' + airport['IATA_Code'] + '" value="' + airport['IATA_Code'] + '  ' + airport['ICAO_Code'] + '  ' + airport['AirportName'] + ', ' + airport['City'] + ', ' + airport['State'] + '" />');
        
        /* Click search button */
        $('#searchbutton').on('click', function () {
            let keyword = $('#searchbar').val().trim().toUpperCase();
            let exist = false;
            for (let marker of airportMarkers)
                if (keyword.slice(0, 3) === marker['label']['text']) {
                    google.maps.event.trigger(marker, 'click');
                    exist = true;
                    break;
                }
            if (!exist) {
                alert(keyword + " does not exist!");
                return false;
            }
        });
        /* Remove form submit */
        $("#searchform").submit(function () {
            return false;
        });
        /* Press return */
        $("#searchbar").bind('keyup', function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                $('#searchbutton').trigger('click');
            }
        });
        /* Select from options */
        $("#searchbar").on('keyup', function () {
            let keyword = $('#searchbar').val();
            for (let marker of airportMarkers)
                if(keyword.slice(0, 3) === marker['label']['text']){
                    google.maps.event.trigger(marker, 'click');
                    break;
                }
        });

        //-----------------------------------------Listeners---------------------------------------
        google.maps.event.addListener(infoWindow, 'closeclick', function () {
            if (infoWindow.getMap())
                infoWindow.close();
        });

        google.maps.event.addListener(map, 'click', function () {
            google.maps.event.trigger(infoWindow, 'closeclick');
        });

        google.maps.event.addListener(map, 'zoom_changed', function () {
              
            currentZoomLevel = map.getZoom();
            /* Change markers */
            airportMarkers.forEach(marker => {
                if (marker.getVisible() == true) {
                    let iconOptions = marker.getIcon();
                    let labelOptions = marker.getLabel();
                    let numDest = labelOptions['numOfdest'];
                    iconOptions['fillOpacity'] = (iconOptions['fillColor'] == markerColorGreyOut) ? 0.3 : (iconOptions['fillColor'] == markerColorGreyOutNight) ? 0.3 : fillOpacityEvaluate();
                    iconOptions['strokeOpacity'] = strokeOpacityEvaluate();
                    iconOptions['scale'] = scaleEvaluate(numDest);
                    labelOptions['fontSize'] = fontEvaluate(numDest);
                    marker.setIcon(iconOptions);
                    marker.setLabel(labelOptions);
                }
            });
            /* Change route weight */
            allPaths.forEach(path => path.setOptions({ strokeWeight: strokeWeightEvaluate(false) }));
        });

        google.maps.event.addDomListener(document, 'keydown', function (e) {
            let code = (e.keyCode ? e.keyCode : e.which);
            keyPressedStack[code] = true;
            /* Press CTRL + Q  key to remove all lines */
            if (keyPressedStack['17'] && code === 81 && selectedOrgDestPaths.length > 0) {
                selectedOrgDestPaths.forEach(path => path.setMap(null));
                selectedOrgDestPaths = [];
                currentSelectedMarker = "";
                /* Return to default status */
                airportMarkers.forEach(marker => {
                    if (marker.getVisible() == true) {
                        let iconOptions = marker.getIcon();
                        let labelOptions = marker.getLabel();
                        let onTime = labelOptions['onTime'];
                        iconOptions['fillColor'] = iconOptions['strokeColor'] = ColorEvaluate(onTime);
                        iconOptions['fillOpacity'] = fillOpacityEvaluate();
                        iconOptions['strokeOpacity'] = strokeOpacityEvaluate();
                        labelOptions['color'] = textColorDefault;
                        marker.setIcon(iconOptions);
                        marker.setLabel(labelOptions);
                    }
                });
            }
        });

        /* Combo key stack pop operation */
        google.maps.event.addDomListener(document, 'keyup', function (e) {
            delete keyPressedStack[e.keyCode];
        });

        google.maps.event.addDomListener(airportButton, 'click', function (e) {
            mode = "airport";
            map.setOptions(mapDefaultOptions);
            currentSelectedMarker = "";
            /* Change marker style */
            airportMarkers.forEach(marker => {
                if (marker.getVisible() == true) {
                    let iconOptions = marker.getIcon();
                    let labelOptions = marker.getLabel();
                    let numDest = labelOptions['numOfdest'];
                    let onTime = labelOptions['onTime'];
                    iconOptions['fillColor'] = iconOptions['strokeColor'] = ColorEvaluate(onTime);
                    iconOptions['fillOpacity'] = fillOpacityEvaluate();
                    iconOptions['strokeOpacity'] = strokeOpacityEvaluate();
                    iconOptions['scale'] = scaleEvaluate(numDest);
                    labelOptions['color'] = textColorDefault;
                    labelOptions['fontSize'] = fontEvaluate(numDest);
                    marker.setIcon(iconOptions);
                    marker.setLabel(labelOptions);
                }
            });
            /* Remove all the paths */
            if (allPaths.length != 0) {
                allPaths.forEach(path => path.setMap(null));
                allPaths = [];
            }
            /* Remove paths */
            selectedOrgDestPaths.forEach(path => path.setMap(null));
            /* Add legend */
            if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length == 0)
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
            $("#legend").show();
        });

        google.maps.event.addDomListener(routeButton, 'click', function (e) {
            mode = "route";
            map.setOptions(mapDefaultNightOptions);
            currentSelectedMarker = "";
            airportMarkers.forEach(marker => {
                let iconOptions = markerIconNightTemplate;
                let labelOptions = marker.getLabel();
                iconOptions['scale'] = scaleEvaluate(0);
                iconOptions['fillOpacity'] = fillOpacityEvaluate();
                iconOptions['strokeOpacity'] = strokeOpacityEvaluate();
                labelOptions['color'] = textColorDefault;
                labelOptions['fontSize'] = fontEvaluate(0);
                marker.setIcon(iconOptions);
                marker.setLabel(labelOptions);
            });
            $('#infoOption').prop("checked", false);
            infoWindowSwitch = false;
            /* Remove polylines in airport mode */
            if (selectedOrgDestPaths.length != 0) {
                selectedOrgDestPaths.forEach(path => path.setMap(null));
                selectedOrgDestPaths = [];
            }
            allRoutes.forEach(route => {
                origin = route['origin'];
                dest = route['dest'];
                allPaths.push(new google.maps.Polyline({
                    path: [
                        { lat: IATA_LatLngDict[origin]['lat'], lng: IATA_LatLngDict[origin]['lng'] },
                        { lat: IATA_LatLngDict[dest]['lat'], lng: IATA_LatLngDict[dest]['lng'] }
                    ],
                    geodesic: true,
                    strokeColor: pathColorDefaultNight,
                    strokeOpacity: 1,
                    strokeWeight: strokeWeightEvaluate(false),
                    zIndex: 1,
                    map: map
                }));
            });
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
            $("#legend").hide();
        });


        // Add listener for each marker
        for (let i = 0; i < data.length; i++) {
            $('#infoOption').change(function () {
                infoWindowSwitch = $(this).prop("checked") ? true : false;
            });
            google.maps.event.addListener(airportMarkers[i], 'mouseover', function () {
                let iconOptions = airportMarkers[i].getIcon();
                iconOptions['fillColor'] = mode == 'route' ? markerColorSelectedNight : markerColorSelected;
                airportMarkers[i].setIcon(iconOptions);
                let hoverAirport = data[i];
                let infoContent = "<p><b><center>" + hoverAirport['AirportName'] + "</center></b>" +
                    "<br />" + "IATA CODE: " + hoverAirport['IATA_Code'] +
                    "<br />" + "ICAO CODE: " + hoverAirport['ICAO_Code'] +
                    "<br />" + "LOCATION: " + hoverAirport['City'] + ", " + hoverAirport['State'] +
                    "<br />" + "COORDINATES: " + convertDDToDms(hoverAirport['Latitude']) + ", " + convertDDToDms(hoverAirport['Longitude']) +
                    "<br />" + "ALTITUDE: " + hoverAirport['Altitude'] + " ft" +
                    "</p><a href=\"https://www.google.com/maps/search/" + hoverAirport['AirportName'] + "\" target=\"_blank\"> How to get there? </a>" +
                    "<p align=\"right\"><a href=\"https://www.wikipedia.org/wiki/" + hoverAirport['AirportName'] + "\" target=\"_blank\">  More Info </a></p>";
                if (infoWindowSwitch) {
                    infoWindow.setOptions({ content: infoContent });
                    infoWindow.open(map, airportMarkers[i]);
                } else
                    infoWindow.close();

                if (mode == 'route' && selectedOrgDestPaths.length === 0) {
                    const latitude = parseFloat(hoverAirport['Latitude']);
                    const longitude = parseFloat(hoverAirport['Longitude']);
                    let hoverDestAirports = IATA_OrgDestsDict[hoverAirport['IATA_Code']];
                    hoverDestAirports.forEach(dest => {
                        selectedOrgDestHoverPaths.push(new google.maps.Polyline({
                            path: [
                                { lat: latitude, lng: longitude },
                                { lat: IATA_LatLngDict[dest]['lat'], lng: IATA_LatLngDict[dest]['lng'] }
                            ],
                            geodesic: true,
                            strokeColor: pathColorSelectedNight,
                            strokeOpacity: 1.0,
                            strokeWeight: strokeWeightEvaluate(true),
                            zIndex: 2,
                            map: map
                        }));
                    });
                }
            });

            google.maps.event.addListener(airportMarkers[i], 'mouseout', function () {
                let iconOptions = airportMarkers[i].getIcon();
                if (currentSelectedMarker != airportMarkers[i])
                    if (selectedOrgDestPaths.length != 0 && !currentDestAirportsForSelected.includes(airportMarkers[i]['label']['text'])) {
                        iconOptions['fillColor'] = mode === 'route' ? markerColorGreyOutNight : markerColorGreyOut;
                        airportMarkers[i]['zIndex'] = 1;
                    }
                    else {
                        iconOptions['fillColor'] = mode === 'route' ? markerFColorDefaultNight : ColorEvaluate(airportMarkers[i]['label']['onTime']);
                        airportMarkers[i]['zIndex'] = 2;
                    }

                airportMarkers[i].setIcon(iconOptions);
                if (mode == 'route') {
                    selectedOrgDestHoverPaths.forEach(path => path.setMap(null));
                    selectedOrgDestHoverPaths = [];
                }
            });

            google.maps.event.addListener(airportMarkers[i], 'click', function () {
                /* Remove old flight routes/paths */
                if (selectedOrgDestPaths.length != 0) {
                    selectedOrgDestPaths.forEach(path => path.setMap(null));
                    selectedOrgDestPaths = [];
                }
                /* Add new routes */
                const selectedAirportInfo = data[i];
                const selectedAirportCode = selectedAirportInfo['IATA_Code'];
                const latitude = parseFloat(selectedAirportInfo['Latitude']);
                const longitude = parseFloat(selectedAirportInfo['Longitude']);
                currentDestAirportsForSelected = IATA_OrgDestsDict[selectedAirportCode];

                let scolor = pathColorDefault;
                let weight = 1;
                if (mode == 'route') {
                    scolor = pathColorSelectedNight;
                    weight = strokeWeightEvaluate(true);
                }
                if (currentDestAirportsForSelected == undefined) {
                    alert("Sorry, " + selectedAirportCode + " shows no charts for lack of data!");
                    return false;
                }
                else {
                    map.setCenter({ lat: latitude, lng: longitude });
                    currentSelectedMarker = airportMarkers[i];
                    currentDestAirportsForSelected.forEach(dest => {
                        destLat = IATA_LatLngDict[dest]['lat'];
                        destLong = IATA_LatLngDict[dest]['lng'];
                        selectedOrgDestPaths.push(new google.maps.Polyline({
                            path: [
                                { lat: latitude, lng: longitude },
                                { lat: destLat, lng: destLong }
                            ],
                            geodesic: true,
                            strokeColor: scolor,
                            strokeOpacity: 1.0,
                            strokeWeight: weight,
                            map: map,
                            zIndex: 3
                        }));
                    });
                    /* Grey out all airports except origin and dests */
                    for (let marker of airportMarkers)
                        if (marker.getVisible()) {
                            let iconOptions = marker.getIcon();
                            let labelOptions = marker.getLabel();
                            iconOptions['strokeColor'] = ColorEvaluate(labelOptions['onTime']);
                            iconOptions['fillOpacity'] = fillOpacityEvaluate();
                            labelOptions['color'] = textColorDefault;
                            marker['zIndex'] = 2;
                            if (marker == currentSelectedMarker)
                                iconOptions['fillColor'] = mode == 'route' ? markerColorSelectedNight : markerColorSelected;
                            else if (currentDestAirportsForSelected.includes(labelOptions['text']))
                                iconOptions['fillColor'] = mode == 'route' ? markerFColorDefaultNight : ColorEvaluate(labelOptions['onTime']);
                            else {
                                iconOptions['fillColor'] = iconOptions['strokeColor'] = mode == 'route' ? markerColorGreyOutNight : markerColorGreyOut;
                                iconOptions['fillOpacity'] = iconOptions['strokeOpacity'] = 0.3;
                                labelOptions['color'] = textColorNightGreyOut;
                                marker['zIndex'] = 1;
                            }
                            marker.setIcon(iconOptions);
                            marker.setLabel(labelOptions);
                        }
                    let airport_details = IATA_DetailDict[selectedAirportInfo['IATA_Code']];
                    let nullIndicator = "NOT GIVEN";
                    $('#APName').html(selectedAirportInfo['AirportName']);
                    $('#APLat').html((selectedAirportInfo['Latitude']).toFixed(5));
                    $('#APLng').html((selectedAirportInfo['Longitude']).toFixed(5));
                    $('#NumOfDests').html(currentDestAirportsForSelected.length);
                    $('#AvgDist').html((airport_details === undefined) ? nullIndicator : parseFloat(airport_details['AvgDist']).toFixed(2));
                    $('#AvgDepDelay').html((airport_details === undefined) ? nullIndicator : parseFloat(airport_details['AvgDepDelay']).toFixed(2));
                    $('#OnTimeDepRate').html((airport_details === undefined) ? nullIndicator : airport_details['OnTimeDepRate'] + "%");
                    $('#CancellationRate').html((airport_details === undefined) ? nullIndicator : airport_details['CancellationRate'] + "%");
                    $('#AvgArrDelay').html((airport_details === undefined) ? nullIndicator : parseFloat(airport_details['AvgArrDelay']).toFixed(2));
                    $('#OnTimeArrRate').html((airport_details === undefined) ? nullIndicator : airport_details['OnTimeArrRate'] + "%");
                    updateStats(selectedAirportCode);
                }
            });
        }
    });
}


//-------------------------stats.js----------------------------

hasContainer = { value: false };

function appendContainer() {

    d3.select("#hrdiv").append("hr");
    d3.select("#accordion").attr("class", "panelafter");

    for (let row of ["month", "day", "hour"]) {
        let rowdiv = d3.select("#" + row);
        for (let i = 1; i <= 4; i++) {
            let div = rowdiv.append("div").attr("class", "col-md-3");

            let svg = div.append("svg")
                .attr("id", row + i)
            let legend = div.append("svg")
                .attr("id", row + "legend" + i)
            svg.append("g").attr("id", row + i + "x")
            svg.append("g").attr("id", row + i + "y")
            let temp = svg.append("g").attr("id", row + i + "z")
            if (i == 1 || i == 2 || i == 3) {
                temp.append("g").attr("id", row + i + "z1")
                temp.append("g").attr("id", row + i + "z2")
            }
            svg.append("g").attr("id", row + i + "t")
        }
    }

}

function removeContainer() {
    d3.select("#hrdiv").selectAll("hr").remove();
    for (let row of ["month", "day", "hour"]) {
        d3.select("#" + row).selectAll("div").remove();
    }
}

function updateStats(selectedAirport) {
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

    d3.csv("static/files/airports/" + selectedAirport + ".csv", airportData => { return airportData; }).then(data => {

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
            else if (datum.Type == 'y')
                hourData.push(datum)
        }

        let countScale = d3.scaleLinear()
            .domain([d3.max(monthData.map(function (obj) {
                return obj.Count;
            })) * 1.5, 0])
            .range([0, height * 0.8])

        let depDelayScale = d3.scaleLinear()
            .domain([d3.max(monthData.map(function (obj) {
                return obj.DepDelay;
            })), d3.min(monthData.map(function (obj) {
                return obj.DepDelay;
            }))])
            .range([0, height * 0.8])

        let arrDelayScale = d3.scaleLinear()
            .domain([d3.max(monthData.map(function (obj) {
                return obj.ArrDelay;
            })), d3.min(monthData.map(function (obj) {
                return obj.ArrDelay;
            }))])
            .range([0, height * 0.8])

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


function setHasContainer(has) {
    this.hasContainer.value = has;
}


function updateDepBarChart(name, data) {

    let width = 400;
    let height = 200;

    let xScale = d3.scaleBand()
        .domain(data.map(function (obj) {
            return obj.Time;
        }))
        .range([0, width * 0.8])
    let xAxis = d3.axisBottom()
        .scale(xScale)

    let limit = d3.max(data.map(function (obj) {
        return parseInt(obj.Count);
    })) * 1.2;
    let yScale = d3.scaleLinear()
        .domain([limit, 0])
        .range([0, height * 0.8])
    let yAxis = d3.axisLeft()
        .scale(yScale)

    //Set chart to be responsive
    let svg = d3.select("#" + name)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height * 1.2);

    d3.select("#" + name + "t").selectAll("text").remove();
    d3.select("#" + name + "t").append("text")
        .attr("transform", "translate(" + (width * 0.15) + ", " + (height * 0.1) + ")")
        .text(function () {
            let type = name.slice(0, 1);
            if (type == "m")
                return "Outbound flights distribution over year"
            if (type == "d")
                return "Outbound flights distribution over week"
            if (type == "h")
                return "Outbound flights distribution over 5 years"
        })

    //draw xAxis
    let x = d3.select("#" + name + "x");
    x.attr("transform", "translate(" + width * 0.1 + ", " + height * 0.95 + ")")
        .transition()
        .duration(1000)
        .call(xAxis);

    //draw yAxis
    let y = d3.select("#" + name + "y");
    y.selectAll(".texttoberemoved").remove();

    y.attr("transform", "translate(" + width * 0.1 + ", " + height * 0.15 + ")")
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
        .html(function (d) {
            return "<span><strong>Total Flights: </strong>" + d.Count + "</span><br>" +
                "<span><strong>15+min Delay: </strong>" + (d["15minDepDelay"] * 100).toFixed(2) + "%</span>"
        })
    svg.call(tip);

    //draw bar chart1
    let barsgroup = d3.select("#" + name + "z1")
        .attr("transform", "translate(" + (width * 0.1 + width * 0.05 / data.length) + ", " + height * 0.95 + ") scale(1,-1)");

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
        .attr("height", d => (height * 0.8 - yScale(parseInt(d.Count))))
        .attr("class", "bar1")


    //draw bar chart2
    let barsgroup2 = d3.select("#" + name + "z2")
        .attr("transform", "translate(" + (width * 0.1 + width * 0.05 / data.length) + ", " + height * 0.95 + ") scale(1,-1)");

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
        .attr("height", d => height * 0.8 - yScale(parseInt(d.Count) * parseFloat(d["15minDepDelay"])))
        .attr("class", "bar2")
}

function updateArrBarChart(name, data) {

    let width = 400;
    let height = 200;

    let xScale = d3.scaleBand()
        .domain(data.map(function (obj) {
            return obj.Time;
        }))
        .range([0, width * 0.8])
    let xAxis = d3.axisBottom()
        .scale(xScale)

    let limit = d3.max(data.map(function (obj) {
        return parseInt(obj.Count2);
    })) * 1.2;
    let yScale = d3.scaleLinear()
        .domain([limit, 0])
        .range([0, height * 0.8])
    let yAxis = d3.axisLeft()
        .scale(yScale)

    //Set chart to be responsive
    let svg = d3.select("#" + name)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height * 1.2);

    d3.select("#" + name + "t").selectAll("text").remove();
    d3.select("#" + name + "t").append("text")
        .attr("transform", "translate(" + (width * 0.18) + ", " + (height * 0.1) + ")")
        .text(function () {
            let type = name.slice(0, 1);
            if (type == "m")
                return "Inbound flights distribution over year"
            if (type == "d")
                return "Inbound flights distribution over week"
            if (type == "h")
                return "Inbound flights distribution over 5 years"
        })

    //draw xAxis
    let x = d3.select("#" + name + "x");
    x.attr("transform", "translate(" + width * 0.1 + ", " + height * 0.95 + ")")
        .transition()
        .duration(1000)
        .call(xAxis);

    //draw yAxis
    let y = d3.select("#" + name + "y");
    y.selectAll(".texttoberemoved").remove();

    y.attr("transform", "translate(" + width * 0.1 + ", " + height * 0.15 + ")")
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
        .html(function (d) {
            return "<span><strong>Total Flights: </strong>" + d.Count + "</span><br>" +
                "<span><strong>15+min Delay: </strong>" + (d["15minArrDelay"] * 100).toFixed(2) + "%</span>"
        })
    svg.call(tip);

    //draw bar chart1
    let barsgroup = d3.select("#" + name + "z1")
        .attr("transform", "translate(" + (width * 0.1 + width * 0.05 / data.length) + ", " + height * 0.95 + ") scale(1,-1)");

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
        .attr("height", d => (height * 0.8 - yScale(parseInt(d.Count2))))
        .attr("class", "bar1")

    //draw bar chart2
    let barsgroup2 = d3.select("#" + name + "z2")
        .attr("transform", "translate(" + (width * 0.1 + width * 0.05 / data.length) + ", " + height * 0.95 + ") scale(1,-1)");

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
        .attr("height", d => height * 0.8 - yScale(parseInt(d.Count2) * parseFloat(d["15minArrDelay"])))
        .attr("class", "bar2")
}

function updateLineChart(name, data) {

    let width = 400;
    let height = 200;

    let xScale = d3.scaleBand()
        .domain(data.map(function (obj) {
            return obj.Time;
        }))
        .range([0, width * 0.8])
    let xAxis = d3.axisBottom()
        // .tickSize(-height / 1.2)
        .scale(xScale)

    let limit = 30;
    let negLmit = -5

    let yScale = d3.scaleLinear()
        .domain([negLmit, limit])
        .range([height * 0.8, 0])
    let yAxis = d3.axisLeft()
        .tickSize(-width)
        .scale(yScale)

    //Set chart to be responsive
    let svg = d3.select("#" + name)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height * 1.2);

    d3.select("#" + name + "t").selectAll("text").remove();
    d3.select("#" + name + "t").append("text")
        .attr("transform", "translate(" + (width * 0.25) + ", " + (height * 0.1) + ")")
        .text(function () {
            let type = name.slice(0, 1);
            if (type == "m")
                return "Average flight delay over year"
            if (type == "d")
                return "Average flight delay over week"
            if (type == "h")
                return "Average flight delay over 5 years"
        })

    //draw xAxis
    let x = d3.select("#" + name + "x");
    x.attr("transform", "translate(" + width * 0.1 + ", " + height * 0.95 + ")")
        .transition()
        .duration(1000)
        .call(xAxis);
    x.selectAll(".domain").remove();

    //draw yAxis
    let y = d3.select("#" + name + "y");
    y.selectAll(".texttoberemoved").remove();

    y.attr("transform", "translate(" + width * 0.1 + ", " + height * 0.15 + ")")
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
        .html(function (d) {
            // console.log(d)
            return "<span><strong>Dep Delay: </strong>" + parseFloat(d.DepDelay).toFixed(2) + "min</span><br>" +
                "<span><strong>Arr Delay: </strong>" + parseFloat(d.ArrDelay).toFixed(2) + "min</span>";
        })
    svg.call(tip);

    //setup line chart
    let linesgroup = d3.select("#" + name + "z")
        .attr("transform", "translate(" + (width * 0.1 + width * 0.4 / data.length) + ", " + height * 0.15 + ")");

    let depGenerator = d3.line()
        .x(d => xScale(d.Time))
        .y(d => yScale(d.DepDelay));
    depGenerator = depGenerator(data);

    let arrGenerator = d3.line()
        .x(d => xScale(d.Time))
        .y(d => yScale(d.ArrDelay));
    arrGenerator = arrGenerator(data);

    let generator = [{ name: "DepDelayTime", value: depGenerator },
    { name: "ArrDelayTime", value: arrGenerator }
    ];

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
    let nodes1 = d3.select("#" + name + "z1").selectAll("circle")
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


    let nodes2 = d3.select("#" + name + "z2").selectAll("circle")
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

function updateAreaChart(name, data) {

    let width = 400;
    let height = 200;

    let xScale = d3.scaleBand()
        .domain(data.map(function (obj) {
            return obj.Time;
        }))
        .range([0, width * 0.8]);

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
        .range([height * 0.8, 0.0])
    let yAxis = d3.axisLeft()
        .scale(yScale);

    //Set chart to be responsive
    let svg = d3.select("#" + name)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height * 1.2);

    d3.select("#" + name + "t").selectAll("text").remove();
    d3.select("#" + name + "t").append("text")
        .attr("transform", "translate(" + (width * 0.20) + ", " + (height * 0.1) + ")")
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
    d3.select("#" + name + "x")
        .attr("transform", "translate(" + width * 0.1 + ", " + height * 0.95 + ")")
        .transition()
        .duration(1000)
        .call(xAxis);

    //draw yAxis
    d3.select("#" + name + "y")
        .attr("transform", "translate(" + width * 0.1 + ", " + height * 0.15 + ")")
        .transition()
        .duration(1000)
        .call(yAxis);

    var area = d3.area()
        .x(function (d) { return xScale(d.data.Time); })
        .y0(function (d) { return yScale(d[0]); })
        .y1(function (d) { return yScale(d[1]); });

    let areasgroup = d3.select("#" + name + "z")
        .attr("transform", "translate(" + (width * 0.1 + width * 0.4 / data.length) + ", " + height * 0.15 + ") scale(1,1)");

    var keys = ["CarrierDelay",
        "WeatherDelay",
        "NASDelay",
        "SecurityDelay",
        "LateAircraftDelay"
    ];
    var stack = d3.stack();
    var z = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);
    stack.keys(keys);

    let areaPath = areasgroup.selectAll("path")
        .data(stack(data));
    areaPath.exit().remove();
    areaPath = areaPath.enter().append("path").merge(areaPath)
        .style("fill", function (d) { return z(d.key); })
        .transition()
        .duration(1000)
        .attr("d", area);
}

function rotateHour() {
    for (let i = 1; i <= 4; i++) {
        d3.select("#hour" + i + "x").selectAll("text")
            .attr("transform", "translate(-24, 18), rotate(-45)");
    }

    for (let item of ["month", "day", "hour"]) {
        d3.select("#" + item + "3y").selectAll(".tick")
            .attr("class", "dashedtick")
    }
}

function updateLegend(name) {

    let width = 400;
    let height = 50;

    //Set chart to be responsive
    for (let i = 1; i <= 4; i++) {
        let svg = d3.select("#" + name + "legend" + i)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + ", " + height * 1.2);
        svg.selectAll("g").remove();
    }

    let legendgroup1 = d3.select("#" + name + "legend1").append("g")
        .attr("id", name + "legend1")
        .attr("transform", "translate(" + (width / 4) + ", " + (height / 4) + ")");
    let legendgroup2 = d3.select("#" + name + "legend2").append("g")
        .attr("id", name + "legend2")
        .attr("transform", "translate(" + (width / 4) + ", " + (height / 4) + ")");
    let legendgroup3 = d3.select("#" + name + "legend3").append("g")
        .attr("id", name + "legend3")
        .attr("transform", "translate(" + (width / 3) + ", " + (height / 4) + ")");
    let legendgroup4 = d3.select("#" + name + "legend4").append("g")
        .attr("id", name + "legend4")
        .attr("transform", "translate(" + (width / 15) + ", " + (height / 4) + ")");

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
        .domain(["Carrier Delay", "Weather Delay", "NAS Delay", "Security Delay", "Late Aircraft Delay"]);
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

const nightModeStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
    }
];