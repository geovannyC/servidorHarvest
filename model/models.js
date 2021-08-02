'use strict'
// Cargamos el módulo de mongoose
var mongoose =  require('mongoose');
// Usaremos los esquemas
var Schema = mongoose.Schema;
// Creamos el objeto del esquema y sus atributos
var publib = Schema({
    idimagen: String,
    nombreproducto: String,
    empresa: String,
    descripcion: String,
    precio: String,
    ciudad: String,
    estadopublicacion: String,
    calificacion: Array,
    usuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'persons',
    },
  
},
{ timestamps: true });
const sells = Schema({
    publicacion: {
        type: mongoose.Schema.ObjectId,
        ref: 'Publication',
    },
    vendedor: {
        type: mongoose.Schema.ObjectId,
        ref: 'persons',
    },
    fechacompra: String,
    calificacion: String,
    comprador: {
        type: mongoose.Schema.ObjectId,
        ref: 'persons'
    },
    reportecliente:  String,
    reporteempresa:  String,
},
{ timestamps: true });
const persons = Schema({
    imagen: String,
    nombre: String,
    apellido: String,
    telefono: String,
    cedula: String,
    correo: String,
    contra: String,
    estado: String,
},
{timestamps: true})
const notifications = Schema({
    usuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'persons',
    },
    publicacion: {
        type: mongoose.Schema.ObjectId,
        ref: 'Publication',
    },
    estado: String,
},
{timestamps: true})
const Publication = mongoose.model('Publication', publib),
        Sells = mongoose.model('Sells', sells),
        Persons = mongoose.model('persons', persons),
        Notifications = mongoose.model('Notifications', notifications)
// Exportamos el modelo para usarlo en otros ficheros
module.exports = {
    Publication,
    Sells,
    Persons,
    Notifications
};