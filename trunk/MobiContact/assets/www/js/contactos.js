/*
 * Evento inicial al presionar el boton de convertir contactos
 */
$("#contactos").live("pageshow", function(prepage) {
    $( "#actualizar" ).bind( "click", function(event, ui) {
        confirmarCambio();
    });
});

var my_div = null;
var contactosTodos = [];
var guardado = false;
            
function actualizarContactos() {
    var options = new ContactFindOptions();
    var contactosTodos;
    var indices=[];
    var numerosModificados = 0;
                
    options.filter="";
    options.multiple=true; 
    filter = ["id", "displayName", "name", "nickname", "phoneNumbers", "emails", "addresses",
    "ims", "organizations", "birthday", "note", "photos", "categories", "urls"];
    navigator.contacts.find(filter,onContactsSuccess, options);
                
    function onContactsSuccess(contacts) {                    
        contactosTodos = contacts;
        var lista="";
        if(contacts.length>0){
            for (var i=0; i<contacts.length; i++) {
                var modificado = false;
                if(contacts[i].phoneNumbers!=null)
                    for (var j=0; j<contacts[i].phoneNumbers.length; j++) {                                    
                        var numeroAnterior = filtrarNumeros(contacts[i].phoneNumbers[j].value);
                        var nuevoNumero = validarNumero(contacts[i].phoneNumbers[j].value);
                        if(numeroAnterior!=nuevoNumero){
                            contactosTodos[i].phoneNumbers[j] = new ContactField(contacts[i].phoneNumbers[j].type, nuevoNumero, true);                                        
                            lista += "<li class=\"ui-li ui-li-static ui-body-c ui-corner-bottom\">"+
                            "<img style=\"width: 60px; height: px\" src=\"themes/images/sim_icon2.png\" />"+
                            "<h3 class=\"ui-li-heading\">"+contacts[i].displayName+"</h3>"+
                            "<p class=\"ui-li-desc\"><strong>"+contacts[i].phoneNumbers[j].value+"</strong></p>"+
                            "</li>";
                        //document.getElementById("contacts_div").innerHTML = lista
                            $("#listaContactos").html(lista);
                            $("#listaContactos").listview("refresh");      
                            modificado = true;
                        }
                                
                    }
                if(modificado){
                    contacts[i].remove(onRemoveSuccess,onRemoveError);
                    indices[numerosModificados]=i;
                    numerosModificados++;
                }
            }
        }else{
            alert("No se encontraron contatos en su dispositivo!");
        }
        alert(contactosTodos.length+" encontactos");
        for(var i=0;i<indices.length;i++){
            var ind = indices[i];
            var contact = navigator.contacts.create();
            if(contactosTodos[ind].displayName!="undefined")
                contact.displayName = contactosTodos[ind].displayName;
            if(contactosTodos[ind].givenName!="undefined")
                contact.givenName = contactosTodos[ind].givenName;
            if(contactosTodos[ind].familyName!="undefined")
                contact.familyName = contactosTodos[ind].familyName;
            if(contactosTodos[ind].nickname!=null)
                contact.nickname = contactosTodos[ind].nickname;
            if(contactosTodos[ind].phoneNumbers!=null)
                contact.phoneNumbers =contactosTodos[ind].phoneNumbers;
            if(contactosTodos[ind].emails!=null)
                contact.emails = contactosTodos[ind].emails;
            if(contactosTodos[ind].addresses!=null)
                contact.addresses = contactosTodos[ind].addresses;
            if(contactosTodos[ind].ims!=null)
                contact.ims = contactosTodos[ind].ims;
            if(contactosTodos[ind].organizations!=null)
                contact.organizations = contactosTodos[ind].organizations;
            if(contactosTodos[ind].birthday!=null)
                contact.birthday = contactosTodos[ind].birthday;
            if(contactosTodos[ind].note!=null)
                contact.note = contactosTodos[ind].note;
            if(contactosTodos[ind].photos!=null)
                contact.photos = contactosTodos[ind].photos;
            if(contactosTodos[ind].categories!=null)
                contact.categories = contactosTodos[ind].categories;
            if(contactosTodos[ind].urls!=null)
                contact.urls = contactosTodos[ind].urls;
            contact.save(onSaveSuccess,onSaveError);
        }
        alert(numerosModificados+" numeros actualizados");
    }
}
            
function onSaveSuccess(contact) {
                
}

function onSaveError(contact) {
    alert("guardado"+contact.displayName);
}
            
function onRemoveSuccess(contact) {
    return true;
}

function onRemoveError(contactError) {
    alert("remove: "+contactError);
}
            
function onConfirm(buttonIndex){
    if(buttonIndex==2){
        actualizarContactos()
    }else{
        alert("No se realizo ningun cambio");
    }        
}
            
function confirmarCambio(){
    navigator.notification.confirm('Se actualizaran sus contactos!',
        onConfirm,'Contactos','Cancelar,Ok');
}           
            
//recive el numero verifica caracteres, serie internacional, local, nueva serie y
//devuelve el mismo numero onuevo segun sea el caso
function validarNumero(mobile){ 
    mobile = filtrarNumeros(mobile);
    if(isInternacional(mobile)){
        mobile = mobile.substr((mobile.length-8)), (mobile.length);
        if(!isConvencional(mobile)){
            mobile = "09"+mobile.substr((mobile.length-8), mobile.length);//.substr((mobile.length-8), mobile.length);
        }else{
            mobile = "0"+mobile.substr((mobile.length-8), mobile.length);//.substr((mobile.length-8), mobile.length);
        }
    }else{
        if(mobile.length<10){
            if(!isConvencional(mobile)){
                mobile = "09"+mobile.substr((mobile.length-8), mobile.length);//.substr((mobile.length-8), mobile.length);
            }else{
                mobile = "0"+mobile.substr((mobile.length-8), mobile.length);//.substr((mobile.length-8), mobile.length);
            }
        }
    }
    return mobile;
}            
            
//Recibe el numero en cualquier formato y devuelve solo los numeros 
//ej. recive (593)9-5543-123 y devuelve 59395543123
function filtrarNumeros(numero){
    var n=numero.split("");
    var mobile = null;                
    for(var i = n.length;i>=0;i--){ 
        if(n[i]!=" ")
            if((!isNaN(n[i]))|( n[i]=="0")){
                if(mobile!=null){
                    mobile=n[i]+mobile; 
                }else{
                    mobile=n[i];
                }          
            }                     
    }
    return mobile;
}
            
//verifica si esta en formato internacional y si la serie corresponde a Ecuador
function isInternacional(numero){
    if(numero.substr(0, 3)=="593" & numero.length>10){
        return true;
    }else{
        return false;
    } 
}
            
//verifica si el telefono es convencional
function isConvencional(numero){
    numero = numero.substr((numero.length-8), numero.length);
    var isConvencional = false;                
    var series=new Array("22","32","42","52","62","72");
    var serie = numero.substr(0, 2);
    for(var i = 0; i< series.length;i++){
        if(serie==series[i]){
            isConvencional =true;
            break;
        }else{
            isConvencional =false;
        }
    }
    return isConvencional ;
}
