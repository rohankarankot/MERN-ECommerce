const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
var cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors())

//route imports
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");
app.get('/', (req, res) =>
    res.status(200).json({
        success: true,
        message: "route successfull!!!"
    }))
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);

//middleware for error handling
app.use(errorMiddleware);

module.exports = app;
