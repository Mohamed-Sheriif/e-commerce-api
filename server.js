const express = require("express");
const morgan = require("morgan");
const dotnev = require("dotenv");

// Routes
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const CategoryRoute = require("./routes/categoryRoute");
const SubCategoryRoute = require("./routes/subCategoryRoute");
const BrandRoute = require("./routes/brandRoute");

dotnev.config({ path: "config.env" });
const app = express();

// Database Connection
dbConnection();

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}
app.use(express.json());

// Mounted Routed
app.use("/api/v1/categories", CategoryRoute);
app.use("/api/v1/subcategories", SubCategoryRoute);
app.use("/api/v1/brands", BrandRoute);

app.use("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware For Express
app.use(globalError);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

// Handling Errors Outside Express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shuting down......");
    process.exit(1);
  });
});
