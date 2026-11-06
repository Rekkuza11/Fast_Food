# Fastfood – Sistema Web de Gestión Integral para Restaurantes

Proyecto académico de Programación Orientada a la Web.

## Tecnologías
HTML5 · CSS3 · Bootstrap 5.3 · JavaScript (datos simulados con `localStorage`)

## Vistas
| Archivo | Vista |
|---|---|
| `index.html` | Inicio |
| `menu.html` | Menú con búsqueda y filtros |
| `detalle-plato.html` | Detalle del plato (`?id=`) |
| `carrito.html` | Carrito / pedido |
| `reserva.html` | Reserva de mesas |
| `cuenta.html` | Registro, inicio de sesión e historial |
| `galeria.html` | Galería del restaurante |
| `nosotros.html` | Historia, misión, visión y servicios |
| `contacto.html` | Contacto, mapa y formulario |
| `cocina.html` | Tablero de cocina (rol cocina/admin) |
| `admin.html` | Panel administrativo (rol admin) |

## Estructura
```
css/estilos.css   Colores de marca sobre Bootstrap
js/datos.js       Datos de ejemplo (menú, inventario, mesas, usuarios)
js/script.js      Navbar/footer, carrito, reservas, cuenta, cocina y admin
```

## Usuarios de prueba (clave 1234)
`cliente@fastfood.com` · `cocina@fastfood.com` · `admin@fastfood.com`

## Nota
Los datos viven en `localStorage` del navegador: es una simulación para la etapa académica, sin seguridad real. En una etapa posterior se integrarían backend y base de datos. Para reiniciar los datos: F12 → Application → Local Storage → Clear.
