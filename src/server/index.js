const express = require("express");
const characters = require("../data/personajes.json");
const movies = require("../data/peliculas.json");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

let databaseObject = {};
let characterCollectionObj = {};
let moviesCollectionObj = {};

const dbConnection = async () => {
  const uri =
    "mongodb+srv://samuelt:UdtBX492fB5Kvp9d@cluster0.kjpty.mongodb.net/ejemploDb?retryWrites=true&w=majority";

  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    // Conectar el back con el cluster de MongoDB
    await client.connect();
    databaseObject = await client.db("ejemploDb");
    characterCollectionObj = databaseObject.collection("personajes");
    moviesCollectionObj = databaseObject.collection("peliculas");

    console.log("Cloud DB Connected - Mongo DB");
  } catch (error) {
    console.log(error);
  }
};

dbConnection().catch(console.error);

const mappedCharacters = characters.map((item) => {
  return {
    ...item,
    img: `http://localhost:${PORT}/${item.img}`,
  };
});

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//---- Recurso PERSONAJE ----//

// metodo get de personajes //
app.get("/personajes", async (req, res) => {
  try {
    const allPersonajes = await characterCollectionObj.find({}).toArray();
    res.status(200).send(allPersonajes);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// metodo get por id //
app.get("/personajes/:id", (req, res) => {
  const character = mappedCharacters.find((item) => item.id === req.params.id);

  if (character) {
    res.status(200).send(character);
  } else {
    res.status(404).send(`Cannot find the character with id ${req.params.id}`);
  }
});

// metodo get personajes por casa //
app.get("/personajes/casa/:casa", (req, res) => {
  const character = mappedCharacters.filter(
    (character) => character.casa === req.params.casa
  );

  if (character.length) {
    res.status(200).send(character);
  } else {
    res
      .status(404)
      .send(
        `No pudo encontrarse el/los personajes de la casa ${req.params.casa}`
      );
  }
});

// metodo post para personajes //
app.post("/personajes", (req, res) => {
  const newValues = req.body;

  const response = [...mappedCharacters, newValues];

  res.status(200).send(response);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

// metodo update para personajes ""
app.put("/personajes/:id", (req, res) => {
  const doesItExist = mappedCharacters.some(
    (character) => character.id === req.params.id
  );

  console.log(req.body);

  if (!doesItExist) {
    res
      .status(404)
      .send(
        `No pudo actualizarse el personaje porque no existe personaje con ID ${req.params.id}`
      );
  } else if (Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send(`No pudo actualizarse el personajee porque no existe body`);
  } else {
    const character = mappedCharacters.map((character) => {
      return character.id === req.params.id ? req.body : character;
    });
    res.status(200).send(character);
  }
});

// metodo delete para personajes //

app.delete("/personajes/:id", (req, res) => {
  const doesItExist = mappedCharacters.some(
    (character) => character.id === req.params.id
  );

  if (doesItExist) {
    const character = mappedCharacters.filter(
      (character) => character.id !== req.params.id
    );
    res.status(200).send(character);
  } else {
    res
      .status(404)
      .send("No se pudo eliminar porque no se encontro el registro");
  }
});
