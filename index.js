const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 3000;
const MONGO_URL =
  "mongodb+srv://samuelt:UdtBX492fB5Kvp9d@cluster0.kjpty.mongodb.net/ejemploDb?retryWrites=true&w=majority";

const app = express();
const router = require("./src/routes/index");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(router);

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conectado a la base datos");

    app.listen({ port: PORT }, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    console.log("No fue posible conectarse a la base de datos");
  }
};

connectDb();
