const models = require("../models");
const mongoose = require("mongoose");
const peliculas = require("../models/peliculas");

const objectIdValidator = mongoose.Types.ObjectId;

const getPeliculas = async (req, res) => {
  try {
    const response = await models.Peliculas.find();

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

const getPeliculasById = async (req, res) => {
  try {
    const peliculaId = req.params.id;
    const isValid = objectIdValidator.isValid(peliculaId);

    if (!isValid) {
      return res.status(200).json({
        msg: "El ID ingresado no correspone a un ID generado por MongoDB",
        error: true,
      });
    }
    const response = await models.Peliculas.findById(peliculaId);

    if (response) {
      return res.status(200).json({
        data: response,
        error: false,
      });
    } else {
      return res.status(404).json({
        msg: `La pelicula con id ${peliculaId} no existe`,
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

const addPelicula = async (req, res) => {
  try {
    const idPersonaje = req.body.idPersonaje;
    const nombrePelicula = req.body.nombrePelicula;

    // validacion idPersonaje

    if (!idPersonaje) {
      return res.status(400).json({
        error: true,
        msg: "El campo del ID del personaje es requerido. Por favor, ingrese el id",
      });
    }

    if (!nombrePelicula) {
      return res.status(400).json({
        error: true,
        msg: "El campo nombre de pelicula es requerido. Por favor, ingrese el nombre de la pelicula",
      });
    }

    const pelicula = new models.Peliculas(req.body);
    await pelicula.save();
    res.status(200).json({
      data: pelicula,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

const updatePelicula = async (req, res) => {
  try {
    const peliculaId = req.params.id;

    const pelicula = await models.Peliculas.findByIdAndUpdate(
      peliculaId,
      req.body,
      { new: true }
    );

    if (pelicula) {
      res.status(200).json({
        error: false,
        data: pelicula,
      });
    } else {
      res.status(404).json({
        error: true,
        msg: "La pelicula no existe",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

const deletePelicula = async (req, res) => {
  try {
    const peliculaId = req.params.id;

    const response = await models.Peliculas.findByIdAndRemove(peliculaId);

    if (response) {
      res.status(200).json({
        error: false,
        data: response,
        msg: `La pelicula fue eliminada exitosamente`,
      });
    } else {
      res.status(400).json({
        error: true,
        msg: "La pelicula no existe",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: error,
      error: true,
    });
  }
};

module.exports = {
  getPeliculas,
  getPeliculasById,
  addPelicula,
  updatePelicula,
  deletePelicula,
};
