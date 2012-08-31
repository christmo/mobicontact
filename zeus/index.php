<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>MobiContact</title>
        <link rel="stylesheet" href="css/jquery.mobile-1.1.1.min.css" />

        <script type="text/javascript" charset="utf-8" src="js/jquery.min.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/jquery.mobile-1.1.1.min.js"></script>

        <link rel="stylesheet" href="css/mapa.css"/>
        <script src="http://www.openlayers.org/api/OpenLayers.js">  </script>
        <script type="text/javascript" charset="utf-8" src="js/centros.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/crear.js"></script>
    </head>
    <body>
        <!-- PAGINA INICIAL -->
        <div data-role="page" id="main">
            <div data-role="header">
                <a href="#crear">Crear</a>
                <h1>GeoRental</h1>
            </div><!-- /header -->

            <div data-role="content">	

                <div id="map" class="map"></div>

            </div><!-- /content -->
        </div><!-- /page -->

        <div data-role="page" id="info" data-theme="a" data-content-theme="a">
            <div data-role="header">
                <a href="#main" data-rel="back">Home</a>
                <h1>Información Propiedad</h1>
            </div>

            <div data-role="content">  
                <img id="foto" src="" class="foto"/>
                <div id="tipo"></div>
                <div id="nombre"></div>
                <div id="dir"></div>
                <div id="tel"></div>
                <div id="precio"></div>
                <div id="lat"></div>
                <div id="lon"></div>
            </div>

            <div data-role="footer">
                <h4>Loja -  Ecuador</h4>
            </div>
        </div>

        <div data-role="page" id="crear">
            <div data-role="header">
                <a href="#main" data-rel="back">Home</a>
                <h1>Crear Sitio</h1>
            </div>

            <div data-role="content" id="entryText">
                <form action="php/guardarDatos.php" method="post">
                    <div data-role="fieldcontain" class="ui-hide-label">
                        <label for="nombre">Nombre:</label>
                        <input type="text" name="nombre" id="i_nombre" value="" placeholder="Nombre del contacto"/>
                    </div>
                    <div data-role="fieldcontain" class="ui-hide-label">
                        <label for="telefono">Tel&eacute;fono:</label>
                        <input type="text" name="telefono" id="i_telefono" value="" placeholder="Celular del Contacto"/>
                    </div>
                    <div data-role="fieldcontain" class="ui-hide-label">
                        <label for="direccion">Direcci&oacute;n:</label>
                        <input type="text" name="direccion" id="i_direccion" value="" placeholder="Dirección del Lugar"/>
                    </div>
                    <div data-role="fieldcontain" class="ui-hide-label">
                        <label for="mail">e-Mail:</label>
                        <input type="text" name="mail" id="i_mail" value="" placeholder="Correo Electrónico"/>
                    </div>
                    <label for="tipo" class="select">Sitio en:</label>
                    <select name="tipo" id="i_tipo">
                        <option value="Alquiler">Alquiler</option>
                        <option value="Venta">Venta</option>
                    </select>
                    <div data-role="fieldcontain" class="ui-hide-label">
                        <label for="precio">Precio/Costo:</label>
                        <input type="text" name="precio" id="i_precio" value="" placeholder="Precio Venta / Costo Alquiler"/>
                    </div>
                    <div data-role="fieldcontain" class="ui-hide-label">
                        <label for="lat">Latitud:</label>
                        <input type="text" name="lat" id="i_lat" value="" placeholder="Latitud"/>
                    </div>
                    <div data-role="fieldcontain" class="ui-hide-label">
                        <label for="lon">Longitud:</label>
                        <input type="text" name="lon" id="i_lon" value="" placeholder="Longitud"/>
                    </div>
                    <input type="submit" value="Enviar Datos" />
                </form>
                <div id="map_1" class="map"></div>
            </div>

            <div data-role="footer">
                <a href="#main" data-rel="back">Mapa</a>
            </div>
        </div>

        <!-- PAGINA DE CONTACTOS -->
        <div data-role="page" id="contactos">
            <div data-role="header">
                <a href="#main" data-rel="back">Home</a>
                <h1>Contactos</h1>
            </div> <!--header -->

            <div data-role="content">	
                <div style=" text-align:center">
                    <img style="width: 288px; height: 100px" src="css/images/movistar_horizontal.jpg" />
                </div>

                <div data-role="content">
                    <a id="actualizar" data-role="button" href=#> Actualizar </a>
                    <div id="status"></div> 
                    <ul id="listaContactos" data-role="listview" data-inset="true"></ul>
                </div>
            </div> <!--content -->
        </div> <!--page -->

    </body>
</html>
