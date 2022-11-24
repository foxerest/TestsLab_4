/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9226190476190477, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45454545454545453, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-30"], "isController": false}, {"data": [1.0, 500, 1500, "-31"], "isController": false}, {"data": [1.0, 500, 1500, "-10"], "isController": false}, {"data": [0.875, 500, 1500, "-32"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "-11"], "isController": false}, {"data": [1.0, 500, 1500, "-12"], "isController": false}, {"data": [0.75, 500, 1500, "-34"], "isController": false}, {"data": [0.95, 500, 1500, "-13"], "isController": false}, {"data": [1.0, 500, 1500, "-35"], "isController": false}, {"data": [1.0, 500, 1500, "-14"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "-15"], "isController": false}, {"data": [1.0, 500, 1500, "-16"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "-17"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "-18"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "-19"], "isController": false}, {"data": [0.85, 500, 1500, "-1"], "isController": false}, {"data": [0.925, 500, 1500, "-2"], "isController": false}, {"data": [0.95, 500, 1500, "-3"], "isController": false}, {"data": [0.925, 500, 1500, "-4"], "isController": false}, {"data": [1.0, 500, 1500, "-5"], "isController": false}, {"data": [1.0, 500, 1500, "-6"], "isController": false}, {"data": [0.975, 500, 1500, "-7"], "isController": false}, {"data": [0.975, 500, 1500, "-8"], "isController": false}, {"data": [1.0, 500, 1500, "-20"], "isController": false}, {"data": [1.0, 500, 1500, "-9"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "-21"], "isController": false}, {"data": [1.0, 500, 1500, "-22"], "isController": false}, {"data": [1.0, 500, 1500, "-23"], "isController": false}, {"data": [0.96875, 500, 1500, "-24"], "isController": false}, {"data": [1.0, 500, 1500, "-25"], "isController": false}, {"data": [1.0, 500, 1500, "-26"], "isController": false}, {"data": [1.0, 500, 1500, "-27"], "isController": false}, {"data": [1.0, 500, 1500, "-28"], "isController": false}, {"data": [1.0, 500, 1500, "-29"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 533, 0, 0.0, 213.95309568480295, 24, 12217, 145.0, 288.80000000000007, 519.1999999999998, 825.1399999999991, 33.787638668779714, 9.525926109350237, 16.339329932646592], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 55, 0, 0.0, 1451.945454545454, 48, 3751, 1154.0, 3166.0, 3516.599999999999, 3751.0, 9.853099247581511, 24.09180737190971, 41.2413085587603], "isController": true}, {"data": ["-30", 12, 0, 0.0, 141.5, 48, 290, 137.0, 273.80000000000007, 290.0, 290.0, 10.92896174863388, 2.988387978142076, 5.2830430327868845], "isController": false}, {"data": ["-31", 5, 0, 0.0, 92.4, 55, 225, 59.0, 225.0, 225.0, 225.0, 10.79913606911447, 2.952888768898488, 5.209739470842332], "isController": false}, {"data": ["-10", 20, 0, 0.0, 176.14999999999998, 50, 313, 219.5, 254.9, 310.09999999999997, 313.0, 16.863406408094434, 4.611087689713322, 8.151744308600337], "isController": false}, {"data": ["-32", 4, 0, 0.0, 254.0, 57, 642, 158.5, 642.0, 642.0, 642.0, 4.166666666666667, 1.1393229166666667, 2.0100911458333335], "isController": false}, {"data": ["-11", 19, 0, 0.0, 165.6315789473684, 48, 792, 76.0, 285.0, 792.0, 792.0, 10.23706896551724, 2.7991985452586206, 4.948583142510776], "isController": false}, {"data": ["-12", 19, 0, 0.0, 163.21052631578948, 47, 464, 203.0, 270.0, 464.0, 464.0, 10.326086956521738, 2.823539402173913, 4.991614300271739], "isController": false}, {"data": ["-34", 2, 0, 0.0, 412.5, 224, 601, 412.5, 601.0, 601.0, 601.0, 3.0120481927710845, 0.8236069277108433, 1.453077936746988], "isController": false}, {"data": ["-13", 20, 0, 0.0, 745.0999999999999, 49, 12217, 139.0, 272.3, 11619.849999999991, 12217.0, 1.6370631087828436, 0.44763444380780876, 0.791353748874519], "isController": false}, {"data": ["-35", 5, 0, 0.0, 157.2, 69, 220, 210.0, 220.0, 220.0, 220.0, 8.051529790660224, 2.2015901771336552, 3.8842340982286636], "isController": false}, {"data": ["-14", 19, 0, 0.0, 161.52631578947367, 48, 353, 208.0, 264.0, 353.0, 353.0, 9.576612903225806, 2.6186050907258065, 4.629319713961694], "isController": false}, {"data": ["-15", 19, 0, 0.0, 190.0, 48, 932, 211.0, 241.0, 932.0, 932.0, 11.150234741784038, 3.048892312206573, 5.39000605193662], "isController": false}, {"data": ["-16", 19, 0, 0.0, 191.94736842105263, 47, 442, 216.0, 315.0, 442.0, 442.0, 11.255924170616113, 3.0777917654028437, 5.441096156694313], "isController": false}, {"data": ["-17", 19, 0, 0.0, 161.52631578947367, 49, 632, 203.0, 238.0, 632.0, 632.0, 9.49050949050949, 2.595061188811189, 4.587697458791209], "isController": false}, {"data": ["-18", 19, 0, 0.0, 212.57894736842107, 49, 835, 155.0, 648.0, 835.0, 835.0, 9.017560512577123, 2.465739202657807, 4.35907466184148], "isController": false}, {"data": ["-19", 19, 0, 0.0, 846.0526315789473, 54, 12062, 215.0, 754.0, 12062.0, 12062.0, 1.4658231754358895, 0.40081102453325107, 0.7085766326569974], "isController": false}, {"data": ["-1", 20, 0, 0.0, 354.3500000000001, 70, 662, 356.0, 627.4000000000001, 660.4499999999999, 662.0, 14.925373134328359, 4.08115671641791, 7.214902052238806], "isController": false}, {"data": ["-2", 20, 0, 0.0, 250.44999999999996, 50, 806, 232.5, 569.3000000000002, 794.4499999999998, 806.0, 13.927576601671309, 3.8083217270194987, 6.732568767409471], "isController": false}, {"data": ["-3", 20, 0, 0.0, 185.9, 55, 645, 137.0, 497.6000000000004, 638.6499999999999, 645.0, 12.492192379762647, 3.4158338538413493, 6.038706277326671], "isController": false}, {"data": ["-4", 20, 0, 0.0, 214.65, 47, 804, 71.5, 722.6000000000001, 800.4, 804.0, 13.927576601671309, 3.8083217270194987, 6.732568767409471], "isController": false}, {"data": ["-5", 20, 0, 0.0, 170.85, 54, 368, 205.0, 313.7000000000001, 365.54999999999995, 368.0, 11.235955056179774, 3.072331460674157, 5.431443117977528], "isController": false}, {"data": ["-6", 20, 0, 0.0, 55.24999999999999, 47, 80, 54.0, 64.4, 79.24999999999999, 80.0, 11.254924029262801, 3.228096862689927, 5.462594963421497], "isController": false}, {"data": ["-7", 20, 0, 0.0, 202.29999999999998, 142, 523, 146.0, 429.3, 518.3499999999999, 523.0, 17.035775127768314, 8.060383837308349, 8.334886073253834], "isController": false}, {"data": ["-8", 20, 0, 0.0, 156.99999999999997, 50, 951, 69.0, 293.10000000000014, 918.3999999999995, 951.0, 11.198208286674133, 3.0620100783874578, 5.369453387458007], "isController": false}, {"data": ["-20", 18, 0, 0.0, 154.1111111111111, 51, 313, 173.5, 258.1000000000001, 313.0, 313.0, 9.022556390977444, 2.4671052631578947, 4.361489661654135], "isController": false}, {"data": ["-9", 20, 0, 0.0, 31.75, 24, 50, 29.5, 47.7, 49.9, 50.0, 18.51851851851852, 5.311414930555555, 8.987991898148147], "isController": false}, {"data": ["-21", 17, 0, 0.0, 147.64705882352942, 51, 555, 74.0, 310.19999999999976, 555.0, 555.0, 11.494252873563218, 3.1429597701149423, 5.556303879310344], "isController": false}, {"data": ["-22", 17, 0, 0.0, 157.64705882352945, 47, 244, 206.0, 222.39999999999998, 244.0, 244.0, 11.509817197020988, 3.1472156398104265, 5.563827648950575], "isController": false}, {"data": ["-23", 17, 0, 0.0, 155.64705882352942, 49, 316, 199.0, 302.4, 316.0, 316.0, 12.203876525484565, 3.336997487437186, 5.899334843862168], "isController": false}, {"data": ["-24", 16, 0, 0.0, 174.0625, 49, 571, 202.5, 337.2000000000003, 571.0, 571.0, 9.280742459396752, 2.5377030162412995, 4.486296403712297], "isController": false}, {"data": ["-25", 14, 0, 0.0, 108.78571428571428, 48, 211, 57.5, 208.0, 211.0, 211.0, 10.8359133126935, 2.9629450464396285, 5.238063564241486], "isController": false}, {"data": ["-26", 8, 0, 0.0, 100.125, 49, 223, 66.0, 223.0, 223.0, 223.0, 8.290155440414507, 2.266839378238342, 4.007448186528498], "isController": false}, {"data": ["-27", 10, 0, 0.0, 99.39999999999999, 47, 287, 58.5, 278.90000000000003, 287.0, 287.0, 11.098779134295228, 3.0348224195338513, 5.365132491675915], "isController": false}, {"data": ["-28", 6, 0, 0.0, 79.0, 46, 218, 50.5, 218.0, 218.0, 218.0, 7.462686567164179, 2.040578358208955, 3.607451026119403], "isController": false}, {"data": ["-29", 10, 0, 0.0, 143.10000000000002, 48, 228, 164.5, 226.9, 228.0, 228.0, 11.185682326621924, 3.0585850111856825, 5.407141359060403], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 533, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
