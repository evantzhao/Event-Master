//////////////////////////////
///// Google Places    ///////
//////////////////////////////

function initialize() {

    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input, options);
 }

//Load Data from shared RDL
function LoadData()
{
	document.getElementById('name').value = saving.name;
	document.getElementById('comments').value = saving.details;
	document.getElementById('start').value = saving.start;
	document.getElementById('end').value = saving.end;
	document.getElementById('comments').value = saving.details;
	document.getElementById('pac-input').value = saving.place;
}

//Sharing RDL Function
function setUpShare() 
{
	$("#share").click(function(){
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

		refreshtime("Start: " + nday + ", " + smonth + "/" + sdate + " @ " + nhour + ":" + pmin + " " + pm);
		timebreak("End: " + pday + ", " + emonth + "/" + edate + " @ " + phour + ":" + nmin + ' ' + am );
	}
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


//Sharing the game function. Saving data. 
function ShareGame(event)
{
	var saving = {
		name: $('#name').val(),
		details: $('#comments').val(),
		start: $('#start').val(),
		end: $('#end').val(),
		place: $('#pac-input').val(),
	}
	
	if(Omlet.isInstalled() )
	{
		var rdl = Omlet.createRDL({
				   noun: "event",
				   displayTitle: saving.name + " | EventMaster",
				   displayThumbnailUrl: "https://mobi-summer-evan.s3.amazonaws.com/Picture%20and%20Themes/Omlet%20Event%20Master.png",
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

Omlet.ready(function() {
	var omletPackage = Omlet.getPasteboard();

	if( omletPackage )
		{
			saving = omletPackage.json;
			LoadData();
		}
		else
		{
		}
} );

$(document).ready(function(){
	google.maps.event.addDomListener(window, 'load', initialize);
	setUpShare();
	// window.location.hash = '#landing';
	// $.mobile.initializePage();
});