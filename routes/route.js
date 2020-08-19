const express = require('express'),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const mongodb = require('../model/models')
const base = require('../db/db')
router.post('/contenido',(req,res)=>{
  mongodb.Publication.create({
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
      mongodb.Publication.find({
        "_id": id
      })
      // .then(libro => {
       
      //     JSON.stringify(libro)===JSON.stringify([])?res.json('Usuario inexistente'):res.json(libro);
      //     let transporter = nodeMailer.createTransport({
      //       host: 'smtp.gmail.com',
      //       port: 465,
      //       secure: true,
      //       auth: {
      //           // should be replaced with real sender's account
      //           user: '',
      //           pass: ''
      //       }
      //   });
      //   let mailOptions = {
      //       // should be replaced with real recipient's account
      //       to: libro[0]['correo'],
      //       subject: `Tu Publicacion ${usuario.nombreproducto} ha sido creada con éxito, espera su aprobación`,
      //       body: 'Gracias por confiar en nosotros, para verificar que tu publicación cumple con las politicas de la empresa debes esperar 24h hasta su aprobación'
      //   };
      //   transporter.sendMail(mailOptions, (error, info) => {
      //       if (error) {
      //           return null;
      //       }
      //       // console.log('Message %s sent: %s', info.messageId, info.response);
      //   });
        
        // res.end();
        // });
    
  res.status(200)
  res.json(usuario)
})
})
router.get("/ventas/:id", authToken,(req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{

      mongodb.Sells.find({
          "idvendedor": req.params.id
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
      mongodb.Sells.find({
        "idusuario": req.params.id
      }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json('No haz realizado ninguna compra'):res.json(libro);
      
    });  
    }})

})
router.get("/publicaciones", (req, res)=>{
  mongodb.Publication.find().then(libro => {
      if(JSON.stringify(libro)===JSON.stringify([])){
        
        res.json([])
        res.status(200)
      }else{
        res.json(libro)
      }
     
     
    });
})
router.get("/usuarios", authToken, (req, res)=>{
  
  jwt.verify(req.headers.authorization, 'my_secret_token', (err)=>{
    if(err){
      return err
    }else{
        mongodb.Persons.find().then(libro => {
      // console.log(libro)
      JSON.stringify(libro)===JSON.stringify([])?res.json('no hay usuarios activos'):res.json(libro);
    });
    }})
})
router.get("/notificaciones/:id",authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return err
    }else{
      mongodb.Notifications.find({
          "idusuario": req.params.id
      }, (err, doc)=>{
        if(err){
          res.status(404)
          res.json('error DB')
        }else{
          if(doc.length===0){
            res.status(200)
            res.json('no haz vendido nada')
          }else{
            res.status(200)
            res.json(doc)
          }
        }
      })
    }})
  })

router.post('/compra', authToken, (req,res)=>{
  
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      res.status(404)
    }else{
      mongodb.Sells.create(req.body).then(jane => {
      res.status(200)
      res.json('compra exitosa')
      console.log('exito')
    })
    mongodb.Notifications.create({
      idusuario: req.body.idvendedor,
      idimagen: req.body.idimagen,
      nombreproducto: req.body.nombreproducto,
      titulopublicacion: `Haz vendido ${req.body.nombreproducto}`,
      estado: 'norevisado',
    }).then(
      console.log('notificacion almacenada')
    )
    }})

})

router.post('/borrarPublicacion/:id',authToken,(req,res)=>{
 
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return console.log('no hay token')
    }else{
       mongodb.Publication.remove({
          "_id": req.params.id
      
    }).then((data)=>{
      res.status(200)
      res.json('compra exitosa')
      console.log('exito')
    })
    }})

    });
router.get("/getPersonas/:id",authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
  const id = req.params.id
  mongodb.Persons.find({
      "_id": id
  }).then(libro => {
      JSON.stringify(libro)===JSON.stringify([])?res.json('Usuario inexistente'):res.json(libro);
    });
    }})

})
router.post("/datausr", authToken ,(req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
      const id = req.body._id
      mongodb.Publication.find({
          idusuario: id
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
  mongodb.Publication.find({
      idusuario: id
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
  mongodb.Persons.find({
      "_id": id
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
      mongodb.Publication.find({
          idimagen: id  
      }).then(libro => {
          JSON.stringify(libro)===JSON.stringify([])?[]:res.json(libro)
        });
    }
  })
})
router.post("/findEmail", (req, res)=>{ 
  mongodb.Persons.find({
      "correo": req.body.correo
  }).then(libro => {
    if(libro===null||libro.length===0){
      res.json('No hay usuario')
    }else{
      res.json('El usuario ya existe')
    }
  })
})
router.post("/login", (req, res)=>{
  mongodb.Persons.find({
      "correo": req.body.correo,
  }).then(libro => {
    if(libro===null || libro === []){
      res.json('usuario incorrecto');
    }else{
      try {
        bcrypt.compare(req.body.contra, libro[0].contra, (err, result)=>{
          if(result === true){
            const token = jwt.sign(req.body.correo, 'my_secret_token')
            const data = {
              datos: libro,
              token: token
            }
            res.json(data)
          }else{
            res.status(404)
            res.json('usuario incorrecto')
          }
        })
      } catch (error) {
        res.json('usuario incorrecto')
      }
    }
    });
})

router.get("/contenido/:nombre", (req, res)=>{
    const nombre = req.params.nombre
    mongodb.Publication.find({
        "nombreproducto": nombre
    }).then(libro => {

        JSON.stringify(libro)===JSON.stringify([])?[]:res.json(libro)
        
      });
})
// router.post('/destruir/:destruirID',authToken,(req,res)=>{
//   jwt.verify(req.token, 'my_secret_token', (err)=>{
//     if(err){
//       return null
//     }else{
//           const my = req.params.destruirID;
//     usuario.formatoUsuario.destroy({
//         where: {
//           id: my
//         }
//       }).then(destr => {
//         res.json('EXTERMINADO')
//       });
//     }})

      
// })
router.post('/actualizarusuario',authToken, (req,res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
        mongodb.Persons.updateOne(
          {"_id": req.body._id},
    {"estado": req.body.estado}).then(()=>{

  });
  mongodb.Publication.updateOne(
    {"idusuario": req.body._id},
    {"estadousuario": req.body.estadousuario}).then(()=>{

    })
    }})  
})
router.post('/actualizarnoti',authToken, (req,res)=>{
  
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
      mongodb.Notifications.updateMany({idusuario: req.body._id}
    ,{"$set":{"estado": 'revisado'}},{"multi": true},(err, doc)=>{
      if(err){
        res.status(404)
        console.log('fallo al actualizar notificacion')
      }else{
        res.status(200)
        console.log('la noti se actualizo')
      }
    })
    }})  
})
router.post('/estadopublicacion', authToken,(req,res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
  
  mongodb.Publication.updateOne(
    {"id": req.body._id},
    {estadopublicacion: req.body.estadopublicacion}).then(()=>{

    })
    }})
});
router.post('/actualizarpublicacion', authToken,(req,res)=>{
 
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
 
  
  const newData={
    "descripcion": req.body.descripcion,
    "ciudad": req.body.ciudad,
    "precio": req.body.precio
  }
  
  mongodb.Publication.findByIdAndUpdate(
   req.body._id,newData,(err, doc)=>{
      if(err){
        res.status(404)
        res.json('error')
      }else{
        res.status(200)
        res.json('compra exitosa')
      }
    }
     )
    }})
});
router.post('/registro',(req,res)=>{
  const saltRounds = 10
  bcrypt.hash(req.body.contra, saltRounds, (err, hash)=>{
    try{
      mongodb.Persons.insertMany({
        "nombre": req.body.nombre,
        "apellido": req.body.apellido,
        "telefono": req.body.telefono,
        "cedula": req.body.cedula,
        "correo": req.body.correo,
        "contra": hash,
        "estado": req.body.estado,
      }).then(libro => {
        
        JSON.stringify(libro)===JSON.stringify([])?res.json('usuario incorrecto'):res.json(libro)
        })
  }catch{
  
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
   
});

res.end();
});

module.exports = router;