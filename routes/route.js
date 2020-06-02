const express = require('express'),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt')
const tablas = require('../db/request')
const jwt = require('jsonwebtoken')
router.post('/contenido',(req,res)=>{
  tablas.Publicaciones.create({
    idusuario: req.body.idusuario,
    idimagen: req.body.idimagen,
    nombreproducto: req.body.nombreproducto,
    empresa: req.body.empresa,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    ciudad: req.body.ciudad,
    estadousuario: req.body.estadoUsuario,
    estadopublicacion: req.body.estadoPublicacion
  }
    ).then(usuario => {
      const id = usuario.idusuario
      tablas.Personas.findAll({
        where: {
          id: id
        }
      }).then(libro => {
        console.log(usuario.nombreproducto, JSON.stringify(libro[0]['correo']))
          JSON.stringify(libro)===JSON.stringify([])?res.json('Usuario inexistente'):res.json(libro);
          let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                // should be replaced with real sender's account
                user: '',
                pass: ''
            }
        });
        let mailOptions = {
            // should be replaced with real recipient's account
            to: libro[0]['correo'],
            subject: `Tu Publicacion ${usuario.nombreproducto} ha sido creada con éxito, espera su aprobación`,
            body: 'Gracias por confiar en nosotros, para verificar que tu publicación cumple con las politicas de la empresa debes esperar 24h hasta su aprobación'
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('HUBO UN ERROR');
            }
            // console.log('Message %s sent: %s', info.messageId, info.response);
        });
        
        res.end();
        });

  res.status(200)
  res.json(usuario)
})
})
router.get("/ventas/:id", authToken,(req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
      tablas.Compras.findAll({
        where: {
          idvendedor: req.params.id
        }
      }).then(libro => {
          JSON.stringify(libro)===JSON.stringify([])?res.json('No tienes publicaciones ACTIVAS'):res.json(libro);
         
        });
    }
  })
})
router.get("/compras/:id",authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
      tablas.Compras.findAll({
    where: {
      idusuario: req.params.id
    }
  }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json('No haz realizado ninguna compra'):res.json(libro);
      
    });  
    }})

})
router.get("/publicaciones", (req, res)=>{
  tablas.Publicaciones.findAll().then(libro => {
      if(JSON.stringify(libro)===JSON.stringify([])){
        res.json([])
        res.status(200)
      }else{
        res.json(libro)
      }
     
     
    });
})
router.get("/usuarios", authToken,(req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      console.log('error')
    }else{
        tablas.Personas.findAll().then(libro => {
      // console.log(libro)
      JSON.stringify(libro)===JSON.stringify([])?res.json('no hay usuarios activos'):res.json(libro);
     
    });
    }})

})
router.post('/compra',(req,res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
        tablas.Compras.create(req.body).then(jane => {
      res.status(200)
      res.json(jane)
    })
    }})

})

router.post('/borrarPublicacion/:id',authToken,(req,res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
       tablas.Publicaciones.destroy({
      where: {
          id: req.params.id
      }
    }) 
    }})

    });
router.get("/getPersonas/:id",authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
        const id = req.params.id
  tablas.Personas.findAll({
    where: {
      id: id
    }
  }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json('Usuario inexistente'):res.json(libro);
     
    });
    }})

})
router.post("/datausr/", authToken ,(req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
      const id = req.body.id
      console.log(req.headers['autorizations'])
      tablas.Publicaciones.findAll({
        where: {
          idusuario: id
        }
      }).then(libro => {
          JSON.stringify(libro)===JSON.stringify([])?res.json('No hay publicaciones'):res.json(libro);
         
        });
    }
  })

})
function authToken(req,res,next){
  const bearerheader = req.headers['autorizations']
  if (typeof bearerheader !== 'undefined'){
    req.token = bearerheader
    next()
  }else{
    res.sendStatus(403)
  }
}
router.get("/publicacionesusuario/:id", authToken ,(req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
        const id = req.params.id
  tablas.Publicaciones.findAll({
    where: {
      idusuario: id
    }
  }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json([]):res.json(libro);
     
    });
    }})

})

router.get("/dataPublicacion/:id", authToken,(req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
        const id = req.params.id
  tablas.Personas.findAll({
    where: {
      id: id
    }
  }).then(libro => {
      res.json(libro);
     
    });
    }})

})
router.get("/publicacion/:id",authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err, data)=>{
    if(err){
      res.sendStatus(403)
    }else{
      const id = req.params.id
      tablas.Publicaciones.findAll({
          where:{
          idimagen: id
          }
      }).then(libro => {
          JSON.stringify(libro)===JSON.stringify([])?[]:res.json(libro)
          
        });
    }
  })
})
router.post("/login", (req, res)=>{ 
  
  tablas.Personas.findOne({
      where:{
      correo: req.body.correo,
      }
  }).then(libro => {
    if(!libro){
      res.json('usuario incorrecto');
    }else{
      bcrypt.compare(req.body.contra, libro.contra, (err, result)=>{
        if(result === true){
          const token = jwt.sign(req.body.correo, 'my_secret_token')
          const data = {
            datos: libro,
            token: token
          }
          console.log(JSON.stringify(data.datos) )
          res.json(data)
        }else{
          res.json('usuario incorrecto')
        }
      })
    }
    });
})

router.get("/contenido/:nombre/:ciudad", (req, res)=>{
    const nombre = req.params.nombre
    const ciudad = req.params.ciudad
    tablas.Publicaciones.findAll({
        where:{
        nombreproducto: nombre, 
        ciudad: ciudad

        }
    }).then(libro => {
        JSON.stringify(libro)===JSON.stringify([])?[]:res.json(libro)
        
      });
})
router.post('/destruir/:destruirID',authToken,(req,res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
          const my = req.params.destruirID;
    usuario.formatoUsuario.destroy({
        where: {
          id: my
        }
      }).then(destr => {
        res.json('EXTERMINADO')
      });
    }})

      
})
router.post('/actualizarusuario',authToken, (req,res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
        tablas.Personas.update(
    {estado: req.body.estado},
    {where: {id: req.body.id}}
  ).then(()=>{

  });
  tablas.Publicaciones.update(
    {estadousuario: req.body.estadousuario},
    {where: {idusuario: req.body.id}}).then(()=>{

    })
    }})

    
})
router.post('/actualizarpublicacion', authToken,(req,res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
        console.log(req.body)
  tablas.Publicaciones.update(
    {estadopublicacion: req.body.estadopublicacion},
    {where: {id: req.body.id}}).then(()=>{
      console.log('Publicacion Actualizada')
    })
    }})

    
});
router.post('/registro',(req,res)=>{
  const saltRounds = 10
  bcrypt.hash(req.body.contra, saltRounds, (err, hash)=>{
    try{
      tablas.Personas.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        cedula: req.body.cedula,
        correo: req.body.correo,
        contra: hash,
        estado: req.body.estado,
      }).then(libro => {
        
        JSON.stringify(libro)===JSON.stringify([])?res.json('usuario incorrecto'):res.json(libro)
        })
  }catch{
    console.log('error')
      res.json('usuario incorrecto')
  }
  })

})
router.get('/send', (req, res)=>{
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // should be replaced with real sender's account
        user: '',
        pass: ''
    }
});
let mailOptions = {
    // should be replaced with real recipient's account
    to: '',
    subject: 'hola',
    body: 'soy shoo'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    // console.log('Message %s sent: %s', info.messageId, info.response);
});

res.end();
});

module.exports = router;