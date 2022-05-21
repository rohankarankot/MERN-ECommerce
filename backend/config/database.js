const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((data) => {
      console.log("Connected to MongoDB" + data.connection.host);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
