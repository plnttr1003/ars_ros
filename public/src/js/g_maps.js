var map;
var grayStyles = [
{
  featureType: "all",
  stylers: [
	  { saturation: -90 },
	  { lightness: 10 }
  ]
},
];
function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(55.766172,37.601609),
		zoom: 17,
		scrollwheel: false,
		styles: grayStyles,
		center: new google.maps.LatLng(55.766172,37.601609),
		mapTypeId: google.maps.MapTypeId.ROADMAP
};

	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	/*var contentString = '<div id="content">'+
    '<h1 id="firstHeading" class="firstHeading">Государственный центральный музей современной истории России</h1>'+
    '<div id="bodyContent">' +
    '<h2>Адрес:</h2>' +
    '<p>125009, Россия, Москва, ' +
    'Тверская ул., дом 21 </p>' +
    '<h2>Время работы:</h2>' +
    '<p>Вторник, среда, пятница: с 10.00 до 18.00, '+
    'касса до 17.30 </p>'+
    '<p>Четверг: с 12.00 до 21.00,'+
    'касса до 20.30 </p>'+
    '<p>Суббота, воскресенье: с 11.00 до 19.00,'+
    'касса до 18.30 </p>'+
    '<p><b>Понедельник — выходной день</b></p>'+
    '</div>'+
    '</div>';
*/
	var contentString = '<div id="content">Государственный центральный музей <br> современной истории России</div>';


	var infowindow = new google.maps.InfoWindow({
			content: contentString
	});


	var image = '/images/design/baloon.png';
	var myLatLng = new google.maps.LatLng(55.766172,37.601609);
	var beachMarker = new google.maps.Marker({
	  position: myLatLng,
	  map: map,
	  icon: image
	});

	google.maps.event.addListener(beachMarker, 'click', function() {
		infowindow.open(map,beachMarker);
	});
}

google.maps.event.addDomListener(window, 'load', initialize);