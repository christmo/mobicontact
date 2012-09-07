<?php

require_once('../dll/conect.php');
//extract($_GET);

$salida = "";

$consultaSql = "SELECT id,nombre,direccion,telefono,precio,latitud,longitud,foto,tipo,mail_contacto 
    FROM sitios where estado = 0";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{\"success\":\"true\",\"sitios\": [";
for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{" . 
            "\"id\":".$fila["id"] . "," . 
            "\"nombre\":\"".$fila["nombre"] . "\"," . 
            "\"direccion\":\"".$fila["direccion"] ."\"," . 
            "\"telefono\":\"".$fila["telefono"] . "\"," . 
            "\"precio\":\"".$fila["precio"] . "\"," . 
            "\"latitud\":".$fila["latitud"] . "," . 
            "\"longitud\":".$fila["longitud"] . "," . 
            "\"tipo\":\"".$fila["tipo"] . "\"," . 
            "\"mail_contacto\":\"".$fila["mail_contacto"] . "\"," . 
            "\"foto\":\"".$fila["foto"] . "\"" . 
            "}";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

