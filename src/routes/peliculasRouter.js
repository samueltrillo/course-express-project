const express = require("express");
const router = express.Router();
const peliculasController = require("../controllers/peliculasController");

router.get("/", peliculasController.getPeliculas);

module.exports = router;
