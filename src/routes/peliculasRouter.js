const express = require("express");
const router = express.Router();
const peliculasController = require("../controllers/peliculasController");

router.get("/", peliculasController.getPeliculas);
router.get("/:id", peliculasController.getPeliculasById);
router.post("/", peliculasController.addPelicula);
router.put("/:id", peliculasController.updatePelicula);
router.delete("/:id", peliculasController.deletePelicula);

module.exports = router;
