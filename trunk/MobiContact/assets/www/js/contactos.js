/*
 * Evento inicial al presionar el boton de convertir contactos
 */


$("#contactos").live("pageshow", function(prepage) {
    $( "#actualizar" ).bind( "click", function(event, ui) {
        event.preventDefault();
        try{
            confirmarCambio(); 
        }catch(err){
            console.log(err);
        }
        
    });
    
    $( "#restaurar" ).bind( "click", function(event, ui) {
        event.preventDefault();
        
        alert("se restauraran sus contactos");
        document.getElementById("status").innerHTML = "Restaurando..";
        
        try{
            borrarContactos();
            
            document.getElementById("status").innerHTML = "";
        }catch(err){
            console.log(err);
        }
        
    });
    
});

var my_div = null;
var contactosTodos = [];
var respaldos = [];
var guardado = false;
var db_contacts =  window.openDatabase("test", "1.0", "Test DB", 1000000);


// Query the database
//
function restaurar() {
    
    db_contacts.transaction(queryDB, errorCB);
}
function queryDB(tx) {
    tx.executeSql('SELECT * FROM CONTACTS', [], querySuccess, errorCB);
}
// Query the success callback
//
function querySuccess(tx, results) {
    var numbers = [];
    var emails = [];
    // var direcciones = [];
    console.log("Celdas encontradas = " + results.rows.length);
    if(results.rows.length>0){
        for(var i=0;i<results.rows.length;i++){
            var contacto = navigator.contacts.create();
            var name = new ContactName();
            var nombre = results.rows.item(i).nombre   
            var apellido = results.rows.item(i).apellido;
            name.givenName = nombre ;
            name.familyName = apellido;
            contacto.name = name;
            contacto.displayName = contacto.name.givenName +" "+ contacto.name.familyName;
            console.log(contacto.displayName);
            if(results.rows.item(i).numeros!=null){
                var numeros = results.rows.item(i).numeros.split(",");
                for(var j = 0; j<numeros.length;j++){
                        console.log(numeros[j]);
                        numbers[j]= new ContactField('home', numeros[j] , true);
                    
                }
                
            }  
            contacto.phoneNumbers = numbers;
            if(results.rows.item(i).emails!=null){
                var lst_emails = results.rows.item(i).emails.split(",");
                for(var k = 0; k<lst_emails.length;k++){
                    
                    emails[k]= new ContactField('home', lst_emails[k] , true);
                        
                    
                }
                
            } 
            
            /*if(results.rows.item(i).direcciones!=null){
                var lst_direcciones = results.rows.item(i).direcciones.split(",");
                console.log("direcciones "+lst_emails.length);
                for(var l = 0; l<lst_direcciones.length;l++){
                    if(lst_direcciones[l]!=""){
                        direcciones[l]= new ContactAddress('home', lst_direcciones[l] , true);
                        console.log(lst_direcciones[l]);
                    }
                }
                
            } */
            
            //contacto.addresses = direcciones;
            contacto.emails = emails;
            contacto.save(onSaveSuccess,onSaveError);
        //contacto = null;
        }
        
        alert("Contactos restaurados!");
    }else{
        alert("Debe actualizar sus contactos primero");
    }
}

function errorCB(tx, err) {
    console.log("Error  SQL: "+err);
// alert("Error processing SQL: "+err);
}

 
 
function borrarContactos(){
    var options = new ContactFindOptions();
    options.filter="";
    options.multiple=true; 
    filter = ["id", "displayName", "name", "nickname", "phoneNumbers", "emails", "addresses",
    "ims", "organizations", "birthday", "note", "photos", "categories", "urls"];
    navigator.contacts.find(filter,onContactsSuccess, onContactsError, options);
    
    
    function onContactsSuccess(neoContacts) {
        console.log("entro a borrar..");
        //var nContactos;
        //nContactos = contacts.length
        for (var i=0; i<neoContacts.length; i++) {
            console.log("va a borrar "+neoContacts[i].name.givenName);
            neoContacts[i].remove(onRemoveSuccess,onRemoveError);
            
        }
        restaurar(); 
        
        alert("borrados!");
        
        borrados = true;
        console.log("borrados");
    };
    // onError: Failed to get the contacts
    //
    function onContactsError(contactError) {
        console.log('onError!'+ contactError);
    }
    
    function onRemoveSuccess(contact) {
        console.log('removed'+ contact);
        
    }
    
    function onRemoveError(contact) {
        console.log('removed Error'+ contact);
        
    }
                
}
 
function actualizarContactos() {
    var options = new ContactFindOptions();
    var contactosTodos;
    var indices=[];
    var numerosModificados = 0;
                
    options.filter="";
    options.multiple=true; 
    filter = ["id","displayName" ,"nickname","name", "phoneNumbers", "emails", "addresses",
    "ims", "organizations", "birthday", "note", "photos", "categories", "urls"];
    navigator.contacts.find(filter,onContactsSuccess,onContactsError, options);
    
    
            
                
    function onContactsSuccess(contacts) { 
        
        
        for (j = 0; j < contacts.length; j++) {
            respaldos[j] = contacts[j].clone();
        }
        respaldarContactos(respaldos);
        
        contactosTodos = contacts;
        
        var lista="";
        if(contacts.length>0){
            for (var i=0; i<contacts.length; i++) {
                console.log("respaldo---> "+respaldos[i].phoneNumbers[0].value);
                var modificado = false;
                if(contacts[i].phoneNumbers!=null)
                    for (var j=0; j<contacts[i].phoneNumbers.length; j++) {                                    
                        var numeroAnterior = filtrarNumeros(contacts[i].phoneNumbers[j].value);
                        var nuevoNumero = validarNumero(contacts[i].phoneNumbers[j].value);
                        if(numeroAnterior!=nuevoNumero){
                            contactosTodos[i].phoneNumbers[j] = new ContactField(contacts[i].phoneNumbers[j].type, nuevoNumero, true);                                        
                            lista += "<li class=\"ui-li ui-li-static ui-body-c ui-corner-bottom\">"+
                            "<h3 class=\"ui-li-heading\">"+contacts[i].name.givenName+" "+contacts[i].name.familyName+"</h3>"+
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
        if(contactosTodos.length>0){
            alert(contactosTodos.length+" encontactos");
        }
        for(var i=0;i<indices.length;i++){
            var ind = indices[i];
            var contact = navigator.contacts.create();
            if(contactosTodos[ind].name!=null)
                contact.name = contactosTodos[ind].name;
            if(contactosTodos[ind].displayName!=null)
                contact.displayName= contactosTodos[ind].displayName;
            if(contactosTodos[ind].nickName!=null)
                contact.nickName = contactosTodos[ind].nickName;
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
        if(contactosTodos.length>0){
            alert(numerosModificados+" numeros actualizados");
        }
        
    }
    
    function onContactsError(contactsError){
        alert(contactsError);
    }
}
 
function respaldarContactos(respaldos){
    var ind = respaldos.length;
    var contactos = respaldos;
    console.log(contactos);
    db_contacts.transaction(populateDB, errorCB, successCB);
     
     
    function populateDB(tx) {
        console.log("va a guardar "+contactos);
        tx.executeSql('DROP TABLE IF EXISTS CONTACTS');
        console.log("drop sucess ");
        tx.executeSql('CREATE TABLE IF NOT EXISTS CONTACTS (id unique, nombre, apellido, numeros, emails, direcciones)');
        console.log("create table sucess ");
        console.log("contactos "+ind);
        for (var g=0; g<contactos.length; g++) {
            var numeros = "";
            var emails = "";
            var direcciones = "";
            if(contactos[g].phoneNumbers!=null){
                for(var i=0; i<contactos[g].phoneNumbers.length; i++){
                    numeros+=contactos[g].phoneNumbers[i].value+",";
                }
            }
            if(contactos[g].emails!=null){
                for(i=0; i<contactos[g].emails.length; i++){
                    emails+=contactos[g].emails[i].value+",";
                }
            }
            if(contactos[g].addresses!=null){
                for(i=0; i<contactos[g].addresses.length; i++){
                    direcciones+=contactos[g].addresses[i].value+",";
                }
            }
            console.log(numeros);
            console.log(emails);
            console.log(direcciones);
            console.log("guardando "+contactos[g].name.givenName);
            
            console.log('INSERT INTO CONTACTS  (id , nombre, apellido, numeros, emails, direcciones) VALUES ('+g+', "'+contactos[g].name.givenName+'", "'+contactos[g].name.familyName+'", "'+numeros+'", "'+emails+'", "'+direcciones+'")');
            
            tx.executeSql('INSERT INTO CONTACTS  (id , nombre, apellido, numeros, emails, direcciones) VALUES ('+g+', "'+contactos[g].name.givenName+'", "'+contactos[g].name.familyName+'", "'+numeros+'", "'+emails+'", "'+direcciones+'")'); 
        }
    }

    // Transaction error callback
    //
    function errorCB(tx, err) {
        console.log("Error  SQL: "+err);
    // alert("Error processing SQL: "+err);
    }

    // Transaction success callback
    //
    function successCB() {
        console.log("guardado en base de datos");
    //alert("success!");
    }
}
 
function onSaveSuccess(contact) {
    console.log("Guardado "+contact);       
}

function onSaveError(contact) {
    console.log("guardado "+contact);
}
            
function onRemoveSuccess(contact) {
    
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
   
   
   
function isConvencional(numero){
    var numero2 = numero.substr((numero.length-8), numero.length);
    var isConvencional = false;                
    var series=new Array("22","32","42","52","62","72");
    var serie = numero2.substr(0, 2);
    for(var i = 0; i< series.length;i++){
        if(serie==series[i]){
            isConvencional =true;
            break;
        }else{
            isConvencional =false;
        }
    }
    
    var cad = numero;
    var coddos = cad.substring(0,2);
    var codtres = cad.substring(0,3);
    if (coddos == "09"|coddos == "08"|codtres == "039"|codtres == "059"|codtres == "069"|codtres == "079") {                
                        
        //alert('concatenado= '+ clone.phoneNumbers[j].value);
        isConvencional =false;
                    
    }else{
        isConvencional =true;
    }
        
                
    return isConvencional ;
}   
//verifica si el telefono es convencional
/*function isConvencional(numero){
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
}*/
