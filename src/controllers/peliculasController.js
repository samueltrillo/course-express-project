const models = require("../models");

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

module.exports = {
  getPeliculas,
};
