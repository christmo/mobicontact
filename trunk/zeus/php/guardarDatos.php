<?php
/**
 * Guardar los datos
 */
require_once('../dll/conect.php');
extract($_GET);

$sql = "INSERT INTO sitios (nombre,direccion,telefono,precio,latitud,longitud,foto) 
VALUES ('$nombre','$direccion','$telefono',$precio,$latitud,$longitud,'$foto')";

consulta($sql);

echo true;
?>