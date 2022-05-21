const { response } = require("express");
//const { isValidObjectId } = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId;
const Event = require("../models/event.model");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");
  return res.status(200).json({
    ok: true,
    events: events,
  });
};

const createEvent = async (req, res = response) => {
  //Verificar que tenga el evento
  const event = new Event(req.body);
  event.user = req.uid;
  try {
    const saved = await event.save();
    return res.status(200).json({
      ok: true,
      event: saved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please contact the administrator",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const idEvent = req.params.id;
  const validIdEvent = ObjectId.isValid(idEvent);
  if(!validIdEvent){
    return res.status(400).json({
      ok: false,
      msg: "Invalid ObjectId",
    });
  }
  try {
    const event = await Event.findById(idEvent);
    //validamos si el id existe
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Event does not exist with this id",
      });
    }
    //valida si el usuario que esta editando es el dueno del event
    if (event.user.toString() != req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "Can't access edit this event",
      });
    }
    const newEvent = {
      ...req.body,
      user: req.uid,
    };
    //realiza la actualizacion, se pone new en true para que devuelva el actualizado
    const updatedEvent = await Event.findByIdAndUpdate(idEvent, newEvent, {
      new: true,
    });
    return res.status(200).json({
      ok: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please contact the administrator",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const idEvent = req.params.id;
  const validIdEvent = ObjectId.isValid(idEvent);
  if(!validIdEvent){
    return res.status(400).json({
      ok: false,
      msg: "Invalid ObjectId",
    });
  }
  try {
    const event = await Event.findById(idEvent);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Event does not exist with this id",
      });
    }
    //valida si el usuario que esta editando es el dueno del event
    if(event.user.toString() != req.uid){
      return res.status(401).json({
        ok:false,
        msg: "Can't access delete this event",
      });
    }
    
    const deletedEvent = await Event.findByIdAndDelete(idEvent);
    return res.status(200).json({
      ok: true,
      event: deletedEvent
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please contact the administrator",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
