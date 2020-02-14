const express = require('express');
const router = express.Router();
const tablas = require('../db/request')

router.post('/contenido',(req,res)=>{
  tablas.Publicaciones.create({  
    idimagen: req.body.idimagen,
    nombreproducto: req.body.nombreproducto,
    empresa: req.body.empresa,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    ciudad: req.body.ciudad,
  }
    ).then(jane => {
  res.status(200)
  res.json(jane)
})

})
router.get("/publicacion/:id", (req, res)=>{
  const id = req.params.id
  tablas.Publicaciones.findAll({
      where:{
      idimagen: id
      }
  }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?[]:res.json(libro)
      
    });
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