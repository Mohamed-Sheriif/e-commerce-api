const express = require("express");
const morgan = require("morgan");
const dotnev = require("dotenv");

// Routes
const dbConnection = require("./config/database");

dotnev.config({ path: "config.env" });
const PORT = process.env.PORT || 3000;
const app = express();

// Database Connection
dbConnection();

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
