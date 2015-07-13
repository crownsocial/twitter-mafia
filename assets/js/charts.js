var barData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "total tweets",
      fillColor: "rgba(80,200,80,0.5)",
      strokeColor: "rgba(80,200,80,0.8)",
      highlightFill: "rgba(80,200,80,0.75)",
      highlightStroke: "rgba(80,200,80,1)",
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

var doughnutData = [
  {
    value: 175,
    color:"#F7464A",
    highlight: "#FF5A5E",
    label: "replies"
  },
  {
    value: 100,
    color: "#FDB45C",
    highlight: "#FFC870",
    label: "retweets"
  },
  {
    value: 50,
    color: "rgba(80,200,80,1)",
    highlight: "rgba(100,220,100,1)",
    label: "links"
  },
  {
    value: 50,
    color: "#46BFBD",
    highlight: "#5AD3D1",
    label: "hashtags"
  }
]

var overlayData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "total followers",
      type: "bar",
      fillColor: "rgba(220,20,220,0.5)",
      strokeColor: "rgba(220,20,220,0.8)",
      highlightFill: "rgba(220,20,220,0.75)",
      highlightStroke: "rgba(220,20,220,1)",
      data: [32, 25, 33, 88, 12, 92, 33]
    },
    {
      label: "engagements per post",
      type: "line",
      fillColor: "rgba(110,110,110,0.2)",
      strokeColor: "rgba(110,110,110,0.8)",
      pointColor: "rgba(110,110,110,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(110,110,110,1)",
      data: [65, 59, 4, 81, 56, 55, 40]
    }
  ]
};

document.addEventListener("DOMContentLoaded", function() {

  var barCtx = document.getElementById("bar-chart").getContext("2d");
  var barChart = new Chart(barCtx).Bar(barData);

  var doughnutCtx = document.getElementById("doughnut-chart").getContext("2d");
  var doughnutChart = new Chart(doughnutCtx).Doughnut(doughnutData);

  var overlayCtx = document.getElementById("overlay-chart").getContext("2d");
  var overlayChart = new Chart(overlayCtx).Overlay(overlayData);
})