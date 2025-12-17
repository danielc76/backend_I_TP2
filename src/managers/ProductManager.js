// GESTOR DE products.json
/* ===========================================================
 Esta clase ProductManager es la lógica interna del backend para gestionar los productos
-----------------------------------------------------------
Se comunica directamente con el sistema de archivos, leyendo 
y escribiendo en "products.json".

Nota interna: Los Managers no tienen nada que ver con HTTP ni con Express, no es parte de la API, 
sólo gestiona los datos (leer, agregar, actualizar, borrar).
===========================================================*/

import { promises as fs } from 'fs'; // Importo las funciones de lectura/escritura del sistema de archivos

// Defino la ruta donde se guardan los productos
const path = './src/data/products.json';

// Declaro la clase que se encargará de manejar todos los productos
export default class ProductManager {
// “default” marca que esta clase es la exportación principal del archivo, no va a exportar otra cosa
// entonces al importarlo puedo omitir las llaves en import { ProductManager } from '../managers/ProductManager.js';

// Le pongo async a los métodos porque adentro tengo tareas que tardan (como leer o escribir archivos)
// y necesito poder usar "await" para que espere a que terminen antes de seguir
// async habilita el uso de await
// “then() me permite ejecutar algo cuando la función asincrónica termina,
// sin frenar el resto del código. En cambio, await frena la ejecución hasta que termine.”

// Cuando uso then/catch/finally, el código sigue corriendo sin esperar que termine la función asincrónica.
// Cuando esa función termina (y salió bien), se ejecuta lo que puse dentro del then.
// En cambio, si uso await, el código se frena hasta que esa función termine y devuelva su resultado.


  // -----------------------------------------------------------
  // Obtiene todos los productos desde el archivo JSON y lo devuelve como un array de Objetos, lo llamo desde los otros métodos 
  // -----------------------------------------------------------
  async getProducts() {
    try {
      // Leo el archivo y lo convierto de texto a objeto JavaScript
      const data = await fs.readFile(path, 'utf-8'); //'utf-8' le dice que queremos leerlo como texto, no como datos binarios.
      return JSON.parse(data); //JSON.parse() convierte una cadena de texto JSON en un objeto o array de JavaScript.
    } catch {
      // Si el archivo no existe o hay un error, devuelvo un array vacío
      return [];
    }
  }

  // -----------------------------------------------------------
  // Busca un producto por su ID
  // -----------------------------------------------------------
  async getProductById(id) {
    const products = await this.getProducts();
    // Uso find() para devolver el producto que tenga ese id
    return products.find((p) => p.id == id);
  }

  // -----------------------------------------------------------
  // Agrega un nuevo producto al archivo JSON
  // -----------------------------------------------------------
  async addProduct(product) {
    // no hago validación sobre si recibo una estructura correcta del producto porque ya lo hice en el router
    // Traigo todos los productos existentes
    const products = await this.getProducts();

    // Calculo el nuevo ID (incremental)
    const newId = products.length ? Number(products[products.length - 1].id) + 1 : 1;
    //recordar castear con number sino lo guarda como texto y concatena en vez de sumar


    // Creo el nuevo producto sumando el ID generado al objeto recibido
    const newProduct = { id: newId, ...product };

    // Lo agrego al array
    products.push(newProduct);

    // Guardo el nuevo array en el archivo JSON con formato texto
    await fs.writeFile(path, JSON.stringify(products, null, 2)); 
    // le paso null para decirle “no quiero filtrar nada, guardá todo el array de objetos completo”.
    // el 2 le indica que usa 2 espacios de sangría (indentación) 

    // Devuelvo el producto recién agregado
    return newProduct;
  }

  // -----------------------------------------------------------
  // Actualiza un producto existente según su ID
  // -----------------------------------------------------------
  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();

    // Busco el índice del producto a modificar
    const index = products.findIndex((p) => p.id == id);
    if (index === -1) return null; // Si no existe, devuelvo null

    // Actualizo los campos del producto manteniendo el ID original
    products[index] = { ...products[index], ...updatedFields, id };
//mezcla (spread) el objeto viejo con los nuevos campos, por eso solo actualiza lo que mandás y mantiene lo demás igual

    // Guardo los cambios en el archivo
    await fs.writeFile(path, JSON.stringify(products, null, 2));

    // Devuelvo el producto actualizado
    return products[index];
  }

  // -----------------------------------------------------------
  // Elimina un producto por su ID
  // -----------------------------------------------------------
  async deleteProduct(id) {
    const products = await this.getProducts();

    // Filtro el array quitando el producto con ese ID
    const filtered = products.filter((p) => p.id != id);

    // Guardo el array resultante
    await fs.writeFile(path, JSON.stringify(filtered, null, 2));

    // Devuelvo true si eliminó algo, false si no había coincidencia
    return filtered.length < products.length;
  }
}
