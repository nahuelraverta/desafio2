// Se importa el módulo fs para manipular archivos y se usa la función promises para trabajar con promesas.
const fs = require('fs').promises;

// Se crea la clase ProductManager
class ProductManager {
  // Se declaran dos propiedades privadas usando el prefijo #.
  #nextId
  #products

  // Se define el constructor de la clase.
  constructor() {
    // Se inicializan las propiedades.
    this.#nextId = 1;
    this.#products = [];
    this.path = './products.json' // Ruta del archivo donde se guardarán los productos.
  }

  // Método para agregar un producto.
  async addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
      // Se verifica que todos los campos estén completos.
      if (!title || !description || !price || !thumbnail || !code || !stock) throw new Error('Todos los campos son obligatorios');

      // Se verifica si ya existe un producto con el mismo código.
      const isExist = this.getProductExists('code', code);
      if (isExist) throw new Error(`El codigo: ${code} ingresado ya existe`);

      // Se agrega el producto al array de productos.
      this.#products.push({
        id: this.#nextId++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      });

      // Se escribe el archivo con los nuevos productos.
      await fs.writeFile(this.path, JSON.stringify(this.#products));

      return `Producto creado con exito`;

    } catch (error) {
      return error;
    }
  }

  // Método para obtener el último ID utilizado.
  async getLastId() {
    try {
      let lastId = this.#nextId;
      const data = await this.getProducts();
      for (let i = 0; i < data.length; i++) {
        if (data[i].id > lastId) {
          lastId = data[i].id
        }
      }
      return lastId + 1;

    } catch (error) {
      return error;
    }
  }

  // Método para obtener todos los productos.
  async getProducts() {
    // return this.#products;
    try {
      // Se lee el archivo con los productos y se retorna el array de productos.
      const data = await fs.readFile(this.path, { encoding: 'utf-8' });
      return JSON.parse(data)

    } catch (error) {
      return error;
    }
  }

  // Método para obtener un producto por su ID.
  getProductById(id) {
    try {
      // Se busca el producto en el array de productos.
      const product = this.#products.find(product => product.id === id);

      // Si no se encuentra el producto, se lanza una excepción.
      if (!product) throw new Error("Not Found");

      return product;

    } catch (error) {
      return error;
    }
  }
  async updateProductById(obj) {
    try {
      // Actualiza el producto que tenga el mismo ID que el objeto dado
      // Sustituye las propiedades antiguas con las nuevas
      this.#products = this.#products.map(item => item.id === obj.id ? { ...item, ...obj } : item);
      // Escribe los nuevos productos en el archivo JSON
      await fs.writeFile(this.path, JSON.stringify(this.#products));
      return `Producto ID: ${obj.id} actualizado con éxito`;
    } catch (error) {
      return error;
    }
  }
  
  async deleteProductById(id) {
    try {
      // Comprueba si el producto existe
      const isExist = this.getProductExists('id', id);
      if (!isExist) throw new Error(`No se encontró el ID: ${id} para eliminar.`);
      // Elimina el producto que tenga el mismo ID que el dado
      this.#products = this.#products.filter(product => product.id !== id);
      // Escribe los nuevos productos en el archivo JSON
      await fs.writeFile(this.path, JSON.stringify(this.#products));
      return `Producto ID: ${id} eliminado con éxito`;
    } catch (error) {
      return error;
    }
  }
  
  getProductExists(key, value) {
    // Devuelve el producto que tenga la propiedad dada igual a un valor dado
    return this.#products.find(product => product[key] === value);
  }
  
  async createFile() {
    try {
      // Intenta leer el archivo JSON
      await fs.readFile(this.path, { encoding: 'utf-8' });
      // Si tiene éxito, carga los productos
      await this.loadProducts();
      // Obtiene el último ID y lo asigna al siguiente ID
      this.#nextId = await this.getLastId();
      return 'El archivo ya se encuentra creado';
    } catch (error) {
      // Si no tiene éxito, crea un archivo vacío
      await fs.writeFile(this.path, '[]',);
      return 'Archivo creado con éxito';
    }
  }
  
  async loadProducts() {
    try {
      // Carga los productos del archivo JSON
      this.#products = await this.getProducts();
    } catch (error) {
      return error;
    }
  }
  }
const item = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
  };
  
  const item2 = {
    title: 'producto prueba2',
    description: 'Este es un producto prueba2',
    price: 150,
    thumbnail: 'Sin imagen',
    code: 'abc456',
    stock: 2
  };
  
  const item3 = {
    title: 'producto prueba3',
    description: 'Este es un producto prueba3',
    price: 100,
    thumbnail: 'Sin imagen',
    code: 'abc789',
    stock: 3
  };
  
  const updateItem = {
    id: 3,
    title: 'producto actualizado',
    description: 'Este es un producto actualizdo',
    price: 12093810391,
    thumbnail: 'Con Imagen',
    code: 'ccc195',
    stock: 25
  };
  
  
  const main = async () => {
    const product = new ProductManager();
    console.log(await product.createFile()); // Crea el archivo products.json si no existe y carga los productos si ya existe
    await product.loadProducts(); // Carga los productos desde el archivo products.json
    console.log(await product.addProduct(item)); // Agrega un nuevo producto
    console.log(await product.addProduct(item2)); // Agrega otro producto
    console.log(await product.addProduct(item3)); // Agrega otro producto más
    console.log(await product.addProduct(item)); // Intenta agregar un producto duplicado (el código del producto ya existe)
    console.log(await product.deleteProductById(2)); // Elimina un producto por su id
    console.log(await product.updateProductById(updateItem)); // Actualiza un producto por su id
  }
  
  main();