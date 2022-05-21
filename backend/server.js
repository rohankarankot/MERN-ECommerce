const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// configure the port
dotenv.config({ path: "backend/config/config.env" });
//connect database
connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
