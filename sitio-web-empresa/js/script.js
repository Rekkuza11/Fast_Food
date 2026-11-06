/* ===== Fastfood · script.js =====
   Un solo archivo para todas las páginas. Cada bloque se ejecuta
   únicamente si el elemento que necesita existe en la página actual. */

/* ---------- Utilidades ---------- */
const $ = id => document.getElementById(id);
const moneda = n => Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };
const guardar = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sesion = () => leer('ff_sesion', null);
const getMenu = () => leer('ff_menu', MENU);
const getMesas = () => leer('ff_mesas', MESAS);
const PAGINA = location.pathname.split('/').pop() || 'index.html';

function aviso(msg) {
  let c = $('avisos');
  if (!c) { c = document.createElement('div'); c.id = 'avisos'; c.className = 'toast-container position-fixed bottom-0 end-0 p-3'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = 'toast align-items-center text-bg-dark border-0';
  t.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  c.appendChild(t);
  new bootstrap.Toast(t, { delay: 2500 }).show();
  t.addEventListener('hidden.bs.toast', () => t.remove());
}

function proteger(roles) {
  const s = sesion();
  if (!s || !roles.includes(s.rol)) { location.href = 'cuenta.html'; return false; }
  return true;
}

const ESTADOS = {
  pendiente: ['Pendiente', 'danger'], preparacion: ['En preparación', 'warning'],
  listo: ['Listo', 'success'], entregado: ['Entregado', 'secondary']
};
const badgeEstado = e => `<span class="badge text-bg-${ESTADOS[e][1]}">${ESTADOS[e][0]}</span>`;

/* ---------- Datos iniciales (una sola vez) ---------- */
if (!localStorage.getItem('ff_usuarios')) guardar('ff_usuarios', USUARIOS_DEMO);
if (!localStorage.getItem('ff_menu')) guardar('ff_menu', MENU);
if (!localStorage.getItem('ff_inventario')) guardar('ff_inventario', INVENTARIO);
if (!localStorage.getItem('ff_mesas')) guardar('ff_mesas', MESAS);
if (!localStorage.getItem('ff_pedidos')) {
  const dia = n => new Date(Date.now() - n * 864e5).toISOString();
  guardar('ff_pedidos', [
    { id: 1001, fecha: dia(2), cliente: 'cliente@fastfood.com', tipo: 'En el restaurante', notas: '', estado: 'entregado', total: 74000,
      items: [{ id: 1, nombre: 'Hamburguesa de la casa', precio: 28000, cant: 2 }, { id: 9, nombre: 'Limonada de coco', precio: 9000, cant: 2 }] },
    { id: 1002, fecha: dia(1), cliente: 'cliente@fastfood.com', tipo: 'Domicilio', notas: 'Sin cebolla', estado: 'entregado', total: 49000,
      items: [{ id: 3, nombre: 'Pizza artesanal', precio: 34000, cant: 1 }, { id: 7, nombre: 'Brownie con helado', precio: 15000, cant: 1 }] },
    { id: 1003, fecha: dia(0), cliente: 'Invitado', tipo: 'Para llevar', notas: '', estado: 'pendiente', total: 55000,
      items: [{ id: 5, nombre: 'Pasta carbonara', precio: 31000, cant: 1 }, { id: 4, nombre: 'Alitas BBQ', precio: 24000, cant: 1 }] }
  ]);
}

/* ---------- Navbar y footer (se pintan en TODAS las páginas) ---------- */
(function pintarLayout() {
  const s = sesion();
  const activa = { 'detalle-plato.html': 'menu.html' }[PAGINA] || PAGINA;
  const li = (h, t) => `<li class="nav-item"><a class="nav-link ${activa === h ? 'active' : ''}" href="${h}">${t}</a></li>`;
  const cocina = s && ['cocina', 'admin'].includes(s.rol) ? li('cocina.html', 'Cocina') : '';
  $('navbar-ff').innerHTML = `
  <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark"><div class="container">
    <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="index.html"><span class="bg-primary rounded px-2 fs-6">🍔</span> FASTFOOD</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Mostrar navegación"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="menuPrincipal"><ul class="navbar-nav ms-auto align-items-lg-center">
      ${li('index.html', 'Inicio')}${li('menu.html', 'Menú')}${li('reserva.html', 'Reservas')}${li('galeria.html', 'Galería')}${li('cuenta.html', 'Mi cuenta')}${cocina}
      <li class="nav-item"><a class="nav-link ${activa === 'carrito.html' ? 'active' : ''}" href="carrito.html">🛒 <span class="badge text-bg-primary rounded-pill" id="contadorCarrito">0</span></a></li>
      <li class="nav-item ms-lg-3"><a class="btn btn-primary btn-sm" href="admin.html">Panel admin</a></li>
    </ul></div></div></nav>`;
  const a = 'link-light link-underline-opacity-0 link-opacity-75-hover';
  $('footer-ff').outerHTML = `
  <footer class="bg-dark text-light py-5 mt-5" data-bs-theme="dark"><div class="container"><div class="row g-4">
    <div class="col-md-3"><strong>🍔 Fastfood</strong><p class="small text-secondary mt-2 mb-0">Sistema web de gestión integral para restaurantes.</p></div>
    <div class="col-md-3"><strong>Navegación</strong><ul class="list-unstyled small mt-2">
      <li><a class="${a}" href="index.html">Inicio</a></li><li><a class="${a}" href="menu.html">Menú</a></li><li><a class="${a}" href="reserva.html">Reservas</a></li><li><a class="${a}" href="galeria.html">Galería</a></li><li><a class="${a}" href="nosotros.html">Nosotros</a></li></ul></div>
    <div class="col-md-3"><strong>Contacto</strong><ul class="list-unstyled small text-secondary mt-2">
      <li>Mocoa, Putumayo</li><li><a class="${a}" href="contacto.html">contacto@fastfood.com</a></li><li>Lun–Dom · 11am–10pm</li></ul></div>
    <div class="col-md-3"><strong>Acceso</strong><ul class="list-unstyled small mt-2">
      <li><a class="${a}" href="cuenta.html">Mi cuenta</a></li><li><a class="${a}" href="admin.html">Panel administrativo</a></li></ul></div>
  </div><p class="text-center small text-secondary mt-4 mb-0">© 2026 Fastfood - Todos los derechos reservados.</p></div></footer>`;
})();

/* ---------- Carrito ---------- */
const obtenerCarrito = () => leer('ff_carrito', []);
function actualizarContador() {
  const el = $('contadorCarrito');
  if (el) el.textContent = obtenerCarrito().reduce((s, x) => s + x.cant, 0);
}
function agregarAlCarrito(id, cant = 1) {
  const c = obtenerCarrito();
  const it = c.find(x => x.id === id);
  it ? it.cant += cant : c.push({ id, cant });
  guardar('ff_carrito', c);
  actualizarContador();
  const p = getMenu().find(m => m.id === id);
  aviso(`${p ? esc(p.nombre) : 'Plato'} agregado al pedido`);
}
actualizarContador();

/* ---------- Tarjeta de plato (inicio y menú) ---------- */
const COLORES = ['warning', 'success', 'danger'];
function tarjetaPlato(p) {
  return `<div class="col-md-6 col-lg-4"><div class="card border-0 shadow-sm h-100 overflow-hidden">
    <div class="bg-${COLORES[p.id % 3]}-subtle d-flex align-items-center justify-content-center fs-1 py-4">${p.emoji}</div>
    <div class="card-body d-flex flex-column">
      <h3 class="h6 fw-bold">${esc(p.nombre)}</h3>
      <p class="small text-secondary">${esc(p.descripcion)}</p>
      <div class="d-flex justify-content-between align-items-center mt-auto">
        <strong>${moneda(p.precio)}</strong>
        <div><a href="detalle-plato.html?id=${p.id}" class="small me-2">Ver</a>
        <button class="btn btn-dark btn-sm rounded-pill" onclick="agregarAlCarrito(${p.id})">Agregar</button></div>
      </div>
    </div></div></div>`;
}

/* ---------- Inicio: destacados ---------- */
if ($('destacados')) $('destacados').innerHTML = getMenu().slice(0, 3).map(tarjetaPlato).join('');

/* ---------- Menú: buscador y filtros ---------- */
if ($('listaPlatos')) {
  let cat = 'todas', txt = '';
  const pintar = () => {
    const r = getMenu().filter(p => (cat === 'todas' || p.categoria === cat) && p.nombre.toLowerCase().includes(txt.toLowerCase()));
    $('listaPlatos').innerHTML = r.length ? r.map(tarjetaPlato).join('') : '<p class="text-secondary">No se encontraron platos.</p>';
  };
  $('buscador').addEventListener('input', e => { txt = e.target.value; pintar(); });
  document.querySelectorAll('#filtros button').forEach(b => b.addEventListener('click', () => {
    cat = b.dataset.cat;
    document.querySelectorAll('#filtros button').forEach(x => x.className = 'btn btn-sm ' + (x === b ? 'btn-dark' : 'btn-outline-dark'));
    pintar();
  }));
  pintar();
}

/* ---------- Detalle del plato ---------- */
if ($('detallePlato')) {
  const id = new URLSearchParams(location.search).get('id');
  const p = getMenu().find(x => String(x.id) === id);
  $('detallePlato').innerHTML = p ? `
    <div class="col-md-5"><div class="bg-warning-subtle rounded-4 d-flex align-items-center justify-content-center" style="height:320px;font-size:120px">${p.emoji}</div></div>
    <div class="col-md-7">
      <span class="badge text-bg-success text-capitalize">${esc(p.categoria)}</span>
      <h2 class="fw-bold mt-2">${esc(p.nombre)}</h2>
      <p class="text-secondary">${esc(p.descripcion)}</p>
      <h3 class="h6">Ingredientes</h3>
      <ul>${(p.ingredientes || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      <p class="fs-3 fw-bold">${moneda(p.precio)}</p>
      <div class="d-flex gap-3 align-items-center">
        <input id="cantDetalle" type="number" min="1" max="20" value="1" class="form-control" style="width:90px" aria-label="Cantidad">
        <button class="btn btn-primary" id="btnAgregarDetalle">Agregar al pedido</button>
      </div></div>`
    : '<p>Plato no encontrado. <a href="menu.html">Volver al menú</a></p>';
  if (p) $('btnAgregarDetalle').onclick = () => agregarAlCarrito(p.id, Math.max(1, parseInt($('cantDetalle').value) || 1));
}

/* ---------- Carrito / pedido ---------- */
function pintarCarrito() {
  const cont = $('itemsCarrito');
  if (!cont) return;
  const menu = getMenu();
  const c = obtenerCarrito().map(i => ({ ...i, p: menu.find(m => m.id === i.id) })).filter(i => i.p);
  if (!c.length) {
    cont.innerHTML = '<div class="text-center py-5"><p class="fs-1">🛒</p><p>Tu pedido está vacío.</p><a href="menu.html" class="btn btn-primary">Ir al menú</a></div>';
    $('subtotal').textContent = moneda(0);
    return;
  }
  cont.innerHTML = c.map(i => `<div class="card border-0 shadow-sm mb-3"><div class="card-body d-flex align-items-center gap-3 flex-wrap">
    <span class="fs-2">${i.p.emoji}</span>
    <div class="flex-grow-1"><strong>${esc(i.p.nombre)}</strong><br><small class="text-secondary">${moneda(i.p.precio)} c/u</small></div>
    <div class="btn-group btn-group-sm"><button class="btn btn-outline-dark" data-act="menos" data-id="${i.id}">−</button><span class="btn btn-light disabled">${i.cant}</span><button class="btn btn-outline-dark" data-act="mas" data-id="${i.id}">+</button></div>
    <strong class="text-end" style="min-width:90px">${moneda(i.p.precio * i.cant)}</strong>
    <button class="btn btn-sm btn-outline-danger" data-act="quitar" data-id="${i.id}" aria-label="Quitar">🗑️</button></div></div>`).join('');
  $('subtotal').textContent = moneda(c.reduce((s, i) => s + i.p.precio * i.cant, 0));
}
if ($('itemsCarrito')) {
  $('itemsCarrito').addEventListener('click', e => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const id = Number(b.dataset.id);
    let c = obtenerCarrito();
    const it = c.find(x => x.id === id);
    if (b.dataset.act === 'mas') it.cant++;
    if (b.dataset.act === 'menos') it.cant--;
    c = c.filter(x => x.cant > 0 && !(b.dataset.act === 'quitar' && x.id === id));
    guardar('ff_carrito', c);
    actualizarContador(); pintarCarrito();
  });
  $('btnConfirmar').onclick = () => {
    const menu = getMenu();
    const items = obtenerCarrito().map(i => { const p = menu.find(m => m.id === i.id); return p && { id: p.id, nombre: p.nombre, precio: p.precio, cant: i.cant }; }).filter(Boolean);
    if (!items.length) return aviso('Agrega al menos un plato');
    const s = sesion(), ped = leer('ff_pedidos', []);
    const id = Math.max(1000, ...ped.map(p => p.id)) + 1;
    ped.push({ id, fecha: new Date().toISOString(), cliente: s ? s.correo : 'Invitado', items, total: items.reduce((t, i) => t + i.precio * i.cant, 0),
      tipo: $('tipoPedido').value, notas: $('notasPedido').value.trim(), estado: 'pendiente' });
    guardar('ff_pedidos', ped); guardar('ff_carrito', []);
    actualizarContador(); pintarCarrito(); $('notasPedido').value = '';
    $('resultadoPedido').innerHTML = `<div class="alert alert-success mt-3">Pedido #${id} enviado a cocina. ${s ? 'Puedes seguirlo en <a href="cuenta.html">Mi cuenta</a>.' : ''}</div>`;
  };
  pintarCarrito();
}

/* ---------- Reserva ---------- */
if ($('formReserva')) {
  const fr = $('formReserva');
  const q = new URLSearchParams(location.search);
  ['fecha', 'hora', 'personas', 'telefono'].forEach(k => { if (q.get(k)) $(k).value = q.get(k); });
  $('fecha').min = new Date().toISOString().slice(0, 10);
  const color = { libre: 'success', reservada: 'warning', ocupada: 'danger' };
  const pintarMesas = () => $('mesasDisp').innerHTML = getMesas().map(m =>
    `<div class="col-6 col-md-3"><div class="rounded-3 p-2 text-center bg-${color[m.estado]}-subtle"><strong>Mesa ${m.numero}</strong><br><small>${m.capacidad} pers. · ${m.estado}</small></div></div>`).join('');
  pintarMesas();
  fr.addEventListener('submit', e => {
    e.preventDefault();
    fr.classList.add('was-validated');
    if (!fr.checkValidity()) return;
    const mesas = getMesas(), n = parseInt($('personas').value);
    const mesa = mesas.filter(m => m.estado === 'libre' && m.capacidad >= n).sort((a, b) => a.capacidad - b.capacidad)[0];
    if (!mesa) { $('mensajeReserva').innerHTML = '<div class="alert alert-warning mt-3">No hay mesas libres para ese número de personas. Llámanos al 300 000 0000.</div>'; return; }
    mesa.estado = 'reservada'; guardar('ff_mesas', mesas);
    const r = leer('ff_reservas', []);
    r.push({ id: Date.now(), fecha: $('fecha').value, hora: $('hora').value, personas: n, nombre: $('nombreReserva').value.trim(), telefono: $('telefono').value.trim(), notas: $('notasReserva').value.trim(), mesa: mesa.numero });
    guardar('ff_reservas', r);
    $('mensajeReserva').innerHTML = `<div class="alert alert-success mt-3">¡Reserva confirmada! Mesa ${mesa.numero} para ${n} persona(s).</div>`;
    fr.reset(); fr.classList.remove('was-validated'); pintarMesas();
  });
}

/* ---------- Mi cuenta ---------- */
if ($('vistaAcceso')) {
  const msg = (t, tipo = 'danger') => $('msgCuenta').innerHTML = `<div class="alert alert-${tipo}">${t}</div>`;
  const render = () => {
    const s = sesion();
    $('vistaAcceso').classList.toggle('d-none', !!s);
    $('vistaCuenta').classList.toggle('d-none', !s);
    if (!s) return;
    $('saludoCuenta').textContent = 'Hola, ' + s.nombre;
    $('datosCuenta').innerHTML = `<li>Correo: ${esc(s.correo)}</li><li>Teléfono: ${esc(s.telefono || '—')}</li><li>Rol: ${esc(s.rol)}</li>`;
    $('accesosRol').innerHTML = s.rol === 'admin' ? '<a class="btn btn-primary btn-sm me-2" href="admin.html">Ir al panel</a><a class="btn btn-outline-dark btn-sm" href="cocina.html">Ir a cocina</a>'
      : s.rol === 'cocina' ? '<a class="btn btn-primary btn-sm" href="cocina.html">Ir a cocina</a>' : '';
    const ped = leer('ff_pedidos', []).filter(p => p.cliente === s.correo).reverse();
    $('tablaHistorial').innerHTML = ped.length ? ped.map(p => `<tr><td>#${p.id}</td><td>${new Date(p.fecha).toLocaleDateString('es-CO')}</td>
      <td>${p.items.map(i => i.cant + '× ' + esc(i.nombre)).join(', ')}</td><td>${moneda(p.total)}</td><td>${badgeEstado(p.estado)}</td></tr>`).join('')
      : '<tr><td colspan="5" class="text-center text-secondary">Aún no has hecho pedidos.</td></tr>';
  };
  $('formLogin').addEventListener('submit', e => {
    e.preventDefault();
    const u = leer('ff_usuarios', USUARIOS_DEMO).find(x => x.correo === $('correoLogin').value.trim().toLowerCase() && x.clave === $('claveLogin').value);
    if (!u) return msg('Correo o contraseña incorrectos.');
    guardar('ff_sesion', { nombre: u.nombre, correo: u.correo, telefono: u.telefono, rol: u.rol });
    if (u.rol === 'admin') location.href = 'admin.html';
    else if (u.rol === 'cocina') location.href = 'cocina.html';
    else location.reload();
  });
  $('formRegistro').addEventListener('submit', e => {
    e.preventDefault();
    const f = $('formRegistro'); f.classList.add('was-validated');
    if (!f.checkValidity()) return;
    const us = leer('ff_usuarios', USUARIOS_DEMO), correo = $('correoReg').value.trim().toLowerCase();
    if (us.some(x => x.correo === correo)) return msg('Ese correo ya está registrado.');
    us.push({ nombre: $('nombreReg').value.trim(), correo, telefono: $('telReg').value.trim(), clave: $('claveReg').value, rol: 'cliente' });
    guardar('ff_usuarios', us);
    f.reset(); f.classList.remove('was-validated');
    msg('Cuenta creada. Ya puedes iniciar sesión.', 'success');
  });
  $('btnSalir').onclick = () => { localStorage.removeItem('ff_sesion'); location.href = 'index.html'; };
  render();
}

/* ---------- Contacto ---------- */
if ($('formContacto')) {
  $('formContacto').addEventListener('submit', e => {
    e.preventDefault();
    const f = $('formContacto'); f.classList.add('was-validated');
    if (!f.checkValidity()) return;
    const m = leer('ff_mensajes', []);
    m.push({ fecha: new Date().toISOString(), nombre: $('nombre').value, correo: $('correo').value, asunto: $('asunto').value, mensaje: $('mensaje').value });
    guardar('ff_mensajes', m);
    f.reset(); f.classList.remove('was-validated');
    $('msgContacto').innerHTML = '<div class="alert alert-success mt-3">¡Gracias! Recibimos tu mensaje y te responderemos pronto.</div>';
  });
}

/* ---------- Cocina (rol cocina / admin) ---------- */
if ($('colPendiente') && proteger(['cocina', 'admin'])) {
  const SIG = { pendiente: ['preparacion', 'Iniciar preparación', 'primary'], preparacion: ['listo', 'Marcar listo', 'success'], listo: ['entregado', 'Marcar entregado', 'dark'] };
  const COL = { pendiente: ['colPendiente', 'danger'], preparacion: ['colPreparacion', 'warning'], listo: ['colListo', 'success'] };
  const pintar = () => {
    const ped = leer('ff_pedidos', []);
    Object.keys(COL).forEach(est => {
      const l = ped.filter(p => p.estado === est);
      $(COL[est][0]).innerHTML = l.length ? l.map(p => `<div class="card border-0 border-start border-4 border-${COL[est][1]} shadow-sm mb-3"><div class="card-body">
        <div class="d-flex justify-content-between"><strong>Pedido #${p.id}</strong><small class="text-secondary">${new Date(p.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</small></div>
        <small class="text-secondary">${esc(p.tipo)}</small>
        <ul class="mb-2 mt-2 small">${p.items.map(i => `<li>${i.cant}× ${esc(i.nombre)}</li>`).join('')}</ul>
        ${p.notas ? `<p class="small fst-italic mb-2">📝 ${esc(p.notas)}</p>` : ''}
        <button class="btn btn-${SIG[est][2]} btn-sm w-100" data-id="${p.id}">${SIG[est][1]}</button></div></div>`).join('')
        : '<p class="text-secondary small mb-0">Sin pedidos.</p>';
    });
  };
  document.querySelector('main').addEventListener('click', e => {
    const b = e.target.closest('button[data-id]');
    if (!b) return;
    const ped = leer('ff_pedidos', []), p = ped.find(x => x.id === Number(b.dataset.id));
    p.estado = SIG[p.estado][0]; guardar('ff_pedidos', ped); pintar();
  });
  setInterval(pintar, 5000);
  window.addEventListener('storage', pintar);   // se actualiza si otra pestaña crea un pedido
  pintar();
}

/* ---------- Panel administrativo (rol admin) ---------- */
if ($('panelAdmin') && proteger(['admin'])) {
  const modal = new bootstrap.Modal($('modalPlato'));
  const barra = (pct, color = 'primary') => `<div class="progress" style="height:10px"><div class="progress-bar" style="width:${pct}%"></div></div>`;
  const pintar = () => {
    const menu = getMenu(), inv = leer('ff_inventario', INVENTARIO), mesas = getMesas(), ped = leer('ff_pedidos', []), res = leer('ff_reservas', []);
    const hoy = new Date().toDateString();
    const kpi = [['Ventas de hoy', moneda(ped.filter(p => new Date(p.fecha).toDateString() === hoy).reduce((s, p) => s + p.total, 0))],
      ['Pedidos activos', ped.filter(p => p.estado !== 'entregado').length],
      ['Mesas no libres', mesas.filter(m => m.estado !== 'libre').length + ' / ' + mesas.length],
      ['Insumos por reponer', inv.filter(i => i.cantidad < i.minimo).length]];
    $('kpis').innerHTML = kpi.map(([t, v]) => `<div class="col-6 col-lg-3"><div class="card border-0 shadow-sm text-center p-3"><div class="fs-3 fw-bold">${v}</div><small class="text-secondary">${t}</small></div></div>`).join('');

    $('tablaMenu').innerHTML = menu.map(p => `<tr><td>${p.emoji} ${esc(p.nombre)}</td><td class="text-capitalize">${esc(p.categoria)}</td><td>${moneda(p.precio)}</td>
      <td class="text-end"><button class="btn btn-sm btn-outline-dark" data-act="editar" data-id="${p.id}">Editar</button> <button class="btn btn-sm btn-outline-danger" data-act="eliminar" data-id="${p.id}">Eliminar</button></td></tr>`).join('');

    $('tablaInventario').innerHTML = inv.map((i, n) => `<tr><td>${esc(i.insumo)}</td>
      <td><div class="btn-group btn-group-sm"><button class="btn btn-outline-dark" data-act="ins-menos" data-n="${n}">−</button><span class="btn btn-light disabled">${i.cantidad} ${esc(i.unidad)}</span><button class="btn btn-outline-dark" data-act="ins-mas" data-n="${n}">+</button></div></td>
      <td>${i.minimo} ${esc(i.unidad)}</td><td>${i.cantidad < i.minimo ? '<span class="badge text-bg-danger">Reponer</span>' : '<span class="badge text-bg-success">OK</span>'}</td></tr>`).join('');

    $('tablaPedidos').innerHTML = ped.slice().reverse().map(p => `<tr><td>#${p.id}</td><td>${new Date(p.fecha).toLocaleDateString('es-CO')}</td><td>${esc(p.cliente)}</td>
      <td>${p.items.map(i => i.cant + '× ' + esc(i.nombre)).join(', ')}</td><td>${moneda(p.total)}</td><td>${badgeEstado(p.estado)}</td></tr>`).join('');

    $('mesasAdmin').innerHTML = mesas.map((m, n) => `<div class="col-6 col-md-3"><div class="card border-0 shadow-sm p-3"><strong>Mesa ${m.numero}</strong><small class="text-secondary mb-2">${m.capacidad} personas</small>
      <select class="form-select form-select-sm" data-mesa="${n}"><option ${m.estado === 'libre' ? 'selected' : ''}>libre</option><option ${m.estado === 'reservada' ? 'selected' : ''}>reservada</option><option ${m.estado === 'ocupada' ? 'selected' : ''}>ocupada</option></select></div></div>`).join('');
    $('tablaReservas').innerHTML = res.length ? res.slice().reverse().map(r => `<tr><td>${esc(r.fecha)}</td><td>${esc(r.hora)}</td><td>${esc(r.nombre)}</td><td>${r.personas}</td><td>Mesa ${r.mesa}</td><td>${esc(r.telefono)}</td></tr>`).join('')
      : '<tr><td colspan="6" class="text-center text-secondary">Sin reservas todavía.</td></tr>';

    // Reportes
    const porDia = {}, porPlato = {};
    ped.forEach(p => { const d = new Date(p.fecha).toLocaleDateString('es-CO'); porDia[d] = (porDia[d] || 0) + p.total; p.items.forEach(i => porPlato[i.nombre] = (porPlato[i.nombre] || 0) + i.cant); });
    const maxD = Math.max(1, ...Object.values(porDia));
    $('repVentas').innerHTML = Object.entries(porDia).map(([d, v]) => `<div class="mb-2"><div class="d-flex justify-content-between small"><span>${d}</span><strong>${moneda(v)}</strong></div>${barra(v / maxD * 100)}</div>`).join('') || '<p class="text-secondary">Sin ventas.</p>';
    const top = Object.entries(porPlato).sort((a, b) => b[1] - a[1]).slice(0, 5), maxP = Math.max(1, ...top.map(t => t[1]));
    $('repTop').innerHTML = top.map(([n, c]) => `<div class="mb-2"><div class="d-flex justify-content-between small"><span>${esc(n)}</span><strong>${c} und</strong></div>${barra(c / maxP * 100)}</div>`).join('') || '<p class="text-secondary">Sin datos.</p>';
    const oc = Math.round(mesas.filter(m => m.estado !== 'libre').length / mesas.length * 100);
    $('repOcupacion').innerHTML = `<div class="fs-3 fw-bold">${oc}%</div>${barra(oc)}<small class="text-secondary">de las mesas están reservadas u ocupadas</small>`;
  };

  $('panelAdmin').addEventListener('click', e => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'editar' || act === 'eliminar') {
      const menu = getMenu(), p = menu.find(x => x.id === Number(b.dataset.id));
      if (act === 'eliminar') { if (confirm('¿Eliminar "' + p.nombre + '" del menú?')) { guardar('ff_menu', menu.filter(x => x !== p)); pintar(); } return; }
      $('platoId').value = p.id; $('platoNombre').value = p.nombre; $('platoCat').value = p.categoria; $('platoPrecio').value = p.precio;
      $('platoEmoji').value = p.emoji; $('platoDesc').value = p.descripcion; $('platoIng').value = (p.ingredientes || []).join(', ');
      $('tituloModal').textContent = 'Editar plato'; modal.show();
    }
    if (act === 'nuevo') { $('formPlato').reset(); $('platoId').value = ''; $('tituloModal').textContent = 'Nuevo plato'; modal.show(); }
    if (act === 'ins-mas' || act === 'ins-menos') {
      const inv = leer('ff_inventario', INVENTARIO), i = inv[b.dataset.n];
      i.cantidad = Math.max(0, i.cantidad + (act === 'ins-mas' ? 1 : -1)); guardar('ff_inventario', inv); pintar();
    }
  });
  $('panelAdmin').addEventListener('change', e => {
    if (e.target.dataset.mesa === undefined) return;
    const mesas = getMesas(); mesas[e.target.dataset.mesa].estado = e.target.value; guardar('ff_mesas', mesas); pintar();
  });
  $('formPlato').addEventListener('submit', e => {
    e.preventDefault();
    const menu = getMenu(), id = Number($('platoId').value);
    const datos = { nombre: $('platoNombre').value.trim(), categoria: $('platoCat').value, precio: Number($('platoPrecio').value), emoji: $('platoEmoji').value.trim() || '🍽️',
      descripcion: $('platoDesc').value.trim(), ingredientes: $('platoIng').value.split(',').map(x => x.trim()).filter(Boolean) };
    if (id) Object.assign(menu.find(x => x.id === id), datos);
    else menu.push({ id: Math.max(0, ...menu.map(x => x.id)) + 1, ...datos });
    guardar('ff_menu', menu); modal.hide(); pintar();
  });
  pintar();
}
