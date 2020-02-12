const express = require('express');
const router = express.Router();
const tablas = require('../db/request')


var path = require('path');
router.get("/home",(req, res)=>{
    res.sendFile(path.join(__dirname, '../web/registro.html'))
    
})
router.get("/principal",(req, res)=>{
    res.sendFile(path.join(__dirname, '../web/home.html'))
    
})
router.get("/contenido/:nombre/:ciudad", (req, res)=>{
    const nombre = req.params.nombre
    const ciudad = req.params.ciudad
    tablas.Contenidos.findAll({
        where:{
        nombreproducto: nombre,
        ciudad: ciudad

        }
    }).then(libro => {
        JSON.stringify(libro)===JSON.stringify([])?[]:res.json(libro)
        
      });
})
router.get('/crearUsr/:usr1/:usr2/:usr3/:usr4/:usr5/:usr6',(req,res)=>{
    let nombreUsr = req.params.usr1
    let apellidoUsr = req.params.usr2
    let telefonoUsr = req.params.usr3
    let ciudadUsr = req.params.usr4
    let correo_electUsr = req.params.usr5
    let contraseñaUsr = req.params.usr6
    let datos = {
        nombre: nombreUsr,
        apellido: apellidoUsr,
        telefono: telefonoUsr,
        ciudad: ciudadUsr,
        correo_elect: correo_electUsr,
        contraseña: contraseñaUsr,

    }
    console.log('dos')
    usuario.formatoUsuario.create(datos).then(jane => {
        res.status(200)
        res.json(jane)
      });
})
router.post('/destruir/:destruirID',(req,res)=>{
    const my = req.params.destruirID;
    usuario.formatoUsuario.destroy({
        where: {
          id: my
        }
      }).then(destr => {
        res.json('EXTERMINADO')
      });
      
})
module.exports = router;