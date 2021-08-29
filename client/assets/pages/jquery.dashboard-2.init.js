/**
 * Theme: Frogetor - Responsive Bootstrap 4 Admin Dashboard
 * Author: Mannatthemes
 * Dashboard-2 Js
 */


//dash-usa-map

$('#user_usa').vectorMap({
  map: 'us_aea_en',
  backgroundColor: 'transparent',
  borderColor: '#818181',
  regionStyle: {
    initial: {
      fill: '#e2e2f1',
    }
  },
  series: {
    regions: [{
        values: {
            "US-VA": '#b7b6d4',
            "US-PA": '#b7b6d4',
            "US-TN": '#b7b6d4',
            "US-WY": '#b7b6d4',
            "US-WA": '#b7b6d4',
            "US-TX": '#b7b6d4',
        },
        attribute: 'fill',
    }]
  },
});
 

// d2_overview

   var options = {
    chart: {
        height: 350,
        type: 'area',
    },
    dataLabels: {
        enabled: false
    },
    colors:['#00bcd4', '#7043c1'],
    stroke: {
        curve: 'smooth'
    },
    markers: {
      size: 3,
      opacity: 0.9,
      colors: ["#f93b7a"],
      strokeColor: "#fff",
      strokeWidth: 2,
      style: 'inverted', // full, hollow, inverted
      hover: {
        size: 5,
      }
    },
    series: [{
        name: 'series1',
        data: [3, 30, 10, 10, 22, 12, 5, 15, 5, 25, 5, 7]
    }, {
        name: 'series2',
        data: [5, 15, 12, 25, 5, 7, 30, 10, 18, 5, 12, 5,]
    }],

    xaxis: {
        type: 'month',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',],                
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    }
}

       //radar chart
        var radarChart = {
            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
            datasets: [
                {
                    label: "Desktops",
                    backgroundColor: "rgba(152,212,206,0.3)",
                    borderColor: "#98d4ce",
                    pointBackgroundColor: "#038660",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: "Tablets",
                    backgroundColor: "rgba(21,128,196,0.2)",
                    borderColor: "#1580c4",
                    pointBackgroundColor: "#095d88",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(255,99,132,1)",
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };
        this.respChart($("#radar"),'Radar',radarChart);

        //Polar area chart
        var polarChart = {
            datasets: [{
                data: [
                    11,
                    16,
                    7,
                    18
                ],
                backgroundColor: [
                    "#1580c4",
                    "#162546",
                    "#ebeff2",
                    "#ea3c75"
                ],
                label: 'My dataset', // for legend
                hoverBorderColor: "#fff"
            }],
            labels: [
                "Series 1",
                "Series 2",
                "Series 3",
                "Series 4"
            ]
        };
        this.respChart($("#polarArea"),'PolarArea',polarChart);
    },
    $.ChartJs = new ChartJs, $.ChartJs.Constructor = ChartJs

}(window.jQuery),

//initializing
function($) {
    "use strict";
    $.ChartJs.init()
}(window.jQuery);

// Datatable
$('#datatable').DataTable();


