
const express = require('express');
const datos = require('./empaquetado');
const router = express.Router();
const usuario = require('../db/request')

var path = require('path');

router.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname, '../web/registro.html'))
})
router.get("recuperar/:productID", (req, res)=>{
    const my = req.params.productID;
    usuario.formatoUsuario.findAll({
        where:{
            id: my
        }
    }).then(libro => {
        try{
            console.log("All users:", JSON.stringify(libro));
            res.status(200)
            res.json(libro)
        }catch{
            console.log('error')
        }
        
      });
})
router.get('/crearUsr',(req,res)=>{
  
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