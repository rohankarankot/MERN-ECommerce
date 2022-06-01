const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const userModel = require("./models/userModel");
app.use(express.json());

//route imports
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");

app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);

//middleware for error handling
app.use(errorMiddleware);

module.exports = app;
