import { Product } from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const product = await Product.create({ name, price, stock });
    res.json({ error: false, msg: "Producto creado", product });
  } catch (err) {
    res.status(400).json({ error: true, msg: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ error: false, products });
  } catch (err) {
    res.status(500).json({ error: true, msg: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: true, msg: "Producto no encontrado" });
    }
    res.json({ error: false, product });
  } catch (err) {
    res.status(500).json({ error: true, msg: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: true, msg: "Producto no encontrado" });
    }

    await product.update({ name, price, stock });
    res.json({ error: false, msg: "Producto actualizado", product });
  } catch (err) {
    res.status(400).json({ error: true, msg: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: true, msg: "Producto no encontrado" });
    }

    await product.destroy();
    res.json({ error: false, msg: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: true, msg: err.message });
  }
};
