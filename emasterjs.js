//////////////////////////////
///// Google Places    ///////
//////////////////////////////
function initialize() {

  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));

  var types = document.getElementById('type-selector');

  var autocomplete = new google.maps.places.Autocomplete(input);

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

  });
}

function LoadData()
{
	document.getElementById('name').value = saving.name;
	document.getElementById('comments').value = saving.details;
	document.getElementById('start').value = saving.start;
	document.getElementById('end').value = saving.end;
	document.getElementById('comments').value = saving.details;
	document.getElementById('pac-input').value = saving.place;
}
//Get the stupid time
function timeywimey()
{
var date = new Date($('#start').val());
console.log(date);
}

//Sharing RDL Function
function setUpShare() 
{
	$("#share").click(function(){
		ShareGame();
	});
}

function setTime( msgTxt )
{
	var msgDiv = document.getElementById('dating');
	msgDiv.innerHTML = msgTxt;
}

function updateTime()
{
	
	$('#returntime').click(function(){
		var date = new Date($('#start').val());
		var newdate;
		newdate = date.toDateString();
		console.log(date);
		$('#asdf').after(newdate);
	});
}

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

//Global Variables

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
	updateTime();
});
