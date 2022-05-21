/*
    Event routes
    /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events.controller');
const { isDate } = require('../helpers/isDate');
const validarCampos = require('../middlewares/validarCampos');
const validateJwt = require('../middlewares/validateJWT');
const router = Router();

//se habilita que pida token para cualquier peticion de events
router.use(validateJwt);
//Obtener eventos
router.get('/',[],getEvents);

//Crear un nuevo evento
router.post('/',[
    check('title','Title is required').notEmpty(),
    check('start','Start date is required').custom(isDate),
    check('end','End date is required').custom(isDate),
    validarCampos
],createEvent);

//Actualizar un evento
router.put('/:id',[
    check('title','Title is required').notEmpty(),
    check('start','Start date is required').custom(isDate),
    check('end','End date is required').custom(isDate),
    validarCampos
],updateEvent);

//Borrar evento
router.delete('/:id',[],deleteEvent);

module.exports = router;