/*
    Rutas de usuarios host + /api/auth
*/

const { Router } = require('express');
const { createUser, login, renew } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const validarCampos = require('../middlewares/validarCampos');
const validateJwt = require('../middlewares/validateJWT');
const router = Router();

router.post('/',[
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio, de 6 caracteres').isLength(6),
    validarCampos
],login);

router.post('/new',[
    //middlewares
    check('name','El nombre es obligatorio').notEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio, de 6 caracteres').isLength(6),
    validarCampos
],createUser);

router.get('/renew',[validateJwt],renew);

module.exports = router;