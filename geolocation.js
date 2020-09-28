var lat1; //Own Latitdue
var lat2; //Latidude - Variable for calc distance
var lon1; //Own Logitude
var lon2; //Longitude - Variable for calc distance
var question = document.getElementById("question");
var answer1 = document.getElementById("answer1");
var answer2 = document.getElementById("answer2");
var answer3 = document.getElementById("answer3");
var story = document.getElementById("story");
var debug = document.getElementById("debug");
var gltfModel = document.getElementById("gltfModel");
var buttons = document.getElementsByClassName("buttons");
var distStart; // Calc distance own pos - starting point
var pts = 0; // Player Pts
var introVisible = true; // Bool for checking if Intro was seen
var distToGoal;
var serverData = [];
var locationData =[];

fetch('http://127.0.0.1:3005/locations')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

       // Examine the text in the response
       response.json().then(function(data) {
        locationData = data;
        console.log(locationData);


      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });




//Data for goal
//Set Coords to Starting Point
//If no Game Over is neccessary, please uncomment getPts() and goal() and this data plus edit contitions of hide story
var goalData = [{
   
    "name": "End",
    "goalie": "1",
    "pts": "0",
    "lat": "49.413912",
    "lon": "8.651406",
    "location": "Goal",
    "distance": "0",
    "txt1": "ENDE",
    "txt2": "ENDE ",
    "txt3": "ENDE",
    "txt4": "ENDE"
  }
];

// Stores geolocation of starting point
const latStart = data[0].lat;
const lonStart = data[0].lon;
//Number of POIs
const dataLength = Number(data.length);
//Distance to StartingPoint in Meters for showing Intro at Start
const maxDistStart =  30; //e.g. 10 Meters -> In radius of 10 Meters aroung Starting Point show Intro

window.onload = () => {

  setInterval(getLocation, 1000);
  setInterval(distToArr, 1000);
  setInterval(hideStory, 1000);
  setInterval(getPts, 1000);
  
};


// Call getDistance for elements in data && sort data by distance
function distToArr() {
  for (var i in data) {
    var dist = getDistance(lat1, lon1, data[i].lat, data[i].lon);
    data[i].distance = dist;
      distStart = Number(data[0].distance);
  }
  data.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
var story = document.getElementById("story");
};

//get geolocation of User
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //Error => Msg - > do this later
  }
}

//Debug - Show actual geolocation of User 
function showPosition(position) {
  lat1 = position.coords.latitude;
  lon1 = position.coords.longitude;
}

//Calc distance between user and POI
function getDistance(lat1, lon1, lat2, lon2) {
  var R = 6378.137;
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  var result = d * 1000;

  return result;
}

//Set insert active StoryString
//Inserts active txt strings
function insertStory() {
  // TODO: loop
  
  // console.log("insertStory");
  question.setAttribute('text', 'value', data[0].question);
  answer1.setAttribute('text', 'value', data[0].answer1);
  answer2.setAttribute('text', 'value', data[0].answer2);
  answer3.setAttribute('text', 'value', data[0].answer3);

}

//Hide Intro txt if next POI is farther than x meters
//Shows and Hides Elements
function hideStory() {
  if (pts <= dataLength ) {
    if (distStart > maxDistStart && pts === 0) { // TODO: for loop with array
      
      console.log("Einleitung");
      story.setAttribute('visible', true);
      gltfModel.setAttribute('visible', false);
      question.setAttribute('visible', false);
      answer1.setAttribute('visible', false);
      answer2.setAttribute('visible', false);
      answer3.setAttribute('visible', false);
      introVisible = true;
      for(var i = 0; i < buttons.length; i++){
        buttons[i].setAttribute('visible', false);
       
    }
    } else {
      introVisible = false;
      story.setAttribute('visible', false);
      gltfModel.setAttribute('visible', true);
      question.setAttribute('visible', true);
      answer1.setAttribute('visible', true);
      answer2.setAttribute('visible', true);
      answer3.setAttribute('visible', true);
      for(var i = 0; i < buttons.length; i++){
        buttons[i].setAttribute('visible', true);
       
    }
      insertStory();
    }
  } else {
    goal();
  }
}

//Get Pts for finding the points once
function getPts() {
  var dataPts = Number(data[0].pts);
  
  
  if(markerFound === true && introVisible === false){
    console.log(markerFound);
    console.log("dataPts: " + dataPts);
    if (dataPts != 0) {
     data[0].pts = "0";
      pts++;
      console.log("pts++");
    }
    distToGoal = getDistance(lat1, lon1, goalData[0].lat, goalData[0].lon);
    console.log("Distance To Goal"+ distToGoal);
    if ( distToGoal < maxDistStart)
    {
      console.log("Am Ziel angekommen!")
      pts++;
    }
  }
}

//show ending screen if all points captured
function goal() {
  console.log("Ziel");
    story.setAttribute('visible', false);
    question.setAttribute('visible', true);
    answer1.setAttribute('visible', true);
    answer2.setAttribute('visible', true);
    answer3.setAttribute('visible', true);
    for(var i = 0; i < buttons.length; i++){
      buttons[i].setAttribute('visible', false);       
    }
     
    question.setAttribute('text', 'value', goalData[0].txt1);
    answer1.setAttribute('text', 'value', goalData[0].txt2);
    answer2.setAttribute('text', 'value', goalData[0].txt3);
    answer3.setAttribute('text', 'value', goalData[0].txt4);
}


