const Product = require("../models/productModel");

//create Product --ADMIN
exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

//get all products --PUBLIC
exports.getAllProducts = async (req, res) => {
  const allProducts = await Product.find();
  res.status(200).json({
    success: true,
    allProducts,
  });
};

//update Product --ADMIN
exports.updateProduct = async (req, res, next) => {
  if (!(await Product.findById(req.params.id, req.body))) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
};

//delete Product --ADMIN
exports.deleteProduct = async (req, res, next) => {
  if (!(await Product.findById(req.params.id))) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

//get Product by id --PUBLIC
exports.getProductDetails = async (req, res, next) => {
  if (!(await Product.findById(req.params.id))) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    success: true,
    product,
  });
};
