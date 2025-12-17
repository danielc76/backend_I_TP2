// ===========================================================
// Router de vistas
// -----------------------------------------------------------
/*
Este router se encarga de renderizar vistas HTML utilizando
Handlebars. Consume los datos reales de products.json a través
del ProductManager.
No expone endpoints de API ni devuelve JSON.
*/
// ===========================================================

import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// ===========================================================
// Ruta HOME
// -----------------------------------------------------------
/*
Renderiza la vista principal mostrando el listado completo
de productos almacenados en el archivo products.json.

Esta vista NO trabaja con WebSockets.
Los productos se renderizan directamente con Handlebars
al momento de la petición HTTP.
*/

router.get('/', async (req, res) => {
    const productos = await productManager.getProducts();

    res.render('home', {
        titulo: 'Listado de productos',
        productos,
        hayProductos: productos.length > 0
    });
});


// ===========================================================
// Ruta PRODUCTOS
// -----------------------------------------------------------
/*
Ruta alternativa para visualizar los productos.
Reutiliza la vista "home".

Funciona igual que la ruta raíz:
- HTTP
- Render del lado del servidor
- Sin WebSockets
*/

router.get('/productos', async (req, res) => {
    const productos = await productManager.getProducts();

    res.render('home', {
        titulo: 'Nuestros productos',
        productos,
        hayProductos: productos.length > 0
    });
});


// ===========================================================
// Ruta REAL TIME PRODUCTS
// -----------------------------------------------------------
/*
Renderiza la vista para trabajar con productos en tiempo real.

IMPORTANTE:
Esta ruta NO envía productos desde el backend.
Handlebars solo genera la estructura base de la página.
Toda la lógica de productos se maneja desde el cliente
mediante Socket.io.
*/

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;
