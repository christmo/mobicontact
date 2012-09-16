/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var ciudades = [];
var indActual = "";
var indLocal = "";



$("#centros").bind("pageshow", function(evt) {
    evt.preventDefault();
    try
    {
        getJson();
    }
    catch(err)
    {
        console.log(err);
    }
    getMaps();
    
    
});

function getMaps(){
    console.log("Tratando de obtener mapas");
    try{
        $.getScript("http://www.openlayers.org/api/OpenLayers.js", function(data, textStatus, jqxhr) {
            //data returned
            console.log(textStatus); //success
            console.log(jqxhr.status); //200
            console.log('Carga de open street completa.');
        });
    }catch(ex){
        alert("Sin conexion");
        console.log(ex);
    }
                
}
           

$("#centros ul li").live("click",function(evt){
    try
    {
        evt.preventDefault();
        indActual = $(this).attr("id");
    //$.mobile.changePage("#locales");
    }
    catch(err)
    {
        console.log(err);
    }
    
    
});

$("#locales").live("pageshow",function(){
    try
    {
        var localesHtml = "";
        for(var i = 0; i<ciudades[indActual].locales.length;i++){
            var mlocal = ciudades[indActual].locales[i];
       
            localesHtml += "<li id=\""+i+"\" data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\""+
                "data-iconsize=\"18\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\""+
                "data-theme=\"a\" class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-corner-top ui-btn-up-a\">"+
                "<div class=\"ui-btn-inner ui-li ui-corner-top\"><div class=\"ui-btn-text\">"+
                "<a href=\"#mapa\" class=\"ui-link-inherit\">"+mlocal.nombre+"</a></div><span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow ui-iconsize-18\">"+
                "·&nbsp;</span></div></li>";
                
                
                
                
                /*'<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + mlocal.nombre + '</a></li>';
    
              /*  
                
                
            "<li id=\""+i+"\" data-icon=\"arrow-r\"  data-wrapperels=\"div\" data-iconpos=\"right\""+
            "data-theme=\"b\" class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-b\">"+
            "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\">"+
            "<a href=\"#mapa\" class=\"ui-link-inherit\">"+mlocal.nombre+"</a>"+
            "</div><span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";
                
                
        /*"<li data-theme=\"b\" id=\""+i+"\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\""+
            " class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c\">"+
            "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\"><a href=\"#mapa\""+
            "class=\"ui-link-inherit\">"+mlocal.nombre+"</a></div>"+
            "<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";
                /*"<li id=\""+i+"\"><a href=\"index.html\" data-role=\"button\" data-shadow=\"true\""+
                "data-iconshadow=\"true\" data-wrapperels=\"span\" data-theme=\"b\""+
                "class=\"ui-btn ui-shadow ui-btn-corner-all ui-btn-up-b\">"+
                "<span class=\"ui-btn-inner ui-btn-corner-all\">"+
                "<span class=\"ui-btn-text\">"+mlocal.nombre+"</span></span></a><li>";*/
                
                
                
             
        }
        $("#locales2").html(localesHtml);
    }
    catch(err)
    {
        console.log(err);
    }
    
});
    
$("#locales div li").live("click",function(evt){
    document.getElementById("map").innerHTML = "";
    try
    {
        indLocal = $(this).attr("id");
    //$.mobile.changePage("#mapa","slide",false,true);
    }
    catch(err)
    {
        console.log(err);
    }
    
    
}); 


$("#mapa").live("pageshow",function(){
    try
    {
        $(".nombre_local").html("");
        $(".nombre_local").html("<h4>"+ciudades[indActual].locales[indLocal].nombre+"</h4>");
        initMap
        (ciudades[indActual].locales[indLocal].coordenadas);
    }
    catch(err)
    {
        console.log(err);
    }
    
    
});


            

function initMap(position){
    document.getElementById("map").innerHTML = "";
    
    var coordenadas = position.split(",");
    
    
    // The overlay layer for our marker, with a simple diamond as symbol
    var overlay = new OpenLayers.Layer.Vector('Overlay', {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: 'themes/images/icon_movi.png',
            graphicWidth: 20, 
            graphicHeight: 24, 
            graphicYOffset: -24,
            title: '${tooltip}'
        })
    });

    // The location of our marker and popup. We usually think in geographic
    // coordinates ('EPSG:4326'), but the map is projected ('EPSG:3857').
    var myLocation = new OpenLayers.Geometry.Point(coordenadas[1],coordenadas[0])
    .transform('EPSG:4326', 'EPSG:3857');

    // We add the marker with a tooltip text to the overlay
    overlay.addFeatures([
        new OpenLayers.Feature.Vector(myLocation, {
            tooltip: 'OpenLayers'
        })
        ]);

    // A popup with some information about our location
    var popup = new OpenLayers.Popup.FramedCloud("Popup", 
        myLocation.getBounds().getCenterLonLat(), null,
        '<p style=\"color:black\">'+ciudades[indActual].locales[indLocal].nombre+'</p>', null,
        false // <-- true if we want a close (X) button, false otherwise
        );
    // Finally we create the map
    map = new OpenLayers.Map({
        div: "map", 
        projection: "EPSG:3857",
        layers: [new OpenLayers.Layer.OSM(), overlay],
        center: myLocation.getBounds().getCenterLonLat(), 
        zoom: 16
    });
    // and add the popup to it.
    map.addPopup(popup);
    
    /*var extent = new OpenLayers.Bounds();
    extent.extend(new OpenLayers.LonLat(coordenadas[1],coordenadas[0]));

    extent.transform( new OpenLayers.Projection( 'EPSG:4326' ),
        new OpenLayers.Projection( 'EPSG:900913' ));
    */
    // Mapa
   /* try{
        var options = {
            controls : [
            new OpenLayers.Control.Navigation(),
            //        new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.KeyboardDefaults(),
            //        new OpenLayers.Control.LayerSwitcher()
            ]
        };
     
        var icon = new OpenLayers.Icon("themes/images/icon_movi.png");
        map = new OpenLayers.Map( 'map',options );
        map.addLayer(new OpenLayers.Layer.OSM());
        ourpoint = new OpenLayers.LonLat(  coordenadas[1],coordenadas[0]);
        ourpoint.transform(new OpenLayers.Projection("EPSG:4326" ), map.getProjectionObject());
        map.setCenter(ourpoint, 17);
    
                
        var zoom=16;
        var markers = new OpenLayers.Layer.Markers( "Markers" );
        map.addLayer(markers); 
        markers.addMarker(new OpenLayers.Marker(ourpoint,icon)); 
        map.setCenter (ourpoint, zoom);
    }catch(ex){
        document.getElementById("map").innerHTML = "Sin conexion a open street maps";
        console.log("No se puede cargar el mapa");
    }*/
    
    
}



function getJson(){
    document.getElementById("centros_div").innerHTML = "";
    $.ajax({
        type: "GET",
        //url: "http://172.16.57.12:8080/MoviRest/ciudades.json",
        url:"js/ciudades.json",
        async: false,
        dataType: "json",
        success: function(data){
            ciudades = data.ciudades;       
            for(var i = 0; i < data.ciudades.length;i++ ){
                document.getElementById("centros_div").innerHTML +=
                "<li id=\""+i+"\" data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\""+
                "data-iconsize=\"18\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\""+
                "data-theme=\"a\" class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-corner-top ui-btn-up-a\">"+
                "<div class=\"ui-btn-inner ui-li ui-corner-top\"><div class=\"ui-btn-text\">"+
                "<a href=\"#locales\" class=\"ui-link-inherit\">"+data.ciudades[i].nombre+"</a></div><span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow ui-iconsize-18\">"+
                "·&nbsp;</span></div></li>"
                    
                    
                
            /*"<li data-theme=\"\" id=\""+i+"\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\""+
                " class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c\">"+
                "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\"><a href=\"#locales\""+
                "class=\"ui-link-inherit\">"+data.ciudades[i].nombre+"</a></div>"+
                "<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";*/
                  
                            
            }
                       
        }
    });
}

