require('dotenv').config();
const express = require('express'),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');

const router = express.Router();
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const mongodb = require('../model/models')
const base = require('../db/db');
const { mongo } = require('../db/db');
const { Persons } = require('../model/models');
const { json } = require('express');
const USER = process.env.USER
const PASS = process.env.PASS
let transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      // should be replaced with real sender's account
      user: USER,
      pass: PASS
  }
});
router.post('/contenido', authToken, (req,res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
  mongodb.Publication.create(req.body, (err, doc)=>{
    
    if(err){
      res.status(204)
      res.json('fallo en el servidor')
    }else{
      res.status(200)
      res.json('Tu publicacion ha sido creada con éxito')
    }
  })
    }})
})
router.get("/ventas/:id" , authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
      mongodb.Sells.find({
          vendedor: req.params.id
      })
      .populate({path: "publicacion"})
      .populate({path: "comprador", select: "nombre apellido telefono correo"})
      // .populate({path: "vendedor", select: "nombre apellido telefono correo cedula"})
      .exec((err, doc)=>{
        if(err){
          res.json('No tienes publicaciones ACTIVAS')
          res.status(204)
        }else if(doc.length===0){
          res.json('No tienes publicaciones ACTIVAS')
          res.status(204)
        }else{
          res.json(doc)
          res.status(200)
        }
      })
    }
  })
})
router.get("/compras/:id", authToken,(req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      console.log('sin token')
      return res.status(204).send( 'No haz realizado ninguna compra')
    }else{
      mongodb.Sells.find({
        comprador: req.params.id
      })
      .populate({path: "publicacion"})
      .populate({path: "comprador", select: "nombre apellido telefono correo"})
      .populate({path: "vendedor", select: "nombre apellido telefono correo cedula"})
      .exec((err, doc)=>{
        if(err){
          
          res.status(204).send( 'No haz realizado ninguna compra')
        
        }else if(doc.length===0){
          res.status(204).send('No hay publicaciones activas')
         
    
        }else{
          res.status(200)
          res.json(doc)
        }
      })
    }})
})
router.post("/raiting", authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return err
    }else{
  mongodb.Publication.updateOne({
    _id: req.body._idPub
  },{
    $push: {
      calificacion: [req.body.calificacion]
    }
  },(err)=>{
    if(err){
      res.status(204)
      res.json('error post raiting')
    }else{
      mongodb.Sells.findByIdAndUpdate(req.body._id,{
        calificacion: req.body.calificacion
      },(err)=>{
        if(err){
          res.status(204)
          res.json('error post raiting')    
        }else{
          res.status(200)
          res.json('calificado')
          console.log('calificado')
        }
      })
     
    }
  })
}
})
})
router.get("/publicaciones", (req, res)=>{

  mongodb.Publication.find({})
  .populate({path: "usuario", select: "estado"})
  .exec((err,doc)=>{
    if(err){
      res.status(204).send('no hay publicaciones activas')
    }else if(doc.length===0){
      res.status(204).send('no hay publicaciones activas')
    }else{
     res.status(200)
     res.json(doc)
    }
  })
  

}
)
router.get("/usuarios", authToken, (req, res)=>{
  jwt.verify(req.headers.autorizations, 'my_secret_token', (err)=>{
    if(err){
      return err
    }else{
      mongodb.Persons.find().then(contenido => {
        if(contenido.length===0){
         
          res.status(204).send('no hay usuarios activos')
        }else{
          res.status(200)
          res.json(contenido)
          
        }
      })
    }})
})
router.get("/notificaciones/:id", authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return err
    }else{
      mongodb.Notifications.find({
          usuario: req.params.id
      })
      .populate({path: "usuario", select: "nombre apellido"})
      .populate({path: "publicacion", select: "nombreproducto idimagen"})
      .exec((err, doc )=>{
        
        if(err){
          res.status(204).send('no haz vendido nada')
        }else{
          if(doc.length===0){
            res.status(204).send('no haz vendido nada')
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
      res.status(204).send('error servidor')
    }else{
      mongodb.Sells.create( req.body, (err, doc)=>{
        if(err){
          res.status(204).send('error servidor')
        }else{
          mongodb.Notifications.create({
            usuario: req.body.vendedor,
            publicacion: req.body.publicacion,
            estado: 'norevisado',
          }, (err, doc)=>{
            if(err){
              res.status(204).send('error servidor')
            }else{
              res.status(200)
              res.json('compra exitosa')
              console.log('error servidor')
            }
          })
        }
      })
  
    }})

})

router.post('/borrarPublicacion/:id',authToken,(req,res)=>{
 
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return console.log('no hay token')
    }else{
       mongodb.Publication.remove({
          _id: req.params.id
      
    }).then(()=>{
      res.status(200)
      res.json('eliminado exitosamente')
      console.log('exito')
    })
    }})

    });
    
router.post('/sendnotification',authToken,(req,res)=>{
  const email = req.body.email
  const content = req.body.content
  console.log(req.body)
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    
    if(err){
      res.status(204).send('error servidor')
    }else{
      
        //                  let mailOptions = {
        //   to: email,
        //   subject: `Has sido sancionado.`,
        //   text: `${content}`,
        // }
        // transporter.sendMail(mailOptions, (error, info) => {
        //   if (error) {
        //       return console.log(error);
        //   }else{
            
            res.status(200)
            res.json('enviado exitosamente')
          // }
         
      // });
     
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
  },(err, doc)=>{
    if(err){
      res.status(204).send('Usuario inexistente')
    }else{
      res.status(200)
      res.json(doc[0])
    }
  })
    }})

})
router.get("/getById/:id", (req, res)=>{
  const id = req.params.id
  mongodb.Persons.find({
      "cedula": id
  }, (err, doc)=>{
    if(err || doc.length===0){
      res.status(204).send('Usuario inexistente')
    }else{
      res.status(200)
      res.json('Usuario ya creado')
    }
  }).then(libro => {
    if(JSON.stringify(libro)===JSON.stringify([])){
      
     
    }else{
      
   

    }
    });
})
router.post("/recoveryAccount", (req, res)=>{
 console.log(req.body)
  mongodb.Persons.find({
      "cedula": req.body.ide
  }).then(libro => {
      if(JSON.stringify(libro)===JSON.stringify([])){
        res.status(204).send(('Usuario inexistente'))
      }else{
        const saltRounds = 10
        bcrypt.hash(req.body.provitionalPassword, saltRounds, (err, hash)=>{
          if(err){
            res.status(204).send(('Usuario inexistente'))
          }else{
            mongodb.Persons.findByIdAndUpdate(
              libro[0]._id,
            {contra: hash},(err, result)=>{
              console.log(result)
              if(err){
                res.status(204).send(('Usuario inexistente'))
              }else{
                res.status(200)
                res.json(result.correo)
      //                   let mailOptions = {
      //     to: result.correo,
      //     subject: `Recuperación de cuenta`,
      //     text: `Tu contraseña provicional es ${req.body.provitionalPassword}, recuerda cambiar tu contraseña tan pronto ingreses a tu cuenta`,
      //   }
      //   transporter.sendMail(mailOptions, (error, info) => {
      //     if (error) {
      //         return console.log(error);
      //     }else{
          
      //     }
         
      // });
              }
            })
          }
        })
   
      

        
      }
  
    });
    

})
router.post("/datausr", authToken ,(req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
      const id = req.body._id
      mongodb.Publication.find({
          usuario: id
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
  console.log(req.body.correo)
  mongodb.Persons.find({
      "correo": req.body.correo
  },(err, doc)=>{
    if(err || doc.length===0){
      res.status(204).send('usuario inexistente')
      
    }else{
      
      res.status(200)
      res.json('usuario ya registrado')
      
    }
  }
)
})
router.post("/login", (req, res)=>{

  mongodb.Persons.find({
      "correo": req.body.correo,
  } )
  .exec((err, libro) =>{
    console.log(libro)
    if(err || libro.length===0){
  
        res.status(204).send(('usuario incorrecto'))
      }else{
        if(libro[0].estado==="SuperUsuarioInhabilitado"){
          res.status(204).send('usuario incorrecto');
        }else{
          if(libro===null || libro.length === 0){
            if(req.body.correo === 'admin' && req.body.contra === 'admin'){
              
              res.status(200)
              res.json('admin no creado')
            }else {
              res.status(204).send('usuario incorrecto');
              
            }
          }else{
            try {
              bcrypt.compare(req.body.contra, libro[0].contra, (err, result)=>{
                if(result){
                  const token = jwt.sign(req.body.correo, 'my_secret_token')
                  let user = libro[0]
                  // let arr = data.datos[0]["contra"].indexOf()
                  
                  delete user.contra
                  let data = {
                    datos: user,
                    token: token
                  }
                  
                  res.json(data)
                }else{
                  res.status(204)
                  res.json('usuario incorrecto')
                }
              })
            }catch{
              res.status(204)
              res.json('usuario incorrecto');
            }
          }
        }

          
      }
      
    })
  })


router.post("/search", (req, res)=>{
  const data = req.body
    console.log(data)
    let city = req.body.city
    let word = req.body.word
    let dataFilt;
    if(city==='any'){
      dataFilt = {nombreproducto: {$in: word}}
    }else if(word==='any'){
      dataFilt = {ciudad: {$in: city}}
    }else if(city!=='any' && word!=='any'){
      dataFilt = {nombreproducto: {$in: word}, ciudad: {$in: city}}
    }
    // const nombre = req.params.nombre
    // const ciudad = req.params.ciudad
    // console.log(nombre,ciudad)
    // let data = {
    //   nombreproducto: {
    //     $all: nombre
    //   },
    // }
    // if(ciudad==='anycity'){
    //   data= {
    //     nombreproducto:{
    //       $regex: nombre,
    //       $options: "i"
    //     }
    //   }
    // }else{
    //   data = {
    //     nombreproducto: {
    //       $regex: nombre,
    //       $options: "i"
    //     },
    //     ciudad: {
    //       $regex: ciudad,
    //       $options: "i"
    //     },
    //   }
    //   }
    mongodb.Publication.find(dataFilt, (err, doc)=>{  
  

      if(err){
        res.status(204)
        res.json('no existe la publicacion')
      }else if(doc.length===0){
        res.status(204)
        res.json('no existe la publicacion')
      }else{
        res.status(200)
        res.json(doc)
      }
    })
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
        mongodb.Persons.findByIdAndUpdate(
          req.body._id,
    {estado: req.body.estado}, (err, doc)=>{
      if(err){
        res.status(204).send('error al actualizar')
        res.json
      }else{
        res.status(200)
        res.json('success')
        
      }
    }
    )
    }})  
})
router.post('/actualizarnoti',authToken, (req,res)=>{
  
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
      mongodb.Notifications.updateMany({usuario: req.body._id}
    ,{"$set":{"estado": 'revisado'}},{"multi": true},(err, doc)=>{
      if(err){
        res.status(204).send('error al actualizar')
        console.log('fallo al actualizar notificacion')
      }else{
        res.status(200)
        res.json('success')
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
    {_id: req.body._id},
    {estadopublicacion: req.body.estadopublicacion}, (err, doc)=>{
      if(err){
        res.status(204).send('error al actualizar')
        
      }else{
        res.status(200)
        res.json('success')
        console.log('success')
      }
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
        res.status(204)
        res.json('error')
      }else{
        res.status(200)
        res.json('compra exitosa')
      }
    }
     )
    }})
});
router.post('/actualizardatosusuario', authToken, (req, res)=>{
  const error = {
    res: 'error al actualizar'
  }
  const errorPassword = {
    res: 'contraseña incorrecta'
  }
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
      const token = jwt.sign(req.body.email, 'my_secret_token')
      if(req.body.currentPassword&&req.body.newPassword){
        
        mongodb.Persons.find({
          _id: req.body._id,
      }).then(user => {
          try {
            
            const saltRounds = 10
            bcrypt.compare(req.body.currentPassword, user[0].contra, (err, result)=>{
             
              if(result === true){
                
                bcrypt.hash(req.body.newPassword, saltRounds, (err, hash)=>{
                  try{
                    const newData={
                      telefono: req.body.contact,
                      correo: req.body.email,
                      imagen: req.body.image,
                      contra: hash
                    }
                    const data = {
                      user: req.body.email,
                      token: token,
                      res: 'actualizado',
                    }
                    mongodb.Persons.findByIdAndUpdate(
                      req.body._id,newData,(err, doc)=>{
                        if(err){
                          res.status(204)
                          res.json(error)
                        }else{
                          setTimeout(() => {
                            res.status(200)
                            res.json(data)
                          }, 3000);
                         
                        }
                      }
                    )
                }catch{
                  
                    res.json(errorPassword)
                }
                })
              }else{
                res.status(204)
                res.json(errorPassword)
              }
            })
          } catch {
            
            res.json(errorPassword)
          }
        });
      }else{
        const newData={
          telefono: req.body.contact,
          correo: req.body.email,
          imagen: req.body.image,
        }
        mongodb.Persons.findByIdAndUpdate(
          req.body._id,newData,(err, doc)=>{
            if(err){
              res.status(204)
              res.json('error al actualizar')
            }else{
              const data = {
                user: req.body.email,
                token: token,
                res: 'actualizado'
              }
              setTimeout(() => {
                res.status(200)
                res.json(data)
              }, 3000);
             
            }
          }
        )
      } 
    }})
})
router.post('/registro',(req,res)=>{
  const saltRounds = 10
  mongodb.Persons.find({"correo": req.body.correo}, (err, data) =>{
    console.log(data)
    if(err || data.length===0){
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
          },(err)=>{
            if(err){
              res.status(204).send('error en el servidor')
            }else{
              res.status(200)
              res.json('creado exitosamente')
            }
          })
      }catch{
          res.status(204)
      }
      })
    }else{
      res.status(204).send('error en el servidor')
    }
  })

})
router.post('/sendEmail', authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      res.status(204).send('error servidor')
    }else{
      res.status(200)
      res.json('email enviado')
    
// let mailOptions = {
//     to: req.body.emailvendedor,
//     subject: `Felicitaciones vendiste ${req.body.nombreproducto}`,
//     text: 'Enviado desde Market Software',
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   if(err){
//     res.status(204).send('error servidor')
//   }else{
//     res.status(200)
//     res.json('mensaje enviado')
//     console.log('error servidor')
//   }
// });
    }});

res.end();
});

module.exports = router;