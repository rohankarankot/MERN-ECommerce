const Product = require("../models/productModel");

//create Product
exports.createProduct = async (req, res, next) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.status(201).json({
    success: true,
    savedProduct,
  });
};
exports.getAllProducts = (req, res) => {
  res.status(200).json({
    message: "All products fetched successfully",
  });
};
