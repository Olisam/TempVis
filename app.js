var config = {
    apiKey: "AIzaSyDHT_DhUa87uFJcUAW60Msgz1hhdjsizlE",
    authDomain: "raspberry-6c3a6.firebaseapp.com",
    projectId: "raspberry-6c3a6",
    storageBucket: "raspberry-6c3a6.appspot.com",
    messagingSenderId: "71556025685",
    appId: "1:71556025685:web:f67c1d6290a95d478ff3dc",
    measurementId: "G-PFH5G5D26H"
  };

firebase.initializeApp(config);
var db = firebase.firestore();
const docRef = db.collection("Temperature");
const currentDocRef = docRef.doc("current");
var ctx = document.getElementById("myChart").getContext("2d");

// Current temp at top of page
var roundedNumb = 0;
currentDocRef.get().then(function (doc) {
  if (doc && doc.exists) {
      const myData = doc.data();
      var numb = myData.temp;
      console.log(numb);
      roundedNumb = Math.round(numb * 10) / 10;
      console.log(roundedNumb);
      document.getElementById("n1").innerText = roundedNumb + "°C";
  }
});
function refreshCurrentTemp() {
  currentDocRef.get().then(function (doc) {
    if (doc && doc.exists) {
        const myData = doc.data();
        var numb = myData.temp;
        roundedNumb = Math.round(numb * 10) / 10;
    }
  });
}
function resetCurrentTemp() {
  document.getElementById("n1").innerText = roundedNumb + "°C";
}

function returnDate(uTimestamp) {
  var rounduTimestamp = parseInt(uTimestamp, 10);
  var milliseconds = rounduTimestamp * 1000;
  var dateObject = new Date(milliseconds);
  var humanDate = dateObject.toLocaleString();
  return humanDate;
}

// Collect data from firestore
var posts =[];
var newposts = [];
var timestamps = [];
db.collection("Temperature").where("id", "==", "0000062c5cdf")
  .onSnapshot(function(querySnapshot) {
    posts = [];
    querySnapshot.forEach(function(doc) {
      var pTimestamp = parseInt(doc.data().timestamp, 10);
      posts.push({
        x: pTimestamp *1000,
        y: doc.data().temp
      });
    
    });
    newposts = posts.sort(function(x, y) {
      return new Date(x.x) - new Date(y.x);
    });
    updateGraph(newposts[newposts.length - 1]);
    refreshCurrentTemp();    
  });

// The Graph

var theChart;
function makeGraph() {
  console.log("DONE");
  theChart = new Chart(ctx, {
   type: 'line',
   data: {
       
    datasets: [{
      data: newposts,
      label: 'Outside',
      borderColor: '#ff0000',
      fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          type: 'time',
          ticks: {
            maxTicksLimit: 10
          },
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Temp (°C)'
          }
        }]
      }
    }
  });
}

function updateGraph(data) {
  theChart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  theChart.update();
}
function updateGraph2(data) {
  for (var i=0; i <1; i++) {
    theChart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
  }
  theChart.update();
}

setTimeout(makeGraph, 500);
setInterval(resetCurrentTemp, 60000);