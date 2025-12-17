// Conexión al servidor mediante WebSockets
const socket = io();

// Referencia al formulario de carga de productos
const form = document.getElementById('formProducto');

// Referencia al contenedor donde se listan los productos
const listaProductos = document.getElementById('listaProductos');

// =====================================================
// Escucha el evento que envía el servidor con los productos
// =====================================================
socket.on('productos', (productos) => {

    // Limpio el listado antes de volver a dibujarlo
    // para evitar duplicaciones
    listaProductos.innerHTML = '';

    // Recorro el array de productos recibido
    productos.forEach(producto => {

        // Creo el HTML de cada producto
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${producto.title}</strong> - $${producto.price}
            <button data-id="${producto.id}">Eliminar</button>
        `;

        // Agrego el producto al listado
        listaProductos.appendChild(li);
    });
});

// =====================================================
// Envío de nuevo producto al servidor
// =====================================================
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtengo los datos del formulario
    const data = {
        title: form.title.value,
        description: form.description.value,
        price: Number(form.price.value),
        stock: Number(form.stock.value),
        category: form.category.value
    };

    // Envío el producto al servidor por WebSockets
    socket.emit('nuevoProducto', data);

    // Limpio el formulario
    form.reset();
});
