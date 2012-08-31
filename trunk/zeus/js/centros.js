/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var ciudades = [];
var layerLugares;
var zoom=12;
var lat = -3.9912;
var lon = -79.20733;
var map;

$("#main").live("pageshow", function(prepage) {
    
    //getJson();
    init("-3.9912,-79.20733");
    
});

function crearMapa(div){
    var extent = new OpenLayers.Bounds();
    extent.extend(new OpenLayers.LonLat(-94.68966,4.61535));
    extent.extend(new OpenLayers.LonLat(-65.35617, -17.51253));

    extent.transform( new OpenLayers.Projection( 'EPSG:4326' ),
        new OpenLayers.Projection( 'EPSG:900913' ));
    
    // Mapa
    var options = {
        controls : [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
        new OpenLayers.Control.KeyboardDefaults(),
        //        new OpenLayers.Control.LayerSwitcher()
        ],
        units: 'm',
        numZoomLevels : 19,
        maxResolution : 'auto',
        restrictedExtent : extent
    };
    
    //    var coordenadas = position.split(",");
    return new OpenLayers.Map(div, options);
}

function init(position){
    document.getElementById("map").innerHTML = "";
    
    map = crearMapa('map');
    //    map = new OpenLayers.Map( 'map' );
    //    map.addLayer(new OpenLayers.Layer.OSM());
    //    ourpoint = new OpenLayers.LonLat(  coordenadas[1],coordenadas[0]);
    //    ourpoint.transform(new OpenLayers.Projection("EPSG:4326" ), map.getProjectionObject());
    //    map.setCenter(ourpoint, 17);
                
    //    var zoom=16;
    //    var markers = new OpenLayers.Layer.Markers( "Markers" );
    //    map.addLayer(markers); 
    //    markers.addMarker(new OpenLayers.Marker(ourpoint)); 
    //    map.setCenter (ourpoint, zoom);
    
    var styleLienzo = new OpenLayers.StyleMap( {
        externalGraphic : '\${img}',
        graphicWidth : '\${wd}',
        graphicHeight : '\${hg}',
        fillOpacity : 0.85,
        
        id : '\${id}',
        nombre : '\${nombre}',
        dir : '\${dir}',
        tel : '\${tel}',
        precio : '\${precio}',
        tipo : '\${tipo}',
        lon: '\${lon}',
        lat: '\${lat}',
        
        label : '..\${nombre}',
        fontColor: '\${favColor}',
        fontSize: '12px',
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold',
        labelAlign: '\${align}',
        labelOffset: new OpenLayers.Pixel(0,-20)
    });
    
    layerLugares = new OpenLayers.Layer.Vector( 'Lugares', {
        styleMap : styleLienzo
    });   
    layerLugares.id = 'Lugares';

    map.addLayer(new OpenLayers.Layer.OSM());
    map.addLayer( layerLugares );
    
    layerLugares.setVisibility(true);
    var selectFeatures = new OpenLayers.Control.SelectFeature(
        [ layerLugares ],
        {
            clickout: true,
            toggle: false,
            multiple: false,
            hover : false,
            onSelect : function(feature){
                onPuntoSelect(feature );
            },
            onUnselect : function(feature){
            //no hacer nada
            }
        });

    map.addControl( selectFeatures );
    selectFeatures.activate();
    
    var lonLat = new OpenLayers.LonLat( lon,lat ).transform(
        new OpenLayers.Projection( 'EPSG:4326' ),
        map.getProjectionObject() );

    map.setCenter ( lonLat, zoom );
    graficarIcon(position);
}


function graficarIcon(position){
    var dibujoLugar = null;
    var idLugar = 'L1';
    
    //Extracción dependiendo del Layer
    dibujoLugar = layerLugares.getFeatureById( idLugar );
    // Coordenadas
    var coordenadas = position.split(",");

    var x = coordenadas[1];
    var y = coordenadas[0];

    // Posici�n lon : lat
    var point = new OpenLayers.Geometry.Point( x, y );
    // Transformaci�n de coordendas
    point.transform( new OpenLayers.Projection( 'EPSG:4326' ),
        new OpenLayers.Projection( 'EPSG:900913' ) );

    dibujoLugar = new OpenLayers.Feature.Vector( point, {
        img: 'css/images/icon-pc-movistar.png',
        wd: "50",
        hg: "50",
        
        id: "id",
        nombre : "Nombre",
        dir : "Direccion",
        tel : "Telefono",
        tipo : "Tipo Arriendo o Venta",
        precio : "Precio",
        lon: "lon",
        lat: "lat",

        favColor : 'blue',
        align: 'lt',
        poppedup : false
    });

    // Se coloca el ID de veh�culo a la imagen
    dibujoLugar.id = 'L1';

    //Se añade a la capa que corresponda
    layerLugares.addFeatures( [dibujoLugar] );
}

function onPuntoSelect(feature){
    //    var popup = new OpenLayers.Popup.AnchoredBubble( null,
    //        new OpenLayers.LonLat( feature.geometry.x, feature.geometry.y ),
    //        null,
    //        '<div style=\'font-size:.8em; width:150px\'><b>Mensaje</b></div>'
    //        ,
    //        null, true,  function () {
    //            onClosePopUp( feature )
    //        });
    //    popup.autoSize= true;
    //    popup.setBackgroundColor('#E8FFD4');
    //
    //    feature.popup = popup;
    //    feature.attributes.poppedup = true;
    //    map.addPopup( popup );
    console.log(feature);
    $.mobile.changePage("#info","slide",false,true);
    $('#foto').attr('src',feature.data.img);
    $('#nombre').html(feature.data.nombre);
    $('#dir').html(feature.data.dir);
    $('#tel').html(feature.data.tel);
    $('#tipo').html(feature.data.tipo);
    $('#lon').html(feature.data.lon);
    $('#lat').html(feature.data.lat);
    $('#precio').html(feature.data.precio);
}

function onClosePopUp(feature){
    map.removePopup( feature.popup );
    feature.popup.destroy();
    feature.attributes.poppedup = false;
    feature.popup = null;
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


//
//$("#centros ul li").live("click",function(evt){
//    indActual = $(this).attr("id");
//    $.mobile.changePage("#locales","slide",false,true);
//    
//});

//$("#locales").live("pageshow",function(){
//    $(".inner").html("<p>"+ciudades[indActual].nombre+"</p>");
//    var localesHtml = "";
//    for(var i = 0; i<ciudades[indActual].locales.length;i++){
//        var mlocal = ciudades[indActual].locales[i];
//       
//        localesHtml += "<li id=\""+i+"\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\""+
//        " class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c\">"+
//        "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\"><a href=\"#\""+
//        "class=\"ui-link-inherit\">"+mlocal.nombre+"</a></div>"+
//        "<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";
//    }
//    $(".locales").html(localesHtml);
//});
//    
//$("#locales div li").live("click",function(evt){
//    indLocal = $(this).attr("id");
//    $.mobile.changePage("#mapa","slide",false,true);
//    
//}); 

//
//$("#mapa").live("pageshow",function(){
//    $(".nombre_local").html("");
//    $(".nombre_local").html("<h4>"+ciudades[indActual].locales[indLocal].nombre+"</h4>");
//    init(ciudades[indActual].locales[indLocal].coordenadas);
//    
//});

