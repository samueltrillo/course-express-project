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

app.get("/peliculas", async (req, res) => {
  try {
    const allPeliculas = await moviesCollectionObj.find({}).toArray();
    res.status(200).send(allPeliculas);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// metodo get por id //
app.get("/personajes/:id", async (req, res) => {
  try {
    const personaje = await characterCollectionObj.findOne({
      id: req.params.id,
    });

    if (!personaje) {
      return res.status(404).send({
        message: `No se encontro el personaje con ID ${req.params.id}`,
      });
    }
    res.status(200).send(personaje);
  } catch (error) {
    return res.status(500).send({
      message: `Ocurrio algun error durante la solicitud`,
      error: error,
    });
  }
});

// metodo get personajes por casa //
app.get("/personajes/casa/:casa", async (req, res) => {
  try {
    const personaje = await characterCollectionObj
      .find({
        casa: req.params.casa,
      })
      .toArray();

    if (!personaje.length) {
      return res.status(404).send({
        message: `No se encontro personaje con casa ${req.params.casa}`,
      });
    }
    res.status(200).send(personaje);
  } catch (error) {
    return res.status(500).send({
      message: `Ocurrio algun error durante la solicitud`,
      error: error,
    });
  }
});

// metodo post para personajes //
app.post("/personajes", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        message: "No pudo añadirse el personaje porque no existe body",
      });
    }

    const newPersonaje = { ...req.body };

    await characterCollectionObj.insertOne(newPersonaje);
    res.status(200).send({
      message: "El personaje fue añadido exitosamente",
    });
  } catch (error) {
    return res.status(500).send({
      message: `Ocurrio algun error durante la solicitud`,
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

// metodo update para personajes ""
app.put("/personajes/:id", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        message: "No pudo actualizarse el personaje porque no existe body",
      });
    }

    const personaje = await characterCollectionObj.findOne({
      id: req.params.id,
    });

    if (!personaje) {
      return res.status(404).send({
        message: "No se encontro el personaje",
      });
    }

    const newValue = {
      $set: {
        nombre: req.body.nombre,
        bio: req.body.bio,
        img: req.body.img,
        aparicion: req.body.aparicion,
        casa: req.body.casa,
      },
    };

    const updateOne = await characterCollectionObj.updateOne(
      { id: req.params.id },
      newValue
    );

    res.status(200).send({
      message: "Se actualizo exitosamente",
      personaje: updateOne,
    });
  } catch (error) {}
  // const doesItExist = mappedCharacters.some(
  //   (character) => character.id === req.params.id
  // );

  // if (!doesItExist) {
  //   res
  //     .status(404)
  //     .send(
  //       `No pudo actualizarse el personaje porque no existe personaje con ID ${req.params.id}`
  //     );
  // } else if (Object.keys(req.body).length === 0) {
  //   res
  //     .status(400)
  //     .send(`No pudo actualizarse el personajee porque no existe body`);
  // } else {
  //   const character = mappedCharacters.map((character) => {
  //     return character.id === req.params.id ? req.body : character;
  //   });
  //   res.status(200).send(character);
  // }
});

// metodo delete para personajes //

app.delete("/personajes/:id", async (req, res) => {
  try {
    const characterDeleteData = await characterCollectionObj.deleteOne({
      id: req.params.id,
    });

    if (!characterDeleteData.deletedCount) {
      return res.status(404).send({
        message: `No se pudo eliminar el personaje con ID ${req.params.id}`,
      });
    }

    const responseMovie = await moviesCollectionObj.deleteMany({
      idPersonaje: req.params.id,
    });

    res
      .status(200)
      .send(
        `El personaje con ID ${req.params.id} fue eliminado exitosamente ${
          responseMovie.deletedCount
            ? "y tambien se eliminaron las peliculas asociadas"
            : ""
        }`
      );
  } catch (error) {
    return res.status(500).send({
      message: `Ocurrio algun error durante la solicitud`,
      error: error,
    });
  }
});
