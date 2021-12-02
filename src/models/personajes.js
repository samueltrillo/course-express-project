const mongoose = require("mongoose");

const personajesSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  img: {
    type: String,
  },
  aparicion: {
    type: String,
  },
  casa: {
    type: String,
    required: true,
    enum: ["DC", "Marvel"],
  },
});

module.exports = mongoose.model("Personajes", personajesSchema);
