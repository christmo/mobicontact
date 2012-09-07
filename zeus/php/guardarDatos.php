<?php

/**
 * Guardar los datos
 */
require_once('../dll/conect.php');
extract($_GET);

if (isset($nombre)) {
    $sql = "INSERT INTO sitios (nombre,direccion,telefono,precio,latitud,longitud,tipo,estado,mail_contacto,foto) 
            VALUES ('$nombre','$direccion','$telefono',$precio,$lat,$lon,'$tipo',0,'$mail','".rand(1,4).".jpg')";

    echo $sql;
    consulta($sql);
    
}

header("Location: ../index.php#main");
exit();  // you need to exit after a Location header is sent
?>