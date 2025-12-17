// ===========================================================
// Gestor de carts.json 
// -----------------------------------------------------------
// Similar al ProductManager, pero para los carritos.
// Esta clase CartManager maneja toda la lógica para crear carritos, 
// guardar los productos dentro  
// y mantener actualizada la información en "carts.json".
// ===========================================================

import { promises as fs } from 'fs';

const path = './src/data/carts.json';

export default class CartManager {
  async getCarts() {
    try {
      const data = await fs.readFile(path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async createCart() {
    const carts = await this.getCarts();
    const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await fs.writeFile(path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id == id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id == cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex((p) => p.product == pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.writeFile(path, JSON.stringify(carts, null, 2));
    return cart;
  }
}
