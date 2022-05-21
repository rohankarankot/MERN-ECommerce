const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      usenewurlparser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log("Connected to MongoDB" + data.connection.host);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
