<?php

$Conexion_ID = 0;
$Consulta_ID = 0;

/* n�mero de error y texto error */
$Errno = 0;
$Error = "";
$BaseDatos = "georental";
$Servidor = "localhost";
$Usuario = "root";
$Clave = "";


// Conectamos al servidor
$Conexion_ID = mysql_connect($Servidor, $Usuario, $Clave);


if (!$Conexion_ID) {
    $Error = "Ha fallado la conexi\xF3n.";
    echo '$Error';
} {
    $_SESSION["idBD"] = $Conexion_ID;
}

//seleccionamos la base de datos
if (!@mysql_select_db($BaseDatos, $Conexion_ID)) {
    $Error = "Imposible abrir " . $BaseDatos;
    echo '$Error';
}


/* Ejecuta un consulta */

function consulta($sql = "") {
    if ($sql == "") {
        $Error = "No ha especificado una consulta SQL";
        return 0;
    }
    // $sql = mysql_real_escape_string($sql);

    //ejecutamos la consulta
    $_SESSION["idSQL"] = mysql_query($sql, $_SESSION["idBD"]);
    if (!$_SESSION["idSQL"]) {
        $Errno = mysql_errno();
        $Error = mysql_error();
    }
}

/** Consulta JSON
 *
 */
function consultaJSON($sql) {
    return mysql_query($sql, $_SESSION["idBD"]);
}

/*
 * Devuelve todas las filas de la Consulta
 * de forma que es un Array dentro de otro.
 * (nombres de campos en MAYUSCULAS)
 *
 */

function variasFilas() {
    $vector = null;
    $pos = 0;
    while ($row = mysql_fetch_row($_SESSION["idSQL"])) {
        $fila = "";
        for ($i = 0; $i < count($row); $i++) {
            $nCampo = mysql_field_name($_SESSION["idSQL"], $i);
            $fila[$nCampo] = $row[$i];
        }
        $vector[$pos] = $fila;
        $pos++;
    }
    return $vector;
}

/**
 * Consulta a la base de datos varias filas...
 * @param <string> $sql -> consulta SQL
 * @return <resulset> $resulset -> datos por campos en un arreglo
 */
function consultarVariasFilas($sql = "") {
    $vector = null;
    $pos = 0;

    $consulta = mysql_query($sql, $_SESSION["idBD"]);
    
    while ($row = mysql_fetch_row($consulta)) {
        $fila = "";
        for ($i = 0; $i < count($row); $i++) {
            $nCampo = mysql_field_name($consulta, $i);
            $fila[$nCampo] = $row[$i];
        }
        $vector[$pos] = $fila;
        $pos++;
    }
    return $vector;
}

/**
 * Devuelve la primer fila de la consulta
 * (nombres de campos en MAYUSCULAS)
 * */
function unicaFila() {

    $fila = "";
    while ($row = mysql_fetch_row($_SESSION["idSQL"])) {
        for ($i = 0; $i < count($row); $i++) {
            $nCampo = mysql_field_name($_SESSION["idSQL"], $i);
            $fila[$nCampo] = $row[$i];
        }
        return $fila;
    }
}

/*
 * Se termina la conexi�n esto por cada sesi�n.
 */

function cerrarConexion() {
    @mysql_close($_SESSION["idBD"]);
}
?>
