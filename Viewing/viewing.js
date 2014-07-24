function LoadData()
{
	//document.getElementById('name').value = saving.name;
	// document.getElementById('comments').value = saving.details;
	// document.getElementById('start').value = saving.start;
	// document.getElementById('end').value = saving.end;
	// document.getElementById('comments').value = saving.details;
	// document.getElementById('pac-input').value = saving.place;
	$('#title').append(<p>saving.name</p>);
}

$(document).ready(function(){
});

Omlet.ready(function(){
	var omletPackage = Omlet.getPasteboard();

	if( omletPackage )
		{
			saving = omletPackage.json;
			LoadData();
		}
		else
		{
		}
});