
/// NOTA IMPORTANTE, PENSÉ QUE LA FECHA DE ENTREGA ERA EL LUNES 15/12, RECIEN VI QUE SE ME VENCIÓ, 
// ENTREGO EL TP1 NUEVAMENTE Y A LA BREVEDAD LO MEJORO PARA QUE LO PUEDAN CORREGIR, GRACIAS!





// ===========================================================
// API de carritos - Gestiona las RUTAS
// -----------------------------------------------------------
/* Acá defino todas las rutas encargadas de manejar los carritos de compra. 
Se encarga de crear nuevos carritos, obtener sus productos 
y agregar productos a un carrito con llamadas a CartManager.

Es la interfaz pública del backend que maneja el flujo de los carritos.
Las operaciones de lectura y escritura se hacen a través del CartManager, que es el que trabaja con el archivo JSON.

 ===========================================================*/

import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// POST /api/carts
// acá no hace falta controlar lo que llega porque no recibe parámetro en el body
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(
    parseInt(req.params.cid),
    parseInt(req.params.pid)
  );
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

// Exporto el router para poder usarlo en app.js
export default router;
