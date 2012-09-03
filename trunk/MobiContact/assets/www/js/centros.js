/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var ciudades = [];

$("#centros").live("pageshow", function(prepage) {
    
    getJson();
    
});

$("#centros ul li").live("click",function(evt){
    evt.preventDefault();
    indActual = $(this).attr("id");
    $.mobile.changePage("#locales");
    
});

$("#locales").live("pageshow",function(){
    $(".inner").html("<p>"+ciudades[indActual].nombre+"</p>");
    var localesHtml = "";
    for(var i = 0; i<ciudades[indActual].locales.length;i++){
        var mlocal = ciudades[indActual].locales[i];
       
        localesHtml += "<li id=\""+i+"\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\""+
        " class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c\">"+
        "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\"><a href=\"#\""+
        "class=\"ui-link-inherit\">"+mlocal.nombre+"</a></div>"+
        "<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";
    }
    $(".locales").html(localesHtml);
});
    
$("#locales div li").live("click",function(evt){
    indLocal = $(this).attr("id");
    $.mobile.changePage("#mapa","slide",false,true);
    
}); 


$("#mapa").live("pageshow",function(){
    $(".nombre_local").html("");
    $(".nombre_local").html("<h4>"+ciudades[indActual].locales[indLocal].nombre+"</h4>");
    init(ciudades[indActual].locales[indLocal].coordenadas);
    
});


function init(position){
    document.getElementById("map").innerHTML = "";
    var coordenadas = position.split(",");
    
     /*var extent = new OpenLayers.Bounds();
    extent.extend(new OpenLayers.LonLat(coordenadas[1],coordenadas[0]));

    extent.transform( new OpenLayers.Projection( 'EPSG:4326' ),
        new OpenLayers.Projection( 'EPSG:900913' ));
    */
    // Mapa
    var options = {
        controls : [
        new OpenLayers.Control.Navigation(),
//        new OpenLayers.Control.PanZoomBar(),
        new OpenLayers.Control.KeyboardDefaults(),
//        new OpenLayers.Control.LayerSwitcher()
        ]
    };
     
    
    map = new OpenLayers.Map( 'map',options );
    map.addLayer(new OpenLayers.Layer.OSM());
    ourpoint = new OpenLayers.LonLat(  coordenadas[1],coordenadas[0]);
    ourpoint.transform(new OpenLayers.Projection("EPSG:4326" ), map.getProjectionObject());
    map.setCenter(ourpoint, 17);
    
   
                
    var zoom=16;
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers); 
    markers.addMarker(new OpenLayers.Marker(ourpoint)); 
    map.setCenter (ourpoint, zoom);
    
}



function getJson(){
    document.getElementById("centros_div").innerHTML = "";
    $.ajax({
        type: "GET",
        url: "http://200.0.29.91:8080/MoviRest/ciudades.json",
        async: false,
        dataType: "json",
        success: function(data){
            ciudades = data.ciudades;       
            for(var i = 0; i < data.ciudades.length;i++ ){
                document.getElementById("centros_div").innerHTML +=
                    
                "<li id=\""+i+"\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\""+
                " class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c\">"+
                "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\"><a href=\"#\""+
                "class=\"ui-link-inherit\">"+data.ciudades[i].nombre+"</a></div>"+
                "<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";
                  
                            
            }
                       
        }
    });
}