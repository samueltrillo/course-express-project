const models = require("../models");

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

module.exports = {
  getPersonajes,
};
