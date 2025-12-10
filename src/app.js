
/// NOTA IMPORTANTE, PENSÉ QUE LA FECHA DE ENTREGA ERA EL LUNES 15/12, RECIEN VI QUE SE ME VENCIÓ, 
// ENTREGO EL TP1 NUEVAMENTE Y A LA BREVEDAD LO MEJORO PARA QUE LO PUEDAN CORREGIR, GRACIAS!




// ===========================================================
// Archivo principal del servidor
// -----------------------------------------------------------
 /* 
 Acá configuro el servidor de Express. 
 Es el punto de entrada de mi backend.
 En este archivo inicializo el servidor, 
 defino el puerto donde va a escuchar (8080) y conecto las rutas principales 
 de mi API (products y carts).
 No contiene lógica, solo organiza el funcionamiento general.
 ===========================================================*/

import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json()); // para leer JSON

// Le indico a Express qué rutas debe manejar y con qué router responder cada una.
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Si alguien entra a http://localhost:8080/ (root),
// el servidor responde con este mensaje para confirmar que está funcionando.
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

//Acá le indico a express en qué puerto debe escuchar las peticiones del cliente
app.listen(PORT, () => {
   // Cuando el servidor arranca correctamente, muestro por consola la URL de acceso.
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});