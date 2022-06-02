const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
app.use(express.json());
app.use(cookieParser());

//route imports
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");

app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);

//middleware for error handling
app.use(errorMiddleware);

module.exports = app;
