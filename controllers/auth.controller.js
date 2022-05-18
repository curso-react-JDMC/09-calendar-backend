const { response } = require("express");
const Usuario = require("../models/usuario.model");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({email});
    //si el usuario existe voy a enviar un usuario de que ya existe
    if(usuario) {
      return res.status(400).json({
        ok: false,
        msg: "user already exists with that email"
      })
    }
    
    usuario = new Usuario(req.body);
    await usuario.save();
    return res.status(201).json({
      ok: true,
      msg: "Register",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact the administrator",
    });
  }
};

const login = (req, res = response) => {
  const { email, password } = req.body;

  res.status(202).json({
    ok: true,
    email,
    password,
  });
};

const renew = (req, res = response) => {
  res.json({
    ok: true,
    msg: "renew",
  });
};

module.exports = { createUser, login, renew };
