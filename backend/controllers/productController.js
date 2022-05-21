exports.getAllProducts = (req, res) => {
  res.status(200).json({
    message: "All products fetched successfully",
  });
};
