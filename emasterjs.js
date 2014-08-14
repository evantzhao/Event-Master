function mapsRedirect() {
	window.location.replace("comgooglemaps://?" + "&daddr=" + fieldScript[8] +"," + fieldScript[9] + "&directionsmode=driving");
}

function admin(){
	$('#editIT').click(function(){
		$('#pac-input').val(fieldScript[2]);
		$('#comments').val(fieldScript[1]);
		$('#name').val(fieldScript[0]);
		$('#start').val(fieldScript[6]);
		$('#end').val(fieldScript[7]);
	});
}

var wallPosts = [0];
var wallPostsID = [0];

//Status Update Box
function status() {
  $('#posting').click(function() {
    $('.posts').prepend("<h3 class='ui-bar ui-bar-a ui-corner-all' id = 'identity'></h3><div class='ui-body ui-body-a ui-corner-all' id='content'></div>");

    var post = $('#statusBox').val();
    $('#content').append("<p>" + post + "</p>");
    $('#identity').append(viewerUser['name']);
    $('.status-box').val('');
    $('#posting').addClass('ui-state-disabled'); 

    // Save the variables to the array. 
	wallPosts[wallPosts.length] = post;
	wallPostsID[wallPostsID.length] = viewerUser['name'];

    // Update Arrays Accordingly through the Shared Document. 
    var wallUpdateText = JSON.stringify(wallPosts);
	var wallPostsIDText = JSON.stringify(wallPostsID);
    documentApi.update( myDocId, wallUpdate, { 'wallPosts' : wallUpdateText } , ReceiveUpdate, DidNotReceiveUpdate);
	documentApi.update( myDocId, wallID, { 'wallPostsID' : wallPostsIDText } , ReceiveUpdate, DidNotReceiveUpdate);
  });
  
   $('.status-box').keyup(function() {
    var charactersLeft = ($('.status-box').val()).length;
    if(charactersLeft < 0) {
      $('#posting').addClass('ui-state-disabled'); 
    }
    else {
      $('#posting').removeClass('ui-state-disabled');
    }
   });

  $('#posting').addClass('ui-state-disabled');
}

function loadwall(){
	$('.posts').empty();

	for(var i = 1; i < wallPosts.length; i++ ) {
		$('.posts').prepend("<h3 class='ui-bar ui-bar-a ui-corner-all' id = 'identity'></h3><div class='ui-body ui-body-a ui-corner-all' id='content'></div><br>");

		$('#content').append('<p>' + wallPosts[i] + '</p>');
    	$('#identity').append(wallPostsID[i]);
	}
}

//Picture Selector
var picturevar = [0];

function setBeach(){
	picturevar[0] = "Beach";
	displayed(picturevar[0]);
}

function setSports(){
	picturevar[0] = "Sports";
	displayed(picturevar[0]);
	// document.getElementById("headerimage").value = frisbee;

}

function setFood() {
	picturevar[0] = "Food";
	displayed(picturevar);
}

function setPic(){
	if(picturevar[0] == "Beach"){
		$('#headerimage').prepend('<img width=100% height= 150px alt="Header" src="https://mobi-summer-evan.s3.amazonaws.com/Picture%20and%20Themes/Z.jpg"/>');
	}
	else if(picturevar[0] == "Sports"){
		$('#headerimage').prepend('<img width=100% height= 150px alt="Header" src="https://mobi-summer-evan.s3.amazonaws.com/Picture%20and%20Themes/Frisbee.jpg"/>');
	}
	else if(picturevar[0] == "Food"){
		$('#headerimage').prepend('<img width=100% height= 150px alt="Header" src="https://mobi-summer-evan.s3.amazonaws.com/Picture%20and%20Themes/Food.jpg"/>');
	}
}

//Global Variables for Keeping track of the guest list.
var go = [0,1];
var maybe = [0];
var no = ["aoh0wjg0ewj"]; 

//Shared Document API

function Initializing(old, params) {
	return params;
}

function fieldUpdate(old, params) {
	old.fieldScript = params["fieldScript"];
	return old;
	console.log("updating fieldScript");
}

function wallUpdate(old, params) {
	old.wallPosts = params["wallPosts"];
	return old;
	console.log("updating");
}

function wallID(old, params){
	old.wallPostsID = params["wallPostsID"];
	return old;
	console.log("updating");
}

function Updatego(old, params) {
	old.go = params["go"];
	return old;
	console.log("Updating!");
}

function Updatemaybe(old, params) {
	old.maybe =params["maybe"];
	return old;
	console.log("updating!");
}

function Updateno(old, params){
	old.no = params["no"];
	return old;
	console.log("updating");
}

function InitialDocument() {
	var initValues = {
		"go" : "",
		"maybe" : "",
		"no" : "",
		"wallPosts" : "",
		"wallPostsID" : "",
		"fieldScript" : "",
	};
	return initValues;
}

function DocumentCreated(doc) {
  	console.log("Document has been created.");
}

function ReceiveUpdate(doc) {
	myDoc = doc;

	for( key in myDoc)
	{
		console.log(key);
	};

	fieldScript = JSON.parse(myDoc["fieldScript"]);
	LoadData();
	mapsGeocode();
	go = JSON.parse(myDoc["go"]);
	maybe = JSON.parse(myDoc["maybe"]);
	no = JSON.parse(myDoc["no"]);
	wallPosts = JSON.parse(myDoc["wallPosts"]);
	wallPostsID = JSON.parse(myDoc["wallPostsID"]);

	loadwall();

	$('#list_devices').children("ol").remove();
	$('#maybego').children("ol").remove();
	$('#nogo').children("ol").remove();

	addEntry();
	addMaybe();
	addNo();

	refreshData();
	console.log("I received an update!");
}

function DidNotReceiveUpdate(doc) {
	console.log("I did not receive an update");
}

//////////////////////////////
///// Framework Code   ///////
//////////////////////////////

var documentApi;
var myDoc;
var myDocId = null;

function watchDocument(docref, OnUpdate) {
documentApi.watch(docref, function(updatedDocRef) {
	if (docref != myDocId) {
		console.log("Wrong document!!");
	} else {
	documentApi.get(docref, OnUpdate);
    	}
    }, function(result) {
    	var timestamp = result.Expires;
    	var expires = timestamp - new Date().getTime();
    	var timeout = 0.8 * expires;
    	setTimeout(function() {
    		watchDocument(docref, OnUpdate);
    	}, timeout);
    }, Error);
}

function initDocument() {
	if (Omlet.isInstalled()) {
	    documentApi = Omlet.document;
	    _loadDocument();
	}
}

function hasDocument() {
	if( myDocId === null )
	{
		return false;
	}
	else
	{
		return true;
	}
}

function _loadDocument() {
  	if (hasDocument()) {
  		console.log("...Loading Document");
    	documentApi.get(myDocId, ReceiveUpdate);
    	watchDocument(myDocId, ReceiveUpdate);
    } else {
    	console.log("...Creating Document");
    	documentApi.create(function(d) {
      	myDocId = d.Document;
      	documentApi.update(myDocId, Initializing, InitialDocument(), 
      		function() {
      			documentApi.get(myDocId, DocumentCreated);
      		}, function(e) {
      			alert("error: " + JSON.stringify(e));
      		});
      	watchDocument(myDocId, ReceiveUpdate);
      }, function(e) {
      	alert("error: " + JSON.stringify(e));
      });
    }
}

//Global Variables for Google Maps
var map;

//////////////////////////////
///// Google Places    ///////
//////////////////////////////

function mapsGeocode(){

		    url = GMaps.staticMapURL({
			  size: [$(window).width()-190, $(window).width()-180],
			  lat: fieldScript[8],
			  lng: fieldScript[9],
			  zoom: 13,
			  markers: [
			  	{lat: fieldScript[8], lng: fieldScript[9]}
			  ]
			});

			$('<img/>').attr('src', url).appendTo('#mappy');

}

function initialize() {
	 var input = document.getElementById('pac-input');
	 var autocomplete = new google.maps.places.Autocomplete(input);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		 var place = autocomplete.getPlace();

		 fieldScript[8] = place.geometry.location.lat();
		 fieldScript[9] = place.geometry.location.lng(); 
		});
}

//Load Data from shared RDL
function LoadData()
{
	details(fieldScript[1]);
	nama(fieldScript[0]);
	host("Hosted by: " + fieldScript[5]);
	rizi(fieldScript[3]);
	wanle(fieldScript[4]);
	dizi(fieldScript[2]);
	Attending(go.length-2);
	atext("Attending");
	Maybe(maybe.length -1);
	mtext("Maybe");
	Noped(no.length-1);
	ntext("Declined");
}

function handleClick(){
	var goText = JSON.stringify(go);
	var maybeText = JSON.stringify(maybe);
	var noText = JSON.stringify(no);

	documentApi.update( myDocId, Updatego, { 'go' : goText } , ReceiveUpdate, DidNotReceiveUpdate);
	documentApi.update( myDocId, Updatemaybe, { 'maybe' : maybeText } , ReceiveUpdate, DidNotReceiveUpdate);
	documentApi.update( myDocId, Updateno, { 'no' : noText } , ReceiveUpdate, DidNotReceiveUpdate);

	// Update Arrays Accordingly through the Shared Document. 
    var wallUpdateText = JSON.stringify(wallPosts);
	var wallPostsIDText = JSON.stringify(wallPostsID);

    documentApi.update( myDocId, wallUpdate, { 'wallPosts' : wallUpdateText } , ReceiveUpdate, DidNotReceiveUpdate);
	documentApi.update( myDocId, wallID, { 'wallPostsID' : wallPostsIDText } , ReceiveUpdate, DidNotReceiveUpdate);
};


//Sharing RDL Function
function setUpShare() 
{
	$("#share").click(function() {
		fieldScript[0] = $('#name').val();
		fieldScript[1] = $('#comments').val();
		fieldScript[2] = $('#pac-input').val();
		fieldScript[3] = $('#refreshtime').text();
		fieldScript[4] = $('#timebreak').text();
		fieldScript[5] = userID["name"];

		var fieldText = JSON.stringify(fieldScript);
		documentApi.update( myDocId, fieldUpdate, { 'fieldScript' : fieldText } , ReceiveUpdate, DidNotReceiveUpdate );

		ShareGame();
	});

}

function refreshtime( msgTxt )
{
	var msgDiv = document.getElementById('refreshtime');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('refreshtime').style.fontWeight = "200";
}

function timebreak( msgTxt )
{
	var msgDiv = document.getElementById('timebreak');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('timebreak').style.fontWeight = "200";
}

//Update time function
function datefunc() {
    var start = new Date (document.getElementById("start").value);
    var end = new Date(document.getElementById("end").value);

    fieldScript[6] = (document.getElementById("start").value).substring(0,22);
    fieldScript[7] = (document.getElementById("end").value).substring(0,22);

	if (start == "" && end == ""){
		return;
	} else {

		//Converting the ISO 8601 to Human Readable Text. This gathers each of the time dates' elements, and then sets innerHTML equal to those elements.
		var smonth = start.getMonth();
		var sdate = start.getDate();
		var shour = start.getUTCHours();
		var smin = start.getMinutes();
		var sday = start.getDay();
		var nday;
		var pm;

		//End date. Same process as above
		var emonth = end.getMonth();
		var edate = end.getDate();
		var ehour = end.getUTCHours();
		var emin = end.getMinutes();
		var eday = end.getDay();
		var eday;
		var am;

		//Converting a 24 hour time to 12 hour time. For the starting time only, so expect to see a duplicate.
		if(shour > 12)
		{
			var nhour;
			nhour = (shour-12);
			pm = "pm";
		}
		else
		{
			nhour = shour;
			pm = "am";
		}

		//Preventing the minutes time from dropping the zero in front. 

		if(emin < 10)
		{
			var nmin;
			nmin = ("0" + emin);
		}
		else
		{
			nmin = emin;
		}

		//Preventing the minutes time from dropping the zero in front. 

		if(smin < 10)
		{
			var pmin;
			pmin = ("0" + smin);
		}
		else
		{
			pmin = smin;
		}

		//Converting a 24 hour time to 12 hour time. For the ending time only. 
		if(ehour > 12)
		{
			var phour;
			phour = (ehour-12);
			am = "pm";
		}
		else
		{
			phour = shour;
			am = "am";
		}

		//Converting the integer return to a day( in text). For starting times only.
		if(sday == 1)
		{
			nday = "Monday";
		}
		if(sday == 2)
		{
			nday = "Tuesday";
		}
		if(sday == 3)
		{
			nday = "Wednesday";
		}
		if(sday == 4)
		{
			nday = "Thursday";
		}
		if(sday == 5)
		{
			nday = "Friday";
		}
		if(sday == 6)
		{
			nday ="Saturday";
		}
		if(sday == 0)
		{
			nday = "Sunday";
		}
		else
		{
			sday = nday;
		}

		//Converting the integers into days. For ending times only. 
		if(eday == 1)
		{
			pday = "Monday";
		}
		if(eday == 2)
		{
			pday = "Tuesday";
		}
		if(eday == 3)
		{
			pday = "Wednesday";
		}
		if(eday == 4)
		{
			pday = "Thursday";
		}
		if(eday == 5)
		{
			pday = "Friday";
		}
		if(eday == 6)
		{
			pday ="Saturday";
		}
		if(eday == 0)
		{
			pday = "Sunday";
		}
		else
		{
			eday = pday;
		}

		refreshtime("Start: " + nday + ", " + smonth + "/" + sdate + " at " + nhour + ":" + pmin + " " + pm);
		timebreak("End: " + pday + ", " + emonth + "/" + edate + " at " + phour + ":" + nmin + ' ' + am );
	}
}

function coming()
{
	for(var e = maybe.length - 1; e >= 0; e--) {
	 	if(viewerUser["name"] == maybe[e])
	 	{
    		if(maybe[e] == viewerUser["name"]) {
        	maybe.splice(e, 1);
     		}	
	 	}
	 }

	for(var p = no.length - 1; p >= 0; p--) {
	 	if(viewerUser["name"] == no[p])
 		{
    		if(no[p] == viewerUser["name"]){
        	no.splice(p, 1);
     		}		
	 	}
	 }

	 if(go.indexOf(viewerUser["name"]) == -1)
	 	{
	 		go[go.length] = viewerUser["name"];
	 	}
}

function perhaps()
{
	for(var e = go.length - 1; e >= 0; e--) {
		if(viewerUser["name"] == go[e])
		{
   				if(go[e] == viewerUser["name"]) {
       			go.splice(e, 1);
    			}
		}
	}

	for(var p = no.length - 1; p >= 0; p--) {
		if(viewerUser["name"] == no[p])
		{
   				if(no[p] == viewerUser["name"]) {
       			no.splice(p, 1);
    			}
		}
	}

	if(maybe.indexOf(viewerUser["name"]) == -1)
	{
		maybe[maybe.length] = viewerUser["name"];
	}

}

function nope()
{
	for(var e = maybe.length - 1; e >= 0; e--) {
		if(viewerUser["name"] == maybe[e])
		{
   			if(maybe[e] == viewerUser["name"]) {
       		maybe.splice(e, 1);
    		}
		}
	}

	for(var p = go.length - 1; p >= 0; p--) {
		if(viewerUser["name"] == go[p])
		{
   			if(go[p] == viewerUser["name"]) {
       		go.splice(p, 1);
    		}
		}
	}


	if(no.indexOf(viewerUser["name"]) == -1){
		no[no.length]= viewerUser["name"];
	}

}

function addEntry()
{
    var items = document.getElementById("list_devices");

    for (var i = 2; i < go.length; i++ ) {
        var item = document.createElement("ol");
        item.innerHTML = go[i];
        items.appendChild(item);
    }
}

function addMaybe()
{
    var items = document.getElementById("maybego");

    for (var i = 1; i < maybe.length; i++ ) {
        var item = document.createElement("ol");
        item.innerHTML = maybe[i];
        items.appendChild(item);
    }
}

function addNo()
{
    var items = document.getElementById("nogo");

    for (var i = 1; i < no.length; i++ ) {
        var item = document.createElement("ol");
        item.innerHTML = no[i];
        items.appendChild(item);
    }
}

//Displayed Picture
function displayed( msgTxt )
{
	var msgDiv = document.getElementById('displayed');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('displayed').style.fontWeight = "200";
}

//Guest List: attending
function gopanel( msgTxt )
{
	var msgDiv = document.getElementById('list_devices');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('list_devices').style.fontWeight = "200";
}
//Location logging. 
function lokitime( msgTxt )
{
	var msgDiv = document.getElementById('lokiplace');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('lokiplace').style.fontWeight = "200";
}

function lokifunc()
{
	var loki = document.getElementById('pac-input').value; 
	if(loki.length > 10) 
	{
		loki = loki.substring(0,30);
	}
	lokitime(loki + "...");
}

//Loading the Details.  
function details( msgTxt )
{
	var msgDiv = document.getElementById('Testing');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('Testing').style.fontWeight = "200";
}

//Loading the name
function nama( msgTxt )
{
	var msgDiv = document.getElementById('nama');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('nama').style.fontWeight = "200";
}

//Loading the Date
function rizi( msgTxt )
{
	var msgDiv = document.getElementById('rizi');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('rizi').style.fontWeight = "200";
}

//Loading the End Date
function wanle( msgTxt )
{
	var msgDiv = document.getElementById('wanle');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('wanle').style.fontWeight = "200";
}

//Loading the Location
function dizi( msgTxt )
{
	var msgDiv = document.getElementById('dizi');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('dizi').style.fontWeight = "200";
}

//Loading the Host Name
function host( msgTxt )
{
	var msgDiv = document.getElementById('host');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('host').style.fontWeight = "200";
}

//Loading the Number of people attending the event
function Attending( msgTxt )
{
	var msgDiv = document.getElementById('Attending');
	msgDiv.innerHTML = msgTxt;
	msgDiv.style.fontSize = "25px";
}

//Loading the name displaying "attending"
function atext( msgTxt )
{
	var msgDiv = document.getElementById('atext');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('atext').style.fontWeight = "200";
}

//Loading the Number of people attending the event
function Maybe( msgTxt )
{
	var msgDiv = document.getElementById('Maybe');
	msgDiv.innerHTML = msgTxt;
	msgDiv.style.fontSize = "25px";
}

//Loading the name displaying "attending"
function mtext( msgTxt )
{
	var msgDiv = document.getElementById('mtext');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('mtext').style.fontWeight = "200";
}

//Loading the Number of people attending the event
function Noped( msgTxt )
{
	var msgDiv = document.getElementById('Noped');
	msgDiv.innerHTML = msgTxt;
	msgDiv.style.fontSize = "25px";
}

//Loading the name displaying "attending"
function ntext( msgTxt )
{
	var msgDiv = document.getElementById('ntext');
	msgDiv.innerHTML = msgTxt;
	document.getElementById('ntext').style.fontWeight = "200";
}

function refreshData() {
	Attending(go.length-2);
	Maybe(maybe.length -1);
	Noped(no.length-1);
}

var fieldScript = [];

//Sharing the game function. Saving data. 
function ShareGame(event)
{
	var saving = {
		sharedDocID: myDocId,
		picturevar : picturevar[0],
		host: userID["name"],
	};

	if(Omlet.isInstalled() )
	{
		var rdl = Omlet.createRDL({
				   noun: "event",
				   displayTitle: fieldScript[0] + " | EventMaster",
				   displayThumbnailUrl: "https://mobi-summer-evan.s3.amazonaws.com/Picture%20and%20Themes/Balloon.jpg",
				   displayText: "You have been invited to an event! Attend?", 
				   json: saving,
				   webCallback: "https://mobi-summer-evan.s3.amazonaws.com/Event%20Master/emasterlay.html",
				   callback: window.location.href,
			   });
		Omlet.exit(rdl);
	}
	else
	{
	}
}

var userID=[];
var viewerUser =[];

Omlet.ready(function() {

	var omletPackage = Omlet.getPasteboard();

	if(omletPackage)
		{	
			saving = omletPackage.json;
			myDocId = saving["sharedDocID"];
			initDocument();
			picturevar[0] = saving["picturevar"];
			setPic();
			viewerUser = Omlet.getIdentity();
			status(); 
			// if(saving["host"] == viewerUser["name"]){
			// 	$('#admin').prepend("<div class='ui-bar ui-bar-a'><h3>Admin Corner</h3></div><div class='ui-body ui-body-a'><p>Only you can see this. Click the below button to edit any section of the event itinerary.</p><div class = 'buttonForAdmin'><a href= '#pageone' id = 'editIT' class='ui-btn'>Edit</a></div></div>");
			// }
			admin();
			window.location.replace("#viewerdelight");
		}
		else
		{
			userID = Omlet.getIdentity();
			initDocument();
			setUpShare();
		}
});

$(document).ready(function(){
	google.maps.event.addDomListener(window, 'load', initialize);
});