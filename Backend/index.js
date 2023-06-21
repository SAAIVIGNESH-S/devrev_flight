require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./app/routes/routes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to the database ");
    app.listen(process.env.PORT || 8080, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.error(`Error connecting to the database. ${err}`);
  });
