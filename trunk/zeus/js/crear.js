var position;

$("#crear").live("pageshow",function(){
    $('#i_lat').textinput('disable');
    $('#i_lon').textinput('disable');
    mapa(position);
});

function success(position) {
    $('#i_lat').attr('value',position.coords.latitude);
    $('#i_lon').attr('value',position.coords.longitude);
    this.position = position;
}

function error(msg) {
    alert('No se puede recuperar coordenadas GPS ingresarlas manualmente');
    $('#i_lat').textinput('enable');
    $('#i_lon').textinput('enable');
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    error('not supported');
}

function mapa(position){
    document.getElementById("map_1").innerHTML = "";
    crearMapa('map_1');
//                
//    var ourpoint = new OpenLayers.LonLat(  position.coords.latitude,position.coords.longitude);
//    ourpoint.transform(new OpenLayers.Projection("EPSG:4326" ), map.getProjectionObject());
//    map.setCenter(ourpoint, 17); 
//    var zoom=16;
//    var markers = new OpenLayers.Layer.Markers( "Markers" );
//    map.addLayer(markers); 
//    markers.addMarker(new OpenLayers.Marker(ourpoint)); 
//    map.setCenter (ourpoint, zoom);
}