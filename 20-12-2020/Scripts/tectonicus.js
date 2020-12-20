var maxZoom = 8;

var MAP_COORD_SCALE_FACTOR = 256.0;

var showSpawn = true;			
var signsInitiallyVisible = true;
var playersInitiallyVisible = true;
var portalsInitiallyVisible = true;
var bedsInitiallyVisible = true;
var spawnInitiallyVisible = true;
var viewsInitiallyVisible = true; // todo!



function createPlayerMarker(map, player, pos, signWindow)
{
	var marker = new google.maps.Marker(
			{		
	      		position: pos,
				map: map, 
				title: player.name,
				icon: player.icon,
				optimized: false
			});
			marker.player = player;
			
			google.maps.event.addListener(marker, 'click', function()
			{
				if (player.donation == '')
				{
					jQuery.getJSON("http://www.triangularpixels.com/Tectonicus/Query/getDonation.py?json_callback=?",
					{
						username: player.name
					},
					function(data)
					{
						player.donation = data.html
						
						document.getElementById("donationDiv").innerHTML = getDonationHtml(player)
					});
				}
				
				showPlayerHtml(map, this.player, signWindow, this);
			});
			
	return marker;
}

function showPlayerHtml(map, player, signWindow, anchor)
{
	var options =
	{
		content: getPlayerHtml(player)
	};
	signWindow.close();
	signWindow.setOptions(options);
	signWindow.open(map, anchor);
}

function getPlayerHtml(player)
{
	var html = ''
		+ '<div>'
						
			+ '<div class=\"playerName\" style=\"text-align:center; font-size:110%\" >' + player.name + '</div>'
			+ '<div style=\"width:300px; margin:4px;\" >'
			+ 	'<img style=\"float:left; margin:4px;\" src=\"' + player.icon + '\" width=\"32\" height=\"64\" />'
			+	'<div>'
			+		'<div>' + getHealthHtml(player) + '</div>'
			+		'<div>' + getFoodHtml(player) + '</div>'
			+		'<div>' + getAirHtml(player) + '</div>'
			+		'<div>' + getInventoryHtml(player) + '</div>'
			+		'<div>' + getItemsHtml(player) + '</div>'
			+	'</div>'
			+ '</div>'
			
			+ '<div id=\"xpDiv\" style=\"clear:both; text-align:center\" >'
			+   'Experience level '+player.xpLevel
			+ '</div>'
			
			+ '<div id=\"donationDiv\" style=\"clear:both; text-align:center\" >'
			+	getDonationHtml(player)
			+ '</div>'
			
		+ '</div>';
		
	return html;
}

function getHealthHtml(player)
{
	var html = '';
	
	var NUM_ICONS = 10;
	for (var i=0; i<NUM_ICONS; i++)
	{
		var image;
		if (i*2+1 < player.health)
			image = 'Images/FullHeart.png';
		else if (i*2 < player.health)
			image = 'Images/HalfHeart.png';
		else
			image = 'Images/EmptyHeart.png';
			
		html += '<img style=\"margin:1px\" src=\"' + image + '" width=\"18\" height=\"18\" />';
	}
	
	return html;
}

function getFoodHtml(player)
{
	var html = '';
	
	var NUM_ICONS = 10;
	for (var i=0; i<NUM_ICONS; i++)
	{
		var image;
		if (i*2+1 < player.food)
			image = 'Images/FullFood.png';
		else if (i*2 < player.food)
			image = 'Images/HalfFood.png';
		else
			image = 'Images/EmptyFood.png';
			
		html += '<img style=\"margin:1px\" src=\"' + image + '" width=\"18\" height=\"18\" />';
	}
	
	return html;
}

function getAirHtml(player)
{
	var html = '';
	
	var NUM_ICONS = 10;
	for (var i=0; i<NUM_ICONS; i++)
	{
		var image;
		if (i*30 < player.air)
			image = 'Images/FullAir.png';
		else
			image = 'Images/EmptyAir.png';
			
		html += '<img style=\"margin:1px\" src=\"' + image + '" width=\"18\" height=\"18\" />';
	}
	
	return html;
}

function getInventoryHtml(player)
{
	var html = '';
/*	
	html += '<table>'
	
	html += '<tr>'
	
	for (var x=0; x<9; x++)
	{
		html += '<td>'
		html += 'item'
		html += '</td>'
	}
	
	html += '</tr>'
	
	html += '</table>'
*/	
	return html;
}

function getItemsHtml(player)
{
	var html = '';
	
	// ..
	
	return html;
}

function getDonationHtml(player)
{
	var html = '';
	
	html += '<div>';

	if (player.donation != '')
	{
		html += player.donation;
	}
	else
	{
		html += '<img src=\"Images/Spacer.png\" style=\"height:38px;\" />';
	}
	
	html += '</div>';

	return html;
}

function getUrlWithoutParams()
{
	parts = window.location.href.split('?');
	return parts[0];
}

function getQueryParams()
{
	var urlParams = {};
	var e,
	a = /\+/g,  // Regex for replacing addition symbol with a space
	r = /([^&;=]+)=?([^&;]*)/g,
	d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
	q = window.location.search.substring(1);
	
	while (e = r.exec(q))
		urlParams[d(e[1])] = d(e[2]);
	
	return urlParams;
}

function getFragmentParams()
{	
	var hashParams = {};
	var e,
	a = /\+/g,  // Regex for replacing addition symbol with a space
	r = /([^&;=]+)=?([^&;]*)/g,
	d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
	q = window.location.hash.substring(1);
	
	while (e = r.exec(q))
		hashParams[d(e[1])] = d(e[2]);
	
	return hashParams;
}

function runGa()
{
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-4472611-2']);
	_gaq.push(['_setDomainName', 'tectonicus.triangularpixels.com']);
	_gaq.push(['_trackPageview']);

	var selfUrl = window.location.href;
	_gaq.push(['_trackEvent', 'ViewMap', selfUrl]);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
}

// The link back to the tectonicus home page
function CreateHomeControl(map)
{
	return CreateImageLink(map, 'Tectonicus home page', 'http://triangularpixels.net/games/tectonicus/', 'Images/Logo.png');
}

function CreateCustomLogoControl(map)
{
	return CreateImageLink(map, 'Custom linkage here!', 'http://www.google.com', 'Images/CustomLogo.png');
}

function CreateImageLink(map, title, destUrl, imageUrl)
{
	// Create the DIV to hold the control
	var controlDiv = document.createElement('DIV');
	controlDiv.index = 1;
	
	// Pad by a few pixels to offset from the edges of the map
	controlDiv.style.padding = '5px';
	
	// Set CSS for the control border
	var controlUI = document.createElement('DIV');
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.title = title;
	controlDiv.appendChild(controlUI);

	var logoImage = document.createElement('IMG');
	logoImage.src = imageUrl;
	controlUI.appendChild(logoImage);
	
	// Link to the forum topic on click
	google.maps.event.addDomListener(controlUI, 'click', function()
	{
		window.location = destUrl;
	});
	
	return controlDiv;
}


function CompassControl(controlDiv, imageElement)
{
	this.controlDiv = controlDiv;
	this.imageElement = imageElement;
}
CompassControl.prototype.setCompassImage = function(imageUrl)
{
	this.imageElement.src = imageUrl
}
CompassControl.prototype.getDiv = function()
{
	return this.controlDiv;
}

function CreateCompassControl(map, initialImage)
{
	// Create the DIV to hold the control
	var controlDiv = document.createElement('DIV');
	controlDiv.index = 1;
	
	// Pad by a few pixels to offset from the edges of the map
	controlDiv.style.padding = '0px';
	
	// Set CSS for the control border
	var controlUI = document.createElement('DIV');
	controlDiv.appendChild(controlUI);

	var logoImage = document.createElement('IMG');
	logoImage.src = initialImage;
	controlUI.appendChild(logoImage);
					
	return new CompassControl(controlDiv, logoImage);
}


// Helper function to create the actual toggle box
function CreateToggleControl(text, image, startChecked)
{
	var controlDiv = document.createElement('DIV');
	controlDiv.index = 1;
	
	// Pad by a few pixels to offset from the edges of the map
//	controlDiv.style.paddingBottom = '5px';
	controlDiv.style.padding = '2px';
	controlDiv.style.height = '55px';
	controlDiv.style.width = '55px';
	
	// Set CSS for the control border
	var controlUI = document.createElement('DIV');
/*	
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '2px';
	controlUI.style.borderColor = '#666699';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.style.padding = '2px';
*/
	controlUI.className += " button";
	controlUI.className += " shadow";
	
	controlDiv.appendChild(controlUI);
	controlDiv.controlUI = controlUI;
	
	var imageElement = document.createElement('IMG');
	imageElement.src = image;
	
	controlUI.appendChild(imageElement);
	
	var textDiv = document.createElement('DIV');
	textDiv.innerHTML = text;
	
	controlDiv.checked = startChecked;
	
	SetToggleBg(controlDiv);
	
	return controlDiv;
}

function SetToggleBg(control)
{
	if (control.checked)
		control.controlUI.style.backgroundColor = '#CCCCFF';
	else
		control.controlUI.style.backgroundColor = '#EEEEEE';
}

// Creates a toggle box to turn on and off a set of markers
function CreateMarkerToggle(map, text, image, markers, startEnabled)
{
	var control = CreateToggleControl(text, image, startEnabled);
	
	google.maps.event.addDomListener(control, 'click', function()
	{
		this.checked = !this.checked;
		
		SetToggleBg(this);
		
		for (i in markers)
		{
			var marker = markers[i];
			
			if (!this.checked)
				marker.setMap(null);
			else
				marker.setMap(map);
		}
	});
	
	return control;
}


// The little box that you click to get an url to the current view
function CreateLinkControl(map)
{
	/*
	// Create the DIV to hold the control
	var controlDiv = document.createElement('DIV');
	controlDiv.index = 1;
	
	// Pad by a few pixels to offset from the edges of the map
	controlDiv.style.padding = '5px';
	
	// Set CSS for the control border
	var controlUI = document.createElement('DIV');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '2px';
	controlUI.style.textAlign = 'center';
	controlUI.style.padding = '2px';
	controlDiv.appendChild(controlUI);

	// The text to show the link box
	var link = document.createElement('A');
	link.innerHTML = 'Get Link';
	link.style.cursor = 'pointer';
	controlUI.appendChild(link);
	
	var linkTextBox = document.createElement('INPUT');
	controlUI.appendChild(linkTextBox);

	// The text to hide the link box
	var hideLink = document.createElement('A');
	hideLink.innerHTML = 'Hide';
	hideLink.style.cursor = 'pointer';
	hideLink.style.display = 'none';
	controlUI.appendChild(hideLink);
	
	linkTextBox.style.display = 'none';
	var textVisible = false;
	
	google.maps.event.addDomListener(link, 'click', function()
	{
		toggleLink();
	});
	google.maps.event.addDomListener(hideLink, 'click', function()
	{
		toggleLink();
	});
	
	function toggleLink()
	{
		updateLinkUrl();
		
		if (textVisible)
		{
			// Becoming hidden
			link.style.display = '';
			hideLink.style.display = 'none';
			linkTextBox.style.display = 'none';
		}
		else
		{
			// Becoming visible
			link.style.display = 'none';
			hideLink.style.display = '';
			linkTextBox.style.display = '';
			linkTextBox.select();
		}													
		textVisible = !textVisible;
	}
	*/
	
	google.maps.event.addListener(map, 'zoom_changed',
	function()
	{
		updateLinkUrl();
	});

/*	google.maps.event.addListener(map, 'mousemove',
	function(event)
	{
		updateVisibleCoord(event.latLng);
	});
*/	
	google.maps.event.addListener(map, 'dragend',
	function(event)
	{
		updateLinkUrl();
	});
	
	google.maps.event.addListener(map, 'maptypeid_changed',
	function(event)
	{
		updateLinkUrl();
	});
	
	function updateLinkUrl()
	{
		latLong = map.getCenter();
		
		var projection = map.getProjection();
		
		mapCent = projection.fromLatLngToPoint(latLong);
		worldCent = projection.mapToWorld(mapCent);
		
		/*
		url = '';
		url += getUrlWithoutParams();
		url += '?layerId=' + map.getMapTypeId();
		url += '&worldX=' + Math.round(worldCent.x);
		url += '&worldY=' + Math.round(worldCent.y);
		url += '&worldZ=' + Math.round(worldCent.z);
		url += '&zoom=' + map.getZoom();
		
		linkTextBox.value = url;
		*/
		
		// Update the url in the browser's address bar with the new location
		// Have to pack the coords into the fragment as this is the only place we can put them
		// that won't trigger a page reload
		var fragment = '';
		fragment += 'layerId=' + map.getMapTypeId();
		fragment += '&worldX=' + Math.round(worldCent.x);
		fragment += '&worldY=' + Math.round(worldCent.y);
		fragment += '&worldZ=' + Math.round(worldCent.z);
		fragment += '&zoom=' + map.getZoom();
		window.location.hash = fragment;
	}
	
	/*
	function updateVisibleCoord(latLong)
	{
		var projection = map.getProjection();
		
		mapCent = projection.fromLatLngToPoint(latLong);
		worldCent = projection.mapToWorld(mapCent);
		
		x = Math.round(worldCent.x);
		y = Math.round(worldCent.y);
		z = Math.round(worldCent.z);
		
		link.innerHTML = 'Get link to ('+x+', '+y+', '+z+')';				
	}
	
	return controlDiv;
	*/
}


// members:
//	int lattitudeRange
//	WorldVectors worldVectors

function MinecraftProjection(lattRange, worldVecs)
{
	this.lattitudeRange = lattRange;
	this.worldVectors = worldVecs;
};

MinecraftProjection.prototype.fromLatLngToPoint = function(latLng, opt_point)
{
	// Convert from lat-long to map coord
	
	var point = opt_point || new google.maps.Point(latLng.lat(), latLng.lng());
	
	// from lat-long to normalised (0, 1) coord
	point.x = (point.x / lattitudeRange) + 0.5;
	point.y = (point.y / 180) + 0.5;
	
	// from normalised to map coord
	point.x = point.x * this.worldVectors.mapSize.x + this.worldVectors.mapMin.x;
	point.y = point.y * this.worldVectors.mapSize.y + this.worldVectors.mapMin.y;
	
	return point;
};

// Need to map from tile coords to lat-long
// longitude is x and ranges from -180 through 0 (Greenwich) to +180
// lattitude is y and ranges from -90 (north pole) through 0 (equator) to +90 (south pole)
// ie. min lat-long is (-180, -90)
//     max lat-long is (+180, +90)

MinecraftProjection.prototype.fromPointToLatLng = function(point)
{
	// Convert from map coord to lat-long
	
	// from map coord to normalised (0, 1)
//	point.x = (point.x - mapXMin) / mapWidth;
	point.x = (point.x - this.worldVectors.mapMin.x) / this.worldVectors.mapSize.x;
//	point.y = (point.y - mapYMin) / mapHeight;
	point.y = (point.y - this.worldVectors.mapMin.y) / this.worldVectors.mapSize.y;
	
	// from normalised to lat-long
	point.x = point.x * this.lattitudeRange - (this.lattitudeRange/2);
	point.y = point.y * 180 - 90;
	
	return new google.maps.LatLng(point.x, point.y, true);
};

// Converts from minecraft world coord to map pixel coords
MinecraftProjection.prototype.worldToMap = function(world)
{
	var point = new google.maps.Point(this.worldVectors.origin.x, this.worldVectors.origin.y);
	
	point.x += this.worldVectors.xAxis.x * world.x;
	point.y += this.worldVectors.xAxis.y * world.x;
			
	point.x += this.worldVectors.yAxis.x * world.y;
	point.y += this.worldVectors.yAxis.y * world.y;
			
	point.x += this.worldVectors.zAxis.x * world.z;
	point.y += this.worldVectors.zAxis.y * world.z;
	
	return point;
}

MinecraftProjection.prototype.mapToWorld = function(point)
{
	var world = new WorldCoord(0, 0, 0);
	
	adjusted = new google.maps.Point(point.x - this.worldVectors.origin.x, point.y - this.worldVectors.origin.y);
	
	world.x += (this.worldVectors.mapXUnit.x * adjusted.x);
	world.z += (this.worldVectors.mapXUnit.y * adjusted.x);

	var xx = this.worldVectors.mapYUnit.x * adjusted.y;
	var zz = this.worldVectors.mapYUnit.y * adjusted.y;				
	world.x += xx*2; // hmmm....
	world.z += zz*2;
	
	return world;
}


// TODO:
//
//	- make players/signs/portals/beds initially visible work again 
//
//	- only show signs/beds/players toggle control when there is data to toogle?
//

function size(obj)
{
    var size = 0, key;
    for (key in obj)
    {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function createTileUrlFunc(mapId, layerId, imageFormatWithoutDot)
{
	var urlFunc = function(coord, zoom)
	{
		var xBin = coord.x % 16;
		var yBin = coord.y % 16;
		
		var url = mapId+"/"+layerId+"/Zoom"+zoom+"/"+xBin+"/"+yBin+"/tile_"+coord.x+"_"+coord.y+"."+imageFormatWithoutDot;
		return url;
	}
	return urlFunc;
}

// Only use a fraction of the latitude range so we stay clear of the date line (where things wrap and going weird)
var lattitudeRange = 10;
var compassControl = null;

var viewToggleControl = null;
var signToggleControl = null;
var playerToggleControl = null;
var bedToggleControl = null;
var portalToggleControl = null;
var spawnToggleControl = null;
var chestToggleControl = null;

function main()
{
	var queryParams = getQueryParams();
	var fragmentParams = getFragmentParams();
	
	var mapIds = [];
	for (i in contents)
	{
		var tecMap = contents[i];
		for (j in tecMap.layers)
		{
			var layer = tecMap.layers[j];
			mapIds.push(layer.id);
		}
	}
		
	var myOptions =
	{
		zoom: 0,
		center: new google.maps.LatLng(0, 0),		// initial center (overridden later)
		mapTypeId: google.maps.MapTypeId.ROADMAP,	// initial map id (overridden later)
		mapTypeControl: mapIds.length > 1,				// Only display the map type control if we have multiple maps
		streetViewControl: false,
		overviewMapControl: true,
		backgroundColor: 'none',
		mapTypeControlOptions:
		{
			mapTypeIds: mapIds,
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.RIGHT_TOP
		}
	};
	
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	
	for (i in contents)
	{
		var tecMap = contents[i];
		
		for (j in tecMap.layers)
		{
			var layer = tecMap.layers[j];
			var overlayOptions =
			{
				name: layer.name,
				tileSize: new google.maps.Size(tileSize, tileSize),
				maxZoom: maxZoom,
				isPng: layer.isPng,
				getTileUrl: createTileUrlFunc(tecMap.id, layer.id, layer.imageFormat)
			};
			var minecraftMapType = new google.maps.ImageMapType(overlayOptions);
			minecraftMapType.projection = new MinecraftProjection(lattitudeRange, tecMap.worldVectors);
			minecraftMapType.tectonicusMap = tecMap;
			minecraftMapType.layer = layer;
			map.mapTypes.set(layer.id, minecraftMapType);
			
			// Set the starting lat-long pos
			var startPoint = minecraftMapType.projection.worldToMap(tecMap.worldVectors.startView);
			var startLatLong = minecraftMapType.projection.fromPointToLatLng(startPoint);
			tecMap.viewLatLong = startLatLong; // 'viewLatLong' stores view pos for a given map, so we don't end up looking at nothing when we toggle between terra and nether
		}
	}
	
	
	signWindow = new google.maps.InfoWindow(
	{
		maxWidth: 1500
	});
	
	google.maps.event.addListener(map, 'click', function() {
        signWindow.close();
    });
	
	// Find a default start layer
	var startMap = contents[0];
	var startLayer = startMap.layers[0];
	
	// Try and get a starting view from the fragment params, query params, or fall back to default
	var startView;
	if (size(fragmentParams) > 0)
		startView = findStartView(fragmentParams, startLayer.id, startMap.worldVectors.startView);
	else
		startView = findStartView(queryParams, startLayer.id, startMap.worldVectors.startView);
	
	// Set the starting view
	map.setMapTypeId(startView.layerId);
	map.setCenter(startView.latLong);
	map.setZoom(startView.zoom);
	
	// And update the view latLong
	var mapType = map.mapTypes.get( map.getMapTypeId() );
	mapType.tectonicusMap.viewLatLong = startView.latLong;
	
	// Create controls
	
	compassControl = CreateCompassControl(map, mapType.tectonicusMap.id + '/Compass.png');

	viewToggleControl = CreateMarkerToggle(map, 'show views', 'Images/Picture.png', viewMarkers, viewsInitiallyVisible);	
	signToggleControl = CreateMarkerToggle(map, 'show signs', 'Images/Sign.png', signMarkers, signsInitiallyVisible);
	playerToggleControl = CreateMarkerToggle(map, 'show players', 'Images/PlayerIcons/Tectonicus_Default_Player_Icon.png', playerMarkers, playersInitiallyVisible);
	bedToggleControl = CreateMarkerToggle(map, 'show beds', 'Images/Bed.png', bedMarkers, bedsInitiallyVisible);
	portalToggleControl = CreateMarkerToggle(map, 'show portals', 'Images/Portal.png', portalMarkers, portalsInitiallyVisible);
	spawnToggleControl = CreateMarkerToggle(map, 'show spawn', 'Images/Spawn.png', spawnMarkers, spawnInitiallyVisible);	
	chestToggleControl = CreateMarkerToggle(map, 'show chests', 'Images/Chest.png', chestMarkers, false);
	
	CreateLinkControl(map);
	
	// Add controls to the map
	
	map.controls[google.maps.ControlPosition.TOP_LEFT].push( compassControl.getDiv() );
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push( CreateHomeControl(map) );
	
	var tecMap = getActiveMap();
	
	if (tecMap.chests.length != 0)
		map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(chestToggleControl);
	if (tecMap.portals.length != 0)
		map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(portalToggleControl);
	if (tecMap.beds.length != 0)
		map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(bedToggleControl);
	if (tecMap.players.length != 0)
		map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(playerToggleControl);
	if (tecMap.views.length != 0)
		map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(viewToggleControl);
	if (tecMap.signs.length != 0)
		map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(signToggleControl);	
	map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(spawnToggleControl);

	// Register these last so that they don't get called while we're still initialising
	google.maps.event.addListener(map, 'projection_changed', onProjectionChanged);
	google.maps.event.addListener(map, 'maptypeid_changed', onMapTypeChanged);
	
	// Manually call these to set the initial state
	onMapTypeChanged();
	onProjectionChanged();
		
	runGa();
}

spawnMarkers = [];
signMarkers = [];
viewMarkers = [];
playerMarkers = [];
portalMarkers = [];
bedMarkers = [];
chestMarkers = [];

function onMapTypeChanged()
{
	var mapType = map.mapTypes.get( map.getMapTypeId() );
	map.setCenter(mapType.tectonicusMap.viewLatLong);
	
	$("#map_canvas").css({"background-color" : mapType.layer.backgroundColor});
	
	refreshSpawnMarker( spawnToggleControl.checked );
	refreshSignMarkers( signToggleControl.checked );
	refreshViewMarkers( viewToggleControl.checked );
	refreshPlayerMarkers( playerToggleControl.checked );
	refreshBedMarkers( bedToggleControl.checked );
	refreshPortalMarkers( portalToggleControl.checked );
	refreshChestMarkers( chestToggleControl.checked );
	
	if (compassControl)
		compassControl.setCompassImage( mapType.tectonicusMap.id + '/Compass.png' );
}

function onProjectionChanged()
{
	// Store the previous latLong in the map
	var mapType = map.mapTypes.get( map.getMapTypeId() );
	mapType.tectonicusMap.viewLatLong = map.getCenter();
	
} // end onProjectionChanged callback

function refreshSpawnMarker(markersVisible)
{
	destroyMarkers(spawnMarkers);
	
	var tecMap = getActiveMap();
	var projection = getActiveProjection();
	
	// Spawn marker
	if (showSpawn)
	{
		var point = projection.worldToMap(tecMap.worldVectors.spawnPosition);
		var pos = projection.fromPointToLatLng(point);
				
		var marker = new google.maps.Marker(
		{		
			position: pos,
			map: map, 
			title: 'Spawn point',
			icon: 'Images/Spawn.png',
			optimized: false
		});
		
		// Disable this marker if we don't want signs initially visible						
		if (!markersVisible)
			marker.setMap(null);
			
		spawnMarkers.push(marker);
		
		google.maps.event.addListener(marker, 'click', function()
		{
		//	var worldSizeMb = stats.worldSizeInBytes / 1024 / 1024;
			var peakMemoryMb = stats.peakMemoryBytes / 1024 / 1024;
			
			var statsHtml = '';
		//	if (stats.worldName != '')
		//	{
		//		statsHtml += '<div><center><font size="+2">'+stats.worldName+'</font></center></div>'
		//	}
		//	statsHtml += '<div><center>Map Stats</center></div>';
		//	statsHtml += 'World size: ' + worldSizeMb.toFixed(1) + 'Mb<br/>';
		//	statsHtml += 'Surface area: ' + stats.surfaceArea + 'km&sup2;<br/>';
		//	statsHtml += 'Total chunks: ' + stats.numChunks + '<br/>';
		//	statsHtml += 'Total players: ' + stats.numPlayers + '<br/>';
		//	statsHtml += '<br/>';
			
			statsHtml += '<div><center>Render Stats</center></div>';
			statsHtml += 'Tectonicus version: ' + stats.tectonicusVersion + '<br/>';
			statsHtml += 'Render time: ' + stats.renderTime + '<br/>';
			statsHtml += 'Peak memory usage: ' + peakMemoryMb.toFixed(1) + 'Mb<br/>';
			statsHtml += 'Created on ' + stats.renderedOnDate + '<br/>';
			statsHtml += 'Created at ' + stats.renderedOnTime + '<br/>';
			statsHtml += '<br/>';

			statsHtml += '<div><center>World stats</center></div>';
			statsHtml += 'Players: ' + tecMap.worldStats.numPlayers + '<br/>';
			statsHtml += 'Chunks: ' + tecMap.worldStats.numChunks + '<br/>';
			statsHtml += 'Portals: ' + tecMap.worldStats.numPortals + '<br/>';
			statsHtml += 'Views: ' + tecMap.views.length + '<br/>';
			statsHtml += 'Signs: ' + tecMap.signs.length + '<br/>';
			statsHtml += 'Player Beds: ' + tecMap.beds.length + '<br/>';
			statsHtml += '<br/>';
			
			statsHtml += '<div><center>Blocks</center></div>';
			for (i in tecMap.blockStats)
			{
				var stat = tecMap.blockStats[i];
				statsHtml += stat.name + ' ' + stat.count + '<br/>';
			}
			
			var options =
			{
				content: statsHtml
			};
			signWindow.close();
			signWindow.setOptions(options);
			signWindow.open(map, this);
		});
	}
}

function refreshSignMarkers(markersVisible)
{
	destroyMarkers(signMarkers);
	
	var tecMap = getActiveMap();
	var projection = getActiveProjection();
	
	// Sign markers
	for (i in tecMap.signs)
	{
		var sign = tecMap.signs[i];
		
		var point = projection.worldToMap(sign.worldPos);
		var pos = projection.fromPointToLatLng(point);
			
		var marker = new google.maps.Marker(
		{		
			position: pos,
			map: map, 
			title: '',
			icon: 'Images/Sign.png',
			optimized: false
		});
		
		// Disable this marker if we don't want signs initially visible						
		if (!markersVisible)
			marker.setMap(null);
		
		marker.sign = sign; // save this ref in the marker so we can fetch it in the bound function below
		
		google.maps.event.addListener(marker, 'click', function()
		{
			var options =
			{
				content: '<pre><center>' + this.sign.text1 + '<br/>' + this.sign.text2 + '<br/>' + this.sign.text3 + '<br/>' + this.sign.text4 + '</center></pre>'
			};
			signWindow.close();
			signWindow.setOptions(options);
			signWindow.open(map, this);
		});
		
		signMarkers.push(marker);
	}
}

function refreshViewMarkers(markersVisible)
{
	destroyMarkers(viewMarkers);
	
	var tecMap = getActiveMap();
	var projection = getActiveProjection();
	
	// View markers
	for (i in tecMap.views)
	{
		var view = tecMap.views[i];
		
		var point = projection.worldToMap(view.worldPos);
		var pos = projection.fromPointToLatLng(point);
			
		var marker = new google.maps.Marker(
		{		
			position: pos,
			map: map, 
			title: '',
			icon: 'Images/Picture.png',
			optimized: false
		});
		
		// Disable this marker if we don't want signs initially visible						
		if (!markersVisible)
			marker.setMap(null);
		
		marker.view = view; // save this ref in the marker so we can fetch it in the bound function below
		
		google.maps.event.addListener(marker, 'click', function()
		{
			var html = '';

			html += '<div>';
			html += '<a href="' + this.view.imageFile + '">';
			html += '<img width="512" height="288" src="' + this.view.imageFile + '"/>';
			html += '</a>';
			html += '</div>';
			
			html += '';
			html += '<center>';
			html += this.view.text;
			html += '</center>';
			html += '';
		
			
			var options =
			{
				content: html
			};
			signWindow.close();
			signWindow.setOptions(options);
			signWindow.open(map, this);
		});
		
		viewMarkers.push(marker);
	}
}

function loadIcon(src, player, pos, markersVisible) 
{
	var icon = new Image();
	icon.onload = function() {
		player.icon = src;
		var marker = createPlayerMarker(map, player, pos, signWindow);
		
		// Disable this marker if we don't want signs initially visible						
		if (!markersVisible)
			marker.setMap(null);
			
		playerMarkers.push(marker);
    };
	icon.onerror = function() {
		player.icon = player.icon = "Images/PlayerIcons/Tectonicus_Default_Player_Icon.png";
		var marker = createPlayerMarker(map, player, pos, signWindow);
		
		// Disable this marker if we don't want signs initially visible						
		if (!markersVisible)
			marker.setMap(null);
			
		playerMarkers.push(marker);
	};
    icon.src = src;
}

function refreshPlayerMarkers(markersVisible)
{
	destroyMarkers(playerMarkers);

	var tecMap = getActiveMap();
	var projection = getActiveProjection();
	
	// Player markers
	for (i in tecMap.players)
	{
		var player = tecMap.players[i];
		
		player.donation = '';
		
		var point = projection.worldToMap(player.worldPos);
		var pos = projection.fromPointToLatLng(point);
			
		loadIcon("Images/PlayerIcons/"+player.name+".png", player, pos, markersVisible);
	}	
}

function refreshBedMarkers(markersVisible)
{
	destroyMarkers(bedMarkers);

	var tecMap = getActiveMap();
	var projection = getActiveProjection();
	
	// Bed markers
	for (i in tecMap.beds)
	{
		var bed = tecMap.beds[i];
		
		var point = projection.worldToMap(bed.worldPos);
		var pos = projection.fromPointToLatLng(point);
			
		var marker = new google.maps.Marker(
		{		
			position: pos,
			map: map, 
			title: bed.playerName + "'s bed",
			icon: 'Images/Bed.png',
			optimized: false
		});

		// Disable this marker if we don't want signs initially visible						
		if (!markersVisible)
			marker.setMap(null);
		
		marker.bed = bed; // save this ref in the marker so we can fetch it in the bound function below
		
		google.maps.event.addListener(marker, 'click', function()
		{
			var options =
			{
				content: '<center>' + this.bed.playerName + "'s bed</center>"
			};
			signWindow.close();
			signWindow.setOptions(options);
			signWindow.open(map, this);
		});
		
		bedMarkers.push(marker);
	}
}

function refreshPortalMarkers(markersVisible)
{
	destroyMarkers(portalMarkers);

	var tecMap = getActiveMap();
	var projection = getActiveProjection();
	
	// Portal markers
	for (i in tecMap.portals)
	{
		var portal = tecMap.portals[i];
		
		var point = projection.worldToMap(portal.worldPos);
		var pos = projection.fromPointToLatLng(point);
			
		var marker = new google.maps.Marker(
		{		
			position: pos,
			map: map, 
			title: '',
			icon: 'Images/Portal.png',
			optimized: false
		});
		
		marker.portal = portal; // save this ref in the marker so we can fetch it in the bound function below
		
		google.maps.event.addListener(marker, 'click', function()
		{
			var options =
			{
				content: '<center>Portal</center><br/> position ('+this.portal.worldPos.x+', '+this.portal.worldPos.y+', '+this.portal.worldPos.z+')'
			};
			signWindow.close();
			signWindow.setOptions(options);
			signWindow.open(map, this);
		});
		
		// Disable this marker if we don't want signs initially visible						
		if (!markersVisible)
			marker.setMap(null);
			
		portalMarkers.push(marker);
	}
}

function refreshChestMarkers(markersVisible)
{
	destroyMarkers(chestMarkers);

	var tecMap = getActiveMap();
	var projection = getActiveProjection();
	
	// Chest markers
	for (i in tecMap.chests)
	{
		var chest = tecMap.chests[i];
		
		var point = projection.worldToMap(chest.worldPos);
		var pos = projection.fromPointToLatLng(point);
			
		var marker = new google.maps.Marker(
		{		
			position: pos,
			map: map, 
			title: "Chest",
			icon: 'Images/Chest.png',
			optimized: false
		});

		// Disable this marker if we don't want chests initially visible						
		if (!markersVisible)
			marker.setMap(null);
		
		marker.chest = chest; // save this ref in the marker so we can fetch it in the bound function below
		
		google.maps.event.addListener(marker, 'click', function()
		{
			var options =
			{
				content: '<img width="300" height="131" src="Images/SmallChest.png"/>'
			};
			signWindow.close();
			signWindow.setOptions(options);
			signWindow.open(map, this);
		});
		
		chestMarkers.push(marker);
	}
}

function getActiveLayer()
{
	var mapType = map.mapTypes.get( map.getMapTypeId() );
	var layer = mapType.layer;
	return layer;
}

function getActiveMap()
{
	var mapType = map.mapTypes.get( map.getMapTypeId() );
	var tecMap = mapType.tectonicusMap;
	return tecMap;
}

function getActiveProjection()
{
	var mapType = map.mapTypes.get( map.getMapTypeId() );
	var projection = mapType.projection;
	return projection;
}

function destroyMarkers(markers)
{
	for (i in markers)
	{
		var marker = markers[i];
		marker.setMap(null);
		
		// remove marker from map?
		// ..
	}
	
	markers.length = 0; // todo: check this works		
}

function ViewPos(layerId, worldPos, zoom, latLong)
{
	this.layerId = layerId;
	this.worldPos = worldPos;
	this.zoom = zoom;
	this.latLong = latLong;
}

function findStartView(params, defaultLayerId, defaultSpawnPos)
{
	var queryLayerId = defaultLayerId;
	var queryPos = new WorldCoord(defaultSpawnPos.x, defaultSpawnPos.y, defaultSpawnPos.z);
	var queryZoom = 0;
	
	if (params.hasOwnProperty('layerId'))
	{
		queryLayerId = params['layerId'];
	}
	
	if (params.hasOwnProperty('worldX')
		&& params.hasOwnProperty('worldY')
		&& params.hasOwnProperty('worldZ'))
	{
		queryPos.x = parseInt( params['worldX'] );
		queryPos.y = parseInt( params['worldY'] );
		queryPos.z = parseInt( params['worldZ'] );
	}
	
	if (params.hasOwnProperty('zoom'))
	{
		queryZoom = parseInt( params['zoom'] );
	}
	
	if (queryZoom < 0)
		queryZoom = 0;
	if (queryZoom > maxZoom)
		queryZoom = maxZoom;

	var mapType = map.mapTypes.get(queryLayerId);
	var projection = mapType.projection;
	
	var startPoint = projection.worldToMap(queryPos);
	var startLatLong = projection.fromPointToLatLng(startPoint);
	
	return new ViewPos(queryLayerId, queryPos, queryZoom, startLatLong);
}

window.onload = main;
