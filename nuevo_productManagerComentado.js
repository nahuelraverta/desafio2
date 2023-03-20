// Importar la función "promises" del módulo "fs" para poder utilizar funciones asíncronas.
const fs = require("fs").promises;

// Definir una clase "ProductManager" para manejar una lista de productos.
class ProductManager {
  // El constructor toma una ruta de archivo y carga los productos.
  constructor(path) {
    // Guardar la ruta de archivo en una propiedad.
    this.path = path;
    // Inicializar el identificador "nextId" en 1.
    this.nextId = 1;
    // Inicializar la lista de productos vacía.
    this.products = [];
    // Cargar los productos desde el archivo JSON.
    this.loadProducts();
  }

  // Un método asíncrono para cargar los productos desde el archivo JSON.
  async loadProducts() {
    try {
      // Leer el contenido del archivo JSON.
      const data = await fs.readFile(this.path, "utf-8");
      // Si se encontró contenido en el archivo JSON, guardar los productos y el próximo identificador.
      if (data) {
        this.products = JSON.parse(data);
        const lastProduct = this.products[this.products.length - 1];
        this.nextId = lastProduct.id + 1;
      }
    } catch (error) {
      // Si hay un error al cargar los productos, imprimir un mensaje de error en la consola.
      console.error("Error loading products", error);
    }
  }

  // Un método asíncrono para guardar los productos en el archivo JSON.
  async saveProducts() {
    try {
      // Convertir la lista de productos a formato JSON.
      const data = JSON.stringify(this.products);
      // Escribir la lista de productos en el archivo JSON.
      await fs.writeFile(this.path, data);
    } catch (error) {
      // Si hay un error al guardar los productos, imprimir un mensaje de error en la consola.
      console.error("Error saving products", error);
    }
  }

  // Un método asíncrono para agregar un nuevo producto a la lista de productos.
  async addProduct(product) {
    // Asignar al nuevo producto un identificador único.
    product.id = this.nextId++;
    // Agregar el nuevo producto a la lista de productos.
    this.products.push(product);
    // Guardar los productos en el archivo JSON.
    await this.saveProducts();
  }

  // Un método asíncrono para obtener la lista de productos.
  async getProducts() {
    return this.products;
  }

  // Un método asíncrono para obtener un producto por su identificador.
  async getProductById(id) {
    // Buscar el producto en la lista de productos por su identificador.
    const product = this.products.find((product) => product.id === id);
    // Devolver el producto encontrado.
    return product;
  }

  async deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProducts();
      return true;
    } else {
      return false;
    }
  }


  // Un método asíncrono para actualizar un producto por su identificador.
  async updateProduct(id, product) {
    // Encontrar el índice del producto en la lista de productos.
    const index = this.products.findIndex((product) => product.id === id);
    // Si se encontró el producto en la lista de productos, actualizarlo y guardar los cambios.
    if (index !== -1) {
      this.products[index] = { id, ...product };
      await this.saveProducts();
      return true;
    } else {
      // Si el producto no se encontró en la lista de productos, devolver "false".
      return false;
    }
  }
}
async function test() {
  // Creamos una nueva instancia de ProductManager y le pasamos como argumento la ruta donde se almacenará la información.
  const manager = new ProductManager("./products.json");

  // Añadimos un nuevo producto al manager.
  await manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 10,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });

  // Obtenemos todos los productos del manager y los mostramos por consola.
  console.log(await manager.getProducts());

  // Obtenemos el producto con id 1 del manager y lo mostramos por consola.
  console.log(await manager.getProductById(1));

  // Actualizamos el producto con id 1 del manager y le cambiamos el título.
  await manager.updateProduct(1, { title: "Nuevo producto prueba" });

  // Obtenemos el producto con id 1 del manager y lo mostramos por consola para verificar que se haya actualizado correctamente.
  console.log(await manager.getProductById(1));

  // Borramos el producto con id 1 del manager.
  await manager.deleteProduct(1);

  // Obtenemos todos los productos del manager y los mostramos por consola para verificar que se haya eliminado correctamente el producto con id 1.
  console.log(await manager.getProducts());
}

// Ejecutamos la función test para probar el funcionamiento del código.
test();
