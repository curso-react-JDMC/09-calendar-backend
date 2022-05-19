const { response } = require("express");
const Usuario = require("../models/usuario.model");
var bcrypt = require("bcryptjs");
const generateJWT = require("../helpers/generateJWT");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    //si el usuario existe voy a enviar un usuario de que ya existe
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "user already exists with that email",
      });
    }

    usuario = new Usuario(req.body);

    //Encriptar la contrasenia, salt de 10 por defecto
    var salt = bcrypt.genSaltSync(10);
    //se cambia la contrasenia por el hash encriptado
    usuario.password = bcrypt.hashSync(usuario.password, salt);

    await usuario.save();
    //Generar JWT
    const { id, name } = usuario;
    const token = await generateJWT(id, name);

    return res.status(201).json({
      ok: true,
      uid: id,
      name,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please contact the administrator",
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    //verifica si el email no existe
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Wrong email or password",
      });
    }

    //Confirmar la contrasenia
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Wrong email or password",
      });
    }
    //Generar JWT
    const { id, name } = usuario;
    const token = await generateJWT(id, name);

    return res.status(202).json({
      ok: true,
      uid: id,
      name,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please contact the administrator",
    });
  }
};

const renew = async(req, res = response) => {
  //Generar JWT
  //se extae del req la info del usuario porque se seteo alli por medio del validador de token anterior
  const {uid, name} = req;
  const token = await generateJWT(uid, name);
  res.json({
    ok: true,
    token
  });
};

module.exports = { createUser, login, renew };
