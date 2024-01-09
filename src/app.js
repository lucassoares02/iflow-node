const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("@routes");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routes);

module.exports = app;
