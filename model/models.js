'use strict'
// Cargamos el módulo de mongoose
var mongoose =  require('mongoose');
// Usaremos los esquemas
var Schema = mongoose.Schema;
// Creamos el objeto del esquema y sus atributos
var publib = Schema({
    idusuario: String,
    idimagen: String,
    nombreproducto: String,
    empresa: String,
    descripcion: String,
    precio: String,
    ciudad: String,
    estadousuario: String,
    estadopublicacion: String,
},
{ timestamps: true });
const sells = Schema({
    idpublicacion: String,
    idvendedor: String,
    idimagen: String,
    nombreproducto: String,
    empresa: String,
    descripcion: String,
    precio: String,
    ciudad: String,
    fechacompra: String,
    nombrevendedor: String,
    apellidovendedor: String,
    telefonovendedor: String,
    emailvendedor: String,
    cedulavendedor: String,
    idusuario: String,
    nombrecomprador: String,
    apellidocomprador: String,
    correocomprador: String,
    telefonocomprador: String,
},
{ timestamps: true });
const persons = Schema({
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
    idusuario: String,
    idimagen: String,
    nombreproducto: String,
    titulopublicacion: String,
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