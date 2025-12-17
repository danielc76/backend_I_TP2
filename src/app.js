// ===========================================================
// Archivo principal del servidor
// -----------------------------------------------------------
/*
Acá configuro el servidor de Express.
Es el punto de entrada de mi backend.
En este archivo inicializo el servidor,
defino el puerto donde va a escuchar (8080) y conecto las rutas principales
de mi API (products y carts).
No contiene lógica de negocio, solo organiza el funcionamiento general.
===========================================================
*/

import express from 'express';
import { engine } from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';

import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;


// ===========================================================
// Configuración de __dirname (ES Modules)
// -----------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ===========================================================
// Configuración del motor de plantillas Handlebars
// -----------------------------------------------------------
/*
Se configura Handlebars como motor de vistas del servidor.
Esto permite renderizar archivos .handlebars desde Express,
combinando HTML con datos enviados desde el backend.
*/

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


// ===========================================================
// Middlewares
// -----------------------------------------------------------

app.use(express.json()); // Permite leer y procesar datos enviados en formato JSON
app.use(express.urlencoded({ extended: true })); // Permite leer datos enviados desde formularios
app.use(express.static(path.join(__dirname, 'public'))); // Archivos estáticos (JS cliente para sockets)


// ===========================================================
// Rutas de la API
// -----------------------------------------------------------
/*
Se definen los routers encargados de manejar las distintas
rutas de la aplicación.
Cada router se ocupa de una responsabilidad específica.
*/

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


// ===========================================================
// Configuración del servidor HTTP + WebSockets
// -----------------------------------------------------------
/*
Para poder utilizar Socket.io es necesario crear el servidor HTTP
a partir de Express. El servidor de sockets se monta sobre este
servidor HTTP.
*/

const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager();


// ===========================================================
// Lógica de WebSockets
// -----------------------------------------------------------
/*
Se define el comportamiento del servidor cuando un cliente
se conecta mediante WebSockets.
Desde acá se emiten y reciben eventos en tiempo real.
*/

io.on('connection', async (socket) => {
  console.log('Cliente conectado');

  // Envío inicial del listado de productos
  const productos = await productManager.getProducts();
  socket.emit('productos', productos);

  // Crear producto desde WebSocket
  socket.on('nuevoProducto', async (data) => {
    await productManager.addProduct(data);
    const productosActualizados = await productManager.getProducts();
    io.emit('productos', productosActualizados);
  });

  // Eliminar producto desde WebSocket
  socket.on('eliminarProducto', async (id) => {
    await productManager.deleteProduct(id);
    const productosActualizados = await productManager.getProducts();
    io.emit('productos', productosActualizados);
  });
});


// ===========================================================
// Inicio del servidor
// -----------------------------------------------------------
/*
Se indica a Express en qué puerto debe escuchar las peticiones
del cliente y se muestra un mensaje por consola cuando el
servidor se inicia correctamente.
*/

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
