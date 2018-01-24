$(document).ready(function(){
	// 1. Link to Firebase
	var config = {
    	apiKey: "AIzaSyCWxuw07Z5X2GxtOLyxEUrVn1NzhwwU7dA",
    	authDomain: "train-tracker-8b300.firebaseapp.com",
    	databaseURL: "https://train-tracker-8b300.firebaseio.com",
    	projectId: "train-tracker-8b300",
    	storageBucket: "train-tracker-8b300.appspot.com",
    	messagingSenderId: "252852842885"
  	};

  firebase.initializeApp(config);

  	var database = firebase.database();

	// 2. Button for adding Trains
	$("#addTrainBtn").on("click", function(){

		// Grabs user input and assign to variables
		var trainName = $("#trainInput").val().trim();
		var lineName = $("#lineInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var timeInput = moment($("#timeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");;
		var frequencyInput = $("#frequencyInput").val().trim();

		// Test for variables entered
		console.log(trainName);
		console.log(lineName);
		console.log(destination);
		console.log(timeInput);
		console.log(frequencyInput);

		// Creates local "temporary" object for holding train data
		// Will push this to firebase
		var newTrain = {
			name:  trainName,
			line: lineName,
			destination: destination,
			trainTime: timeInput,
			frequency: frequencyInput,
		}

		// pushing trainInfo to Firebase
		database.ref().set(newTrain);

		// clear text-boxes
		$("#trainInput").val("");
		$("#lineInput").val("");
		$("#destinationInput").val("");
		$("#timeInput").val("");
		$("#frequencyInput").val("");

		// Prevents page from refreshing
		return false;
	});

	database.ref().on("child_added", function(snapshot){

		console.log(snapshot.val());

		// assign firebase variables to snapshots.
		var firebaseName = snapshot.val().name;
		var firebaseLine = snapshot.val().line;
		var firebaseDestination = snapshot.val().destination;
		var firebaseTime = snapshot.val().trainTime;
		var firebaseFrequency = snapshot.val().frequency;
		
		var diffTime = moment().diff(moment.unix(firebaseTime), "minutes");
		var timeRemainder = moment().diff(moment.unix(firebaseTime), "minutes") % firebaseFrequency ;
		var minutes = firebaseFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
		
		// Test for correct times and info
		console.log(minutes);
		console.log(nextTrainArrival);
		console.log(moment().format("hh:mm A"));
		console.log(nextTrainArrival);
		console.log(moment().format("X"));

		// Append train info to table on page
		$("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseLine + "</td><td>"+ firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

	});
});

