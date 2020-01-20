const express = require('express');
const router = express.Router();
const usuario = require('../db/request')

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
    usuario.formatoUsuario.create({ nombre: "Jane", apellido: "Doe", email: "example@example.com", pass: "asda3sd" }).then(jane => {
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