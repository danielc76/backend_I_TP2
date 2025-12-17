// ===========================================================
// API de productos - Gestiona las rutas de Productos
// -----------------------------------------------------------
/*
 Contiene todas las rutas que se encargan de recibir las peticiones HTTP relacionadas con los productos.
  Es la interfaz pública del backend para todo lo que sea productos.
 Cada endpoint (GET, POST, PUT, DELETE) llama al ProductManager 
 para que haga las operaciones sobre el archivo JSON.

 NOTA INTERNA: 
 La implementación de los Routers de express no los planteo dentro de una clase, 
 se escriben como una colección de funciones porque se usan sólo para decirle al servidor 
 qué hacer cuando llega una petición HTTP a cierta URL.
 No tiene propiedades propias ni necesita “recordar” nada entre llamadas.
 Por eso los archivos los pongo en minúsculas, representan una colección de rutas, 
 no una entidad lógica con comportamiento propio.
 
 Cada endpoint llama al ProductManager para que haga las operaciones sobre el archivo JSON.
 Un endpoint (“puerta de entrada” del backend) es una dirección específica dentro de una API 
 donde el cliente (por ejemplo, Postman o el front-end) 
 puede enviar una solicitud (request) para obtener o modificar datos.
 Cada endpoint combina una URL (/api/products) y 
 un método HTTP (GET, POST, PUT, DELETE) 
 y una acción que es la función que ejecuta el servidor para resolver la solicitud.

Express es un framework para Node.js que sirve para crear servidores web y APIs de manera rápida.
Se usa para:
-Crear un servidor que escuche peticiones 
-Definir rutas (endpoints) que indiquen qué debe hacer el servidor cuando alguien pide algo (GET, POST, PUT, DELETE...).
-Procesar datos que llegan en formato JSON o por formularios.
-Enviar respuestas (mensajes, objetos, errores, archivos, etc.).
-Organizar la lógica del backend en módulos o “routers” separados.
 ===========================================================*/

import { Router } from 'express'; 
import ProductManager from '../managers/ProductManager.js';

// Creo el enrutador de Express
const router = Router();

// Instancio mi gestor de productos, que maneja el archivo products.json
const productManager = new ProductManager();

// =========================================================
// GET /api/products
// Devuelve el listado completo de productos
// =========================================================
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json({
    message: 'Listado de productos obtenido correctamente',
    products
  });
});

// =========================================================
// GET /api/products/:pid
// Devuelve un producto según el ID que le paso por parámetro
// =========================================================
router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);

  // Si no existe el producto, devuelvo un error 404
  if (!product)
    return res.status(404).json({ error: 'Producto no encontrado' });

  // Si lo encontró, lo devuelvo junto con un mensaje
  res.json({
    message: 'Producto encontrado correctamente',
    product
  });
});

// =========================================================
// POST /api/products
// Crea un nuevo producto a partir de los datos del body
// =========================================================
router.post('/', async (req, res) => {
  const { title, description, price, stock, category, thumbnail } = req.body;

  // Validación básica de estructura y tipos
  if (
    !title ||
    !description ||
    typeof price !== 'number' ||
    typeof stock !== 'number' ||
    !category
  ) {
    return res.status(400).json({
      error: 'Estructura inválida. Se requieren: title, description, price (número), stock (número) y category.'
    });
  }

  // Si pasa la validación, se crea el producto
  const newProduct = await productManager.addProduct(req.body);

  res.status(201).json({
    message: 'Producto creado correctamente',
    product: newProduct
  });
});


// =========================================================
// PUT /api/products/:pid
// Actualiza un producto existente según el ID
// =========================================================
router.put('/:pid', async (req, res) => {
  const { title, description, price, stock, category } = req.body;

  // Validación completa: todos los campos requeridos
  if (
    !title ||
    !description ||
    typeof price !== 'number' ||
    typeof stock !== 'number' ||
    !category
  ) {
    return res.status(400).json({
      error: 'Estructura inválida. Se requieren: title, description, price (número), stock (número) y category.'
    });
  }

  const updated = await productManager.updateProduct(req.params.pid, req.body);

  if (!updated)
    return res.status(404).json({ error: 'Producto no encontrado' });

  res.json({
    message: 'Producto actualizado correctamente',
    product: updated
  });
});

// =========================================================
// DELETE /api/products/:pid
// Elimina un producto según el ID
// =========================================================
router.delete('/:pid', async (req, res) => {
  const deleted = await productManager.deleteProduct(req.params.pid);

  // Si no existe, devuelvo error 404
  if (!deleted)
    return res.status(404).json({ error: 'Producto no encontrado' });

  // Si se eliminó, mando mensaje de confirmación
  res.json({
    message: 'Producto eliminado correctamente'
  });
});

// Exporto el router para poder usarlo en app.js
export default router;
