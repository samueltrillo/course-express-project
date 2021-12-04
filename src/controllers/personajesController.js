const models = require("../models");
const mongoose = require("mongoose");

const objectIdValidator = mongoose.Types.ObjectId;

const getPersonajes = async (req, res) => {
  try {
    const response = await models.Personajes.find();

    return res.status(200).json({
      data: response,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

const getPersonajesById = async (req, res) => {
  try {
    const persojaneId = req.params.id;
    const isValid = objectIdValidator.isValid(persojaneId);

    if (!isValid) {
      return res.status(200).json({
        msg: "El ID ingresado no correspone a un ID generado por MongoDB",
        error: true,
      });
    }
    const response = await models.Personajes.findById(persojaneId);

    if (response) {
      return res.status(200).json({
        data: response,
        error: false,
      });
    } else {
      return res.status(404).json({
        msg: `El personaje con id ${persojaneId} no existe`,
        error: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

const addPersonaje = async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const casa = req.body.casa;

    if (!nombre) {
      return res.status(400).json({
        error: true,
        msg: "El campo nombre es requerido",
      });
    }

    if (!casa) {
      return res.status(400).json({
        error: true,
        msg: "El campo casa es requerido",
      });
    }

    const personaje = new models.Personajes(req.body);
    await personaje.save();
    res.status(200).json({
      data: personaje,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

module.exports = {
  getPersonajes,
  getPersonajesById,
  addPersonaje,
};
