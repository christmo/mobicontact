<?php

/**
 * Guardar los datos
 */
require_once('../dll/conect.php');
extract($_GET);

if (isset($nombre)) {
    $sql = "INSERT INTO sitios (nombre,direccion,telefono,precio,latitud,longitud,tipo,estado,mail_contacto) 
            VALUES ('$nombre','$direccion','$telefono',$precio,$lat,$lon,'$tipo',0,'$mail')";

    consulta($sql);
    
}

//echo "<script type=\"text/javascript\">window.location = \"../index.php\"</script>";
header("Location: ../index.php");
exit();  // you need to exit after a Location header is sent
?>