const express = require("express");
const peliculasRouter = require("./peliculasRouter");
const personajesRouter = require("./personajesRouter");

const router = express.Router();

router.use("/peliculas", peliculasRouter);
router.use("/personajes", personajesRouter);

module.exports = router;
