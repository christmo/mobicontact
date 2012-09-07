/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var ciudades = [];
var layerLugares;
var zoom=7;
var lat = -1.9912;
var lon = -79.20733;
var map;

$("#main").live("pageshow", function(prepage) {
    obtenerSitios();    
    init();
});

function dibujarSitios(data){
    for(var i=0;i<data.sitios.length;i++){
        graficarIcon(data.sitios[i]);
    }
}

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
    return new OpenLayers.Map(div, options);
}

function init(){
    document.getElementById("map").innerHTML = "";
    
    map = crearMapa('map');
    
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
        mail: '\${mail}',
        foto: '\${foto}',
        
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

    map.addLayer(new OpenLayers.Layer.OSM());
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
}


function graficarIcon(sitio){
    var dibujoLugar = null;

    var x = sitio.longitud;
    var y = sitio.latitud;

    // Posicion lon : lat
    var point = new OpenLayers.Geometry.Point( x, y );
    // Transformacion de coordendas
    point.transform( new OpenLayers.Projection( 'EPSG:4326' ),
        new OpenLayers.Projection( 'EPSG:900913' ) );

    dibujoLugar = new OpenLayers.Feature.Vector( point, {
        img: 'css/images/house.png',
        wd: "50",
        hg: "50",
        
        id: sitio.id,
        nombre : sitio.nombre,
        dir : sitio.direccion,
        tel : sitio.telefono,
        tipo : sitio.tipo,
        precio : sitio.precio,
        lon: sitio.longitud,
        lat: sitio.latitud,
        mail: sitio.mail_contacto,
        foto: "fotos/"+sitio.foto,

        favColor : 'blue',
        align: 'lt',
        poppedup : false
    });

    // Se coloca el ID de sitio a la imagen
    dibujoLugar.id = "S"+sitio.id;

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
    $('#foto').attr('src',feature.data.foto);
    $('#nombre').html(feature.data.nombre);
    $('#dir').html(feature.data.dir);
    $('#tel').html(feature.data.tel);
    $('#mail').html(feature.data.mail);
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

function obtenerSitios(){
    $.ajax({
        type: "GET",
        url: "php/getData.php",
        async: true,
        dataType: "json",
        success: function(data){
            dibujarSitios(data);
        },
        error:function(){
            console.log("Error");
        }
    });
}