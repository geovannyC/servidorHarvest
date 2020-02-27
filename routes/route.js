const express = require('express'),

  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');
const router = express.Router();
const tablas = require('../db/request')

router.post('/contenido',(req,res)=>{
  tablas.Publicaciones.create({
    idusuario: req.body.idusuario,
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
router.get("/ventas/:id", (req, res)=>{
  tablas.Compras.findAll({
    where: {
      idvendedor: req.params.id
    }
  }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json([]):res.json(libro);
     
    });
})
router.get("/compras/:id", (req, res)=>{
  tablas.Compras.findAll({
    where: {
      idusuario: req.params.id
    }
  }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json('No has realizado ninguna compra'):res.json(libro);
      
    });
})
router.get("/publicaciones", (req, res)=>{
  tablas.Publicaciones.findAll().then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json([]):res.json(libro);
     
    });
})
router.post('/compra',(req,res)=>{
  tablas.Compras.create(req.body).then(jane => {
      res.status(200)
      res.json(jane)
    })
})
router.post('/platillos',(req,res)=>{
  tablas.Platillos.create(req.body).then(jane => {
      res.status(200)
      res.json(jane)
    })
})
router.post('/actualizarPublicacion/:id',(req,res)=>{
  const id = req.params.id
  tablas.Publicaciones.update(req.body,{
      where: {
          id: id
      }
  }).then(jane => {
      res.status(200)
      res.json(jane)
    })
})
router.post('/borrarPublicacion/:id',(req,res)=>{
  tablas.Publicaciones.destroy({
      where: {
          id: req.params.id
      }
    })
    });
router.get("/datausr/:id", (req, res)=>{
  const id = req.params.id
  tablas.Publicaciones.findAll({
    where: {
      idusuario: id
    }
  }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json([]):res.json(libro);
     
    });
})
router.get("/dataPublicacion/:id", (req, res)=>{
  const id = req.params.id
  tablas.personas.findAll({
    where: {
      id: id
    }
  }).then(libro => {
      res.json(libro);
     
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
router.get("/login/:correo/:contra", (req, res)=>{ 
  tablas.personas.findAll({
      where:{
      correo: req.params.correo,
      contra: req.params.contra
      }
  }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json('usuario incorrecto'):res.json(libro)
    });
})

router.get("/contenido/:nombre/:ciudad", (req, res)=>{
    const nombre = JSON.stringify(req.params.nombre)
    const ciudad = JSON.stringify(req.params.ciudad)
    tablas.Publicaciones.findAll({
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
router.post('/registro',(req,res)=>{
  try{
    console.log(req.body)
      tablas.personas.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        cedula: req.body.cedula,
        correo: req.body.correo,
        contra: req.body.contra,
      }).then(libro => {
        
        JSON.stringify(libro)===JSON.stringify([])?res.json('usuario incorrecto'):res.json(libro)
        })
  }catch{
      res.json('usuario incorrecto')
  }
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