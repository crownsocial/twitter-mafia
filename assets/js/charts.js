var overlayData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "total followers",
      type: "bar",
      fillColor: "rgba(128, 128, 128, 0.4)",
      strokeColor: "rgba(128, 128, 128, 0.8)",
      highlightFill: "rgba(228, 135, 27, 0.75)",
      highlightStroke: "rgba(228, 135, 27, 1)",
      data: [32, 25, 33, 88, 12, 92, 33]
    },
    {
      label: "engagements per post",
      type: "line",
      fillColor: "rgba(192, 192, 192,0.4)",
      strokeColor: "rgba(192, 192, 192,0.8)",
      pointColor: "rgba(192, 192, 192,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(110,110,110,1)",
      data: [65, 59, 4, 81, 56, 55, 40]
    }
  ]
};

var barData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "total tweets",
      fillColor: "rgba(160, 160, 160, 0.4)",
      strokeColor: "rgba(160, 160, 160, 0.8)",
      highlightFill: "rgba(228, 135, 27, 0.75)",
      highlightStroke: "rgba(228, 135, 27, 1)",
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

var doughnutData = [
  {
    value: 125,
    color:"rgb(96, 96, 96)",
    highlight: "rgb(228, 135, 27)",
    label: "replies"
  },
  {
    value: 100,
    color: "rgb(160, 160, 160)",
    highlight: "rgb(228, 135, 27)",
    label: "retweets"
  },
  {
    value: 50,
    color: "rgb(128, 128, 128)",
    highlight: "rgb(228, 135, 27)",
    label: "links"
  },
  {
    value: 75,
    color: "rgb(192, 192, 192)",
    highlight: "rgb(228, 135, 27)",
    label: "hashtags"
  }
]

document.addEventListener("DOMContentLoaded", function() {

  var overlayCtx = document.getElementById("overlay-chart").getContext("2d");
  var overlayChart = new Chart(overlayCtx).Overlay(overlayData);

  var barCtx = document.getElementById("bar-chart").getContext("2d");
  var barChart = new Chart(barCtx).Bar(barData);

  var doughnutCtx = document.getElementById("doughnut-chart").getContext("2d");
  var doughnutChart = new Chart(doughnutCtx).Doughnut(doughnutData);
})