/* ===== Fastfood · datos.js =====
   Datos de ejemplo. Se copian a localStorage la primera vez que se abre el sitio.
   Para volver a empezar: F12 → Application → Local Storage → Clear. */

const MENU = [
  { id: 1, nombre: 'Hamburguesa de la casa', categoria: 'fuertes', precio: 28000, emoji: '🍔',
    descripcion: 'Carne artesanal, queso cheddar y salsa especial.',
    ingredientes: ['Carne de res', 'Pan brioche', 'Queso cheddar', 'Lechuga y tomate', 'Salsa de la casa'] },
  { id: 2, nombre: 'Ensalada fresca del día', categoria: 'entradas', precio: 19000, emoji: '🥗',
    descripcion: 'Mix de vegetales de temporada con vinagreta cítrica.',
    ingredientes: ['Lechuga', 'Tomate', 'Zanahoria', 'Pepino', 'Vinagreta cítrica'] },
  { id: 3, nombre: 'Pizza artesanal', categoria: 'fuertes', precio: 34000, emoji: '🍕',
    descripcion: 'Masa madre, tomate San Marzano y albahaca fresca.',
    ingredientes: ['Masa madre', 'Tomate San Marzano', 'Mozzarella', 'Albahaca'] },
  { id: 4, nombre: 'Alitas BBQ', categoria: 'entradas', precio: 24000, emoji: '🍗',
    descripcion: 'Ocho alitas bañadas en salsa BBQ ahumada.',
    ingredientes: ['Alitas de pollo', 'Salsa BBQ', 'Ajo', 'Papas rústicas'] },
  { id: 5, nombre: 'Pasta carbonara', categoria: 'fuertes', precio: 31000, emoji: '🍝',
    descripcion: 'Spaghetti con tocineta crocante, huevo y queso parmesano.',
    ingredientes: ['Spaghetti', 'Tocineta', 'Huevo', 'Parmesano', 'Pimienta negra'] },
  { id: 6, nombre: 'Perro caliente especial', categoria: 'fuertes', precio: 18000, emoji: '🌭',
    descripcion: 'Salchicha, queso fundido, papas ripio y salsas.',
    ingredientes: ['Salchicha', 'Pan', 'Queso', 'Papa ripio', 'Salsas'] },
  { id: 7, nombre: 'Brownie con helado', categoria: 'postres', precio: 15000, emoji: '🍫',
    descripcion: 'Brownie tibio de chocolate con bola de helado de vainilla.',
    ingredientes: ['Chocolate', 'Harina', 'Huevo', 'Helado de vainilla'] },
  { id: 8, nombre: 'Torta tres leches', categoria: 'postres', precio: 14000, emoji: '🍰',
    descripcion: 'Porción de torta húmeda con crema y canela.',
    ingredientes: ['Leche', 'Crema de leche', 'Huevo', 'Canela'] },
  { id: 9, nombre: 'Limonada de coco', categoria: 'bebidas', precio: 9000, emoji: '🍹',
    descripcion: 'Limón natural con crema de coco, bien fría.',
    ingredientes: ['Limón', 'Crema de coco', 'Hielo'] },
  { id: 10, nombre: 'Jugo natural', categoria: 'bebidas', precio: 8000, emoji: '🥤',
    descripcion: 'Maracuyá, mora o lulo, en agua o en leche.',
    ingredientes: ['Fruta natural', 'Agua o leche', 'Azúcar'] }
];

const INVENTARIO = [
  { insumo: 'Carne de res', cantidad: 12, unidad: 'kg', minimo: 5 },
  { insumo: 'Queso mozzarella', cantidad: 3, unidad: 'kg', minimo: 4 },
  { insumo: 'Pan brioche', cantidad: 40, unidad: 'und', minimo: 20 },
  { insumo: 'Pollo (alitas)', cantidad: 8, unidad: 'kg', minimo: 6 },
  { insumo: 'Pasta spaghetti', cantidad: 2, unidad: 'kg', minimo: 3 },
  { insumo: 'Limones', cantidad: 60, unidad: 'und', minimo: 30 }
];

const MESAS = [
  { numero: 1, capacidad: 2, estado: 'libre' },
  { numero: 2, capacidad: 2, estado: 'ocupada' },
  { numero: 3, capacidad: 4, estado: 'libre' },
  { numero: 4, capacidad: 4, estado: 'libre' },
  { numero: 5, capacidad: 4, estado: 'reservada' },
  { numero: 6, capacidad: 6, estado: 'libre' },
  { numero: 7, capacidad: 8, estado: 'libre' },
  { numero: 8, capacidad: 12, estado: 'libre' }
];

// Usuarios de prueba (solo para la maqueta académica; en un proyecto real las claves NO se guardan así)
const USUARIOS_DEMO = [
  { nombre: 'Cliente Demo', correo: 'cliente@fastfood.com', telefono: '300 000 0001', clave: '1234', rol: 'cliente' },
  { nombre: 'Equipo de Cocina', correo: 'cocina@fastfood.com', telefono: '300 000 0002', clave: '1234', rol: 'cocina' },
  { nombre: 'Administrador', correo: 'admin@fastfood.com', telefono: '300 000 0003', clave: '1234', rol: 'admin' }
];
