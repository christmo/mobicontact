/*
 * Actualizacion, respaldo y restauracion  de numeros de contactos
 */

var lista="";
var respaldos = [];
var maxprogress = 0;   // total de status
var actualprogress = 0;  // progrso actual
var progressnum = document.getElementById("progressnum");//div con numero de avance
var indicator = document.getElementById("indicator");//barra de progreso
var db_contacts =  window.openDatabase("test", "1.0", "Test DB", 1000000);//sqlite para almacenamiento de numeros

//evento navegar a la pagina de contactos 
$("#contactos").live("pageshow", function(prepage) {
    
    //reinicio de parametros
    lista="";

    maxprogress = 0;   
    actualprogress = 0;  

    showButtons();
    document.getElementById("listaContactos").innerHTML = "";
    document.getElementById("estado").innerHTML = "";
    
});

//evento de boton actualizar
$( "#actualizar" ).bind( "click", function(event, ui) {
    
    event.preventDefault();
    try{
        confirmarCambio(); 
    }catch(err){
        console.log(err);
    }
        
});


//evento de boton restaurar
$( "#restaurar" ).bind( "click", function(event, ui) {
    event.preventDefault();
        
    try{
        confirmaRestaurar();
        
    }catch(err){
        console.log(err);
    }
        
});

function hideStatus(){
    maxprogress = 0;   // total to reach
    actualprogress = 0;  // current value
    itv = 0; 
    indicator.style.width= "0px";
    progressnum.innerHTML = "Buscando.. ";
    document.getElementById('status_div').style.display = 'none'; 
}

function showStatus(){
    document.getElementById('status_div').style.display = 'inline'; 
}

function hiddeButtons(){
    document.getElementById('botones').style.display = 'none'; 
    
}
            
function showButtons(){
    document.getElementById('botones').style.display = 'inline'; 
}

function onConfirmStatus(){
    progressnum.innerHTML = "Actualizando...";
}

function actualizarContactos() {
    showStatus();
    hiddeButtons();
    
    document.getElementById("estado").innerHTML = "";
    document.getElementById("listaContactos").innerHTML = "";
    lista="";
    console.log("-------------------------------va a buscar contactos---------------------------------");
    
            
    var options = new ContactFindOptions();
                
    options.filter="";
    options.multiple=true; 
    filter = ["id","displayName" ,"nickname","name", "phoneNumbers", "emails", "addresses",
    "ims", "organizations", "birthday", "note", "photos", "categories", "urls"];
    
    navigator.contacts.find(filter,onContactsSuccess,onContactsError, options);
    
    
    
    
    function onContactsSuccess(contacts) { 
        var nuevos_numeros = [];
        var posicion = 0;
        var modificados = 0;
        respaldos = [];
        var id_contactos =[];
        
        console.log("-------------------------------encontro"+contacts.length+"---------------------------------");
        
        if(contacts.length>0){
            
            //Recorre todos los contactos del directorio
            for (var i=0; i<contacts.length; i++) {
                progressnum.innerHTML = contacts.length+ " contactos";
                
                nuevos_numeros = [];
                var modificado = false;
                if(contacts[i].phoneNumbers!=null){
                    posicion = 0;
                    for (var j=0; j<contacts[i].phoneNumbers.length; j++) {
                        var numeroAnterior = filtrarNumeros(contacts[i].phoneNumbers[j].value);
                        
                        var nuevoNumero = validarNumero(contacts[i].phoneNumbers[j].value);
                        console.log("De "+numeroAnterior+" a "+nuevoNumero);
                        if(numeroAnterior!=nuevoNumero){
                            if(nuevoNumero.length>10){
                                nuevoNumero = "+"+nuevoNumero;
                            }  
                            modificado = true;
                            
                            console.log("contacto "+i+" numero "+j+ " pos "+ posicion);
                            
                         
                            nuevos_numeros[posicion] = new ContactField(contacts[i].phoneNumbers[j].type, nuevoNumero, false);                                        
                            
                            //almacena una muestra de solo 10 contactos en html
                            if(posicion<10){
                                lista += "<li class=\"ui-li ui-li-static ui-body-c ui-corner-bottom\">"+
                                "<h3 class=\"ui-li-heading\">"+contacts[i].name.givenName+" "+contacts[i].name.familyName+"</h3>"+
                                "<p class=\"ui-li-desc\"><strong>"+nuevoNumero+"</strong></p>"+
                                "</li>";
                            }
                            posicion++;
                            
                        }else{
                            if(modificado){
                                nuevos_numeros[posicion] = new ContactField(contacts[i].phoneNumbers[j].type, numeroAnterior, false);                                        
                                posicion++;
                            }
                        
                        }     
                    }
                }                    
                
                //recorre todos los numeros de cada contacto
                
                 
                //si el contacto fue modificado actualiza los numeros
                if(modificado){
                    respaldos[modificados] = contacts[i].clone();
                    id_contactos[modificados] = contacts[i].id;
                    modificados++;
                    console.log("---------id: "+contacts[i].id);
                    contacts[i].phoneNumbers = [];
                    contacts[i].save(onSaveSuccess,onSaveError);
                    console.log(posicion.toString());
                    console.log(contacts[i].phoneNumbers);
                    contacts[i].phoneNumbers  = nuevos_numeros;
                    contacts[i].save(onSaveNumberSuccess,onSaveError);
                    console.log(contacts[i].phoneNumbers);
                }
                
            //fin del barrido de contactos
            }
          
            // si existen indices en la lista se procede a guardarlos en la base de datos
            if(modificados>0){
                progressnum.innerHTML = "Buscando...";
                maxprogress = modificados;
                navigator.notification.confirm(modificados+' numeros serán modificados',
                    onConfirmStatus,'Contactos','Aceptar');
                
                respaldarContacto(respaldos,id_contactos);
                progressnum.innerHTML = "Actualizando.." ;
                console.log("--------------------------- va a guardar nuevos contactos -------------------------");
                document.getElementById("estado").innerHTML = "Muestra de números de teléfono actualizados:";
            
            }else{
                //si no hay indices pero si contactos en el telefono la agenda esta actualizada
                if(contacts.length>0){
                    navigator.notification.confirm('Su directorio esta actualizado!',
                        onConfirmNoAction,'Contactos','Aceptar');
                    showButtons();
                    hideStatus();
                
                }
            
            }
        }else{
            navigator.notification.confirm('No se encontraron contatos en su dispositivo!',
                onConfirmNoAction,'Contactos','Aceptar');
            
        }
    }
    
    
    function onContactsError(contactsError){
        console.log("Error buscando contactos"+contactsError);
    }
    
    function onConfirmNoAction(){
        console.log("Usuario confirma");
    }
}

function respaldarContacto(respaldo, id_contactos){
    
    var ind = respaldos.length;
    var contacto = respaldo;
    console.log(contactos);
    db_contacts.transaction(populateDB, errorCB);
     
     
    function populateDB(tx) {
        console.log("va a guardar "+contacto);
        tx.executeSql('DROP TABLE IF EXISTS CONTACTS');
        console.log("drop sucess ");
        tx.executeSql('CREATE TABLE IF NOT EXISTS CONTACTS (id,nombre, apellido, numeros)');
        console.log("create table sucess ");
        console.log("contactos "+ind);
        var numeros = "";
        for(var j = 0; j < contacto.length;j++){
            if(contacto[j].phoneNumbers!=null){
                for(var i=0; i<contacto[j].phoneNumbers.length; i++){
                    numeros+=contacto[j].phoneNumbers[i].value+",";
                }
            }
            
            console.log(numeros);
            
            console.log('INSERT INTO CONTACTS  (id, nombre, apellido, numeros) VALUES ("'+id_contactos[j]+'", "'+contacto[j].name.givenName+'", "'+contacto[j].name.familyName+'", "'+numeros+'")');
            
            tx.executeSql('INSERT INTO CONTACTS  (id, nombre, apellido, numeros) VALUES ( "'+id_contactos[j]+'","'+contacto[j].name.givenName+'", "'+contacto[j].name.familyName+'", "'+numeros+'")'); 
            numeros = "";
            
        }
    }

    // Transaction error callback
    //
    function errorCB(tx, err) {
        alert("No pudimos encontrar respaldos");
        console.log("Error  SQL: "+err);
        
    }
    
    
}

function restaurar() {
    
    document.getElementById("estado").innerHTML = "";
    document.getElementById("listaContactos").innerHTML = "";
    lista="";
    hiddeButtons();
    showStatus();
    document.getElementById("listaContactos").innerHTML = "";
    try{
        db_contacts.transaction(queryRestaurar, errorCB);
    }catch(ex){
        console.log(ex);
    }
    
    
    function queryRestaurar(tx) {
        try{
            tx.executeSql('SELECT * FROM CONTACTS', [], querySuccessRestaurar, RestaurarErrorCB);
        }catch(ex){
            console.log("extraer contactos-----------------> "+ex);
        
            alert("No existen datos");
        }
        
        
    
    }
    
    function RestaurarErrorCB(tx, err) {
        alert("No pudimos encontrar respaldos");
        console.log("Error  SQL: "+err);
    
    }
    
    function querySuccessRestaurar(tx, results) {
        document.getElementById("estado").innerHTML = "Muestra de números de teléfono Restaurados:";
        console.log("---------------------Encontre  "+results.rows.length+" contactos---------------");
        maxprogress = results.rows.length;
        for(var j = 0; j<results.rows.length;j++){
            restaurarContacto(results.rows.item(j).id, 
                results.rows.item(j).nombre,
                results.rows.item(j).apellido,
                results.rows.item(j).numeros);
        }
    }
    
    function restaurarContacto(id,nombre,apellido,numbers){
        var options = new ContactFindOptions();
        var numeros = [];
        var ind = 0;
        var lst_numeros = numbers.split(",");
        
        for(var k = 0; k < lst_numeros.length; k++){
            if(lst_numeros[k]!=null&lst_numeros[k].length>7){
                var numero = lst_numeros[k];
                console.log(numero);
                numeros[ind] = new ContactField("home",numero , true);
                if(ind<10){
                    lista+="<li class=\"ui-li ui-li-static ui-body-c ui-corner-bottom\">"+
                    "<h3 class=\"ui-li-heading\">"+nombre+" "+apellido+"</h3>"+
                    "<p class=\"ui-li-desc\"><strong>"+numero+"</strong></p>"+
                    "</li>";
                }
               
                ind++;
            }
        }
        console.log("salio de parse numbers--------------");
        options.filter=id;
        options.multiple=false; 
        var fields  = ["id","name"];
    
        navigator.contacts.find(fields ,onFindSuccess,onFindError, options);
        
        function onFindSuccess(contacts){
        
            if(contacts.length>0){
                console.log("Encontrado-------> " +contacts[0].name.givenName);
                contacts[0].phoneNumbers = [];
            
                contacts[0].save(onSaveSuccess,onSaveError);
            
                contacts[0].phoneNumbers = numeros;
                contacts[0].save(onSaveNumberSuccess,onSaveError);
               
            }
        }
        
    }
    
    function onFindError(error){
        console.log("Error buscando "+error);
    }
    
    
    
}

function errorCB(tx, err) {
    alert("No pudimos encontrar respaldos");
    console.log("Error  SQL: "+err);
}
 
function onSaveNumberSuccess(){
    actualprogress +=1;	
    var pixel = ((actualprogress*250)/maxprogress);
    indicator.style.width= pixel+ "px";
    progressnum.innerHTML = "Actualizado: " + actualprogress+" / "+ maxprogress;
    if(actualprogress >= maxprogress){
        hideStatus();
        showButtons();
        $("#listaContactos").html(lista);
    }
     
}
 
function onSaveSuccess(contact) {
    console.log("Guardado "+contact); 
    
          
}

function onSaveError(contact) {
    console.log("no guardado "+contact);
}
                        
function confirmarCambio(){
    navigator.notification.confirm('Se actualizaran sus contactos!',
        onConfirm,'Contactos','Cancelar,Aceptar');
        
    function onConfirm(buttonIndex){
        if(buttonIndex==2){
        
            actualizarContactos();
        
        }      
    }
} 

function confirmaRestaurar(){
    navigator.notification.confirm('Se restaurarán los contactos!',
        onConfirmRestaurar,'Contactos','Cancelar,Aceptar');
        
    function onConfirmRestaurar(buttonIndex){
        if(buttonIndex==2){
            //startSpin();
            restaurar();
        
        }       
    }
}
         
//recive el numero verifica caracteres, serie internacional, local, nueva serie y
//devuelve el mismo numero onuevo segun sea el caso
function validarNumero(mobile){ 
    mobile = filtrarNumeros(mobile);
    if(isInternacional(mobile)){
        mobile = mobile.substr((mobile.length-8)), (mobile.length);
        if(!isConvencional(mobile)){
            mobile = "5939"+mobile.substr((mobile.length-8), mobile.length);//.substr((mobile.length-8), mobile.length);
        }else{
            mobile = "593"+mobile.substr((mobile.length-8), mobile.length);//.substr((mobile.length-8), mobile.length);
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
            if (serie == "39"|serie == "59"|serie == "69"|serie == "79") {  
                isConvencional =false;  
            }
        }
    }
    console.log(numero+" ?convencional"+isConvencional );  
    return isConvencional ;
}  