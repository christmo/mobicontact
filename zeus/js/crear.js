var map_1;

$("#crear").live("pageshow",function(){
//    $('#i_lat').textinput('disable');
//    $('#i_lon').textinput('disable');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        error('not supported');
    }
});

function success(position) {
    $('#i_lat').attr('value',position.coords.latitude);
    $('#i_lon').attr('value',position.coords.longitude);
    mapa(position);
}

function error(msg) {
    alert('No se puede recuperar coordenadas GPS ingresarlas manualmente');
    $('#i_lat').textinput('enable');
    $('#i_lon').textinput('enable');
}

function mapa(position){
    document.getElementById("map_1").innerHTML = "";
        map_1 = new OpenLayers.Map( 'map_1' );
        map_1.addLayer(new OpenLayers.Layer.OSM());
        var ourpoint = new OpenLayers.LonLat(position.coords.longitude,position.coords.latitude);
        ourpoint.transform(new OpenLayers.Projection("EPSG:4326" ), map.getProjectionObject());
        map_1.setCenter(ourpoint, 17);
                    
        var zoom=16;
        var markers = new OpenLayers.Layer.Markers( "Markers" );
        map_1.addLayer(markers); 
        markers.addMarker(new OpenLayers.Marker(ourpoint)); 
        map_1.setCenter (ourpoint, zoom);

//    map_1 = crearMapa('map_1');
//    var lonLat = new OpenLayers.LonLat(position.coords.longitude,position.coords.latitude).transform(
//        new OpenLayers.Projection( 'EPSG:4326' ),
//        map_1.getProjectionObject() );
//    map_1.addLayer(new OpenLayers.Layer.OSM());
//    
//    var zoom=16;
//    var markers = new OpenLayers.Layer.Markers( "Markers" );
//    map_1.addLayer(markers);
//    markers.addMarker(new OpenLayers.Marker(lonLat)); 
//    map_1.setCenter ( lonLat, zoom );
}