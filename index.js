// set environnment variables
require("dotenv").config();

// import dependencies
const express = require("express");
const cors = require("cors");
const formidable = require("express-formidable");
const compression = require("compression");

// set app
const app = express();
app.use(cors());
app.use(formidable());
app.use(compression());

// import & use routes
const charactersRoutes = require("./routes/characters-routes.js");
app.use(charactersRoutes);
const comicsRoutes = require("./routes/comics-routes.js");
app.use(comicsRoutes);

// handle 404 errors
app.all("*", () => {
  res.status(404).json({ message: "Page not found" });
});

// start server
app.listen(process.env.PORT, () => {
  console.log("Server started, got get them Tiger ! 🐯");
});
