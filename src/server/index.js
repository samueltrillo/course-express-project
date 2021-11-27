const express = require("express");
const characters = require("../data/personajes.json");
const movies = require("../data/peliculas.json");

const app = express();
const PORT = 3000;

const mappedCharacters = characters.map((item) => {
  return {
    ...item,
    img: `http://localhost:${PORT}/${item.img}`,
  };
});

app.use(express.static("public"));

//---- Recurso PERSONAJE ----//

// metodo get de personajes //
app.get("/personajes", (req, res) => {
  res.status(200).send(mappedCharacters);
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

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
