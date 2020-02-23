const express = require('express'),

  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');
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
router.get("/publicaciones", (req, res)=>{
  tablas.Contenidos.findAll().then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json([]):res.json(libro);
      console.log(libro)
    });
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
router.post('/send-email', (req, res)=>{
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // should be replaced with real sender's account
        user: 'maesongamer@gmail.com',
        pass: 'm@rcelo272'
    }
});
let mailOptions = {
    // should be replaced with real recipient's account
    to: 'marloncasagallo@gmail.com',
    subject: 'hola',
    body: 'soy shoo'
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});

res.end();
});

module.exports = router;