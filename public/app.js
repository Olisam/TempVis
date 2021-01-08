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

var roundedNumb = 0;
currentDocRef.get().then(function (doc) {
  if (doc && doc.exists) {
      const myData = doc.data();
      var numb = myData.temp;
      console.log(numb);
      roundedNumb = Math.round(numb * 10) / 10;
      console.log(roundedNumb);
      document.getElementById("n1").innerText = roundedNumb;
  }
});

setInterval(runLog, 1000);


var posts =[];
var newposts = [];
db.collection("Temperature").where("id", "==", "0000062c5cdf")
  .onSnapshot(function(querySnapshot) {
    posts = [];
    querySnapshot.forEach(function(doc) {
      var pTimestamp = parseInt(doc.data().timestamp, 10);
      posts.push({
        x: pTimestamp,
        y: doc.data().temp
      });

    });
    newposts = posts.sort(function(x, y) {
      return x.x - y.x;
    });
  });

function runLog() {
  console.log(newposts);
}

var options = {
  scales: {
    xAxes: [{
      type: 'linear'
    }]
  }
};
var gconfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: newposts,
      label: 'temperature',
      borderColor: '#ff0000',
      fill: false
    }]
  },
  options: options
};



var theChart = new Chart(ctx, {
  type: 'line',
  data: {
      
      datasets: [{
          data: [5, 6, 9, 12],
          label: 'temperature',
          borderColor: '#ff0000',
          fill: false
      }]
  },
  options: {
      scales: {
          xAxes: [{
              type: 'linear'
          }]
      }
  }
});

theChart.update();