const express = require("express");
const router = express.Router();
const personajesController = require("../controllers/personajesController");

router.get("/", personajesController.getPersonajes);
router.get("/:id", personajesController.getPersonajesById);
router.post("/", personajesController.addPersonaje);

module.exports = router;
