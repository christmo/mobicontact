/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var ciudadActual;
var ciudades = [];

$("#centros").live("pageshow", function(prepage) {
    
    getJson();
    
});

$("#centros ul li").live("click",function(evt){
    indActual = $(this).attr("id");
    $.mobile.changePage("#locales","slide",false,true);
    evt.preventDefault();
});

$("#locales").live("pageshow",function(){
    
    var localesHtml = "";
    for(var i = 0; i<ciudades[indActual].locales.length;i++){
        localesHtml += "<li id=\""+i+"\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\""+
                    " data-theme=\"a\" class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c\">"+
                    "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\"><a href=\"#\""+
                    "class=\"ui-link-inherit\">"+ciudades[indActual].locales[i].key+"</a></div>"+
                    "<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";
    }
    $(".locales").html(localesHtml);
});
    
   



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
                    " data-theme=\"a\" class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c\">"+
                    "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\"><a href=\"#\""+
                    "class=\"ui-link-inherit\">"+data.ciudades[i].nombre+"</a></div>"+
                    "<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";
                  
                            
            }
                       
        }
    });
}