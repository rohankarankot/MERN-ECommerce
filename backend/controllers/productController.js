const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErorrs = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//create Product --ADMIN
exports.createProduct = catchAsyncErorrs(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//get all products --PUBLIC
exports.getAllProducts = catchAsyncErorrs(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const allProducts = await apiFeatures.query;
  res.status(200).json({
    success: true,
    allProducts,
    productCount,
  });
});

//update Product --ADMIN
exports.updateProduct = catchAsyncErorrs(async (req, res, next) => {
  let product = await Product.findById(req.params.id.trim());
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//delete Product --ADMIN
exports.deleteProduct = catchAsyncErorrs(async (req, res, next) => {
  let product = await Product.findById(req.params.id.trim());
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

//get Product by id --PUBLIC
exports.getProductDetails = catchAsyncErorrs(async (req, res, next) => {
  let product = await Product.findById(req.params.id.trim());
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await Product.findById(req.params.id.trim());
  res.status(200).json({
    success: true,
    product,
  });
});
