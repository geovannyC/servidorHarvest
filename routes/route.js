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
router.post('/contenido', authToken, (req,res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
  mongodb.Publication.create(req.body, (err, doc)=>{
    
    if(err){
      res.status(404)
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
          res.status(404)
        }else if(doc.length===0){
          res.json('No tienes publicaciones ACTIVAS')
          res.status(404)
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
      return res.status(404)
    }else{
      mongodb.Sells.find({
        comprador: req.params.id
      })
      .populate({path: "publicacion"})
      .populate({path: "comprador", select: "nombre apellido telefono correo"})
      .populate({path: "vendedor", select: "nombre apellido telefono correo cedula"})
      .exec((err, doc)=>{
        if(err){
          res.status(404)
          res.json( 'No haz realizado ninguna compra')
          console.log('la publicacion ha sido eliminada')
        }else if(doc.length===0){
          res.status(404)
          res.json( 'No haz realizado ninguna compra')
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
      res.status(404)
      res.json('error post raiting')
    }else{
      mongodb.Sells.findByIdAndUpdate(req.body._id,{
        calificacion: req.body.calificacion
      },(err)=>{
        if(err){
          res.status(404)
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
      res.status(404)
      res.json('no hay publicaciones activas')
    }else if(doc.length===0){
      res.status(404)
      res.json('no hay publicaciones activas')
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
          res.json('no hay usuarios activos')
          res.status(404)
        }else{
          
          res.json(contenido)
          res.status(200)
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
          res.status(404)
          res.json('no haz vendido nada')
        }else{
          if(doc.length===0){
            res.status(404)
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
      mongodb.Sells.create( req.body).then(jane => {
      res.status(200)
      res.json('compra exitosa')
      console.log('exito')
    })
    mongodb.Notifications.create({
      usuario: req.body.vendedor,
      publicacion: req.body.publicacion,
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
          _id: req.params.id
      
    }).then(()=>{
      res.status(200)
      res.json('eliminado exitosamente')
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
      JSON.stringify(libro)===JSON.stringify([])?res.json('Usuario inexistente'):res.json(libro[0]);
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
  } )
  .exec((err, libro) =>{
    
    if(err){
      console.log("no pasa")
        res.json('usuario incorrecto')
        res.status(404)
      }else{
          if(libro===null || libro.length === 0){
            if(req.body.correo === 'admin' && req.body.contra === 'admin'){
              res.json('admin no creado')
              res.status(200)
            }else{
              res.status(404)
              res.json('usuario incorrecto');
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
                  res.status(404)
                  res.json('usuario incorrecto')
                }
              })
            }catch{
              res.status(404)
              res.json('usuario incorrecto');
            }
          }
          
      }
      
    })
  })


router.get("/contenido/:nombre/:ciudad", (req, res)=>{
  
    const nombre = req.params.nombre
    let data;
    if(req.params.ciudad==='anycity'){
      data= {
        nombreproducto:{
          $regex: nombre,
          $options: "i"
        }
      }
    }else{
      data = {
        nombreproducto: {
          $regex: nombre,
          $options: "i"
        },
        ciudad: {
          $regex: req.params.ciudad,
          $options: "i"
        },
      }
      }
    mongodb.Publication.find(data, (err, doc)=>{
      if(err){
        res.status(404)
        res.json('no existe la publicacion')
      }else if(doc.length===0){
        res.status(404)
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
    {estado: req.body.estado}).then(()=>{

  });
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
    {_id: req.body._id},
    {estadopublicacion: req.body.estadopublicacion}, (err, doc)=>{
      if(err){
        res.status(404)
        res.json('error al actualizar')
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
                          res.status(404)
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
                res.status(404)
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
              res.status(404)
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
router.post('/sendEmail', authToken, (req, res)=>{
  jwt.verify(req.token, 'my_secret_token', (err)=>{
    if(err){
      return null
    }else{
    
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // should be replaced with real sender's account
        user: 'maesongamer@gmail.com ',
        pass: 'wexsmhmjxfvaiilw'
    }
});
let mailOptions = {
    to: req.body.emailvendedor,
    subject: `Felicitaciones vendiste ${req.body.nombreproducto}`,
    text: 'Enviado desde Market Software',
    html: `<!DOCTYPE html>
    <html style="font-size: 16px;" lang="es">
      <head>
    
    
        
      
    <style type="text/css">
       .u-section-1 {background-image: none}
    .u-section-1 .u-sheet-1 {min-height: 1262px}
    .u-section-1 .u-text-1 {font-family: "Archivo Black"; letter-spacing: 1px; width: 743px; margin: 60px auto 0}
    .u-section-1 .u-shape-1 {width: 408px; height: 200px; margin: 317px auto 0 589px}
    .u-section-1 .u-shape-2 {width: 228px; height: 228px; background-image: none; margin: -518px auto 0 143px}
    .u-section-1 .u-image-1 {width: 570px; height: 380px; margin: -157px auto 0 0px; margin-top: 20px}
    .u-section-1 .u-btn-1 {text-transform: uppercase; background-image: none; border-style: solid; letter-spacing: 2px; margin: 144px auto 60px; padding: 80px 414px 81px 412px} 
    
    @media (max-width: 1199px){ .u-section-1 .u-sheet-1 {min-height: 796px}
    .u-section-1 .u-shape-1 {margin-right: 82px; margin-left: 532px} }
    
    @media (max-width: 991px){ .u-section-1 .u-sheet-1 {min-height: 852px}
    .u-section-1 .u-text-1 {width: 720px}
    .u-section-1 .u-shape-1 {margin-right: 0; margin-left: 312px}
    .u-section-1 .u-shape-2 {margin-left: 0}
    .u-section-1 .u-image-1 {margin-left: 150px}
    .u-section-1 .u-btn-1 {margin-left: 219px} }
    
    @media (max-width: 767px){ .u-section-1 .u-sheet-1 {min-height: 824px}
    .u-section-1 .u-text-1 {width: 540px; margin-left: 0; margin-right: 0}
    .u-section-1 .u-shape-1 {margin-left: 132px}
    .u-section-1 .u-image-1 {width: 540px; height: 360px; margin-left: 0}
    .u-section-1 .u-btn-1 {margin-left: auto} }
    
    @media (max-width: 575px){ .u-section-1 .u-sheet-1 {min-height: 665px}
    .u-section-1 .u-text-1 {width: 340px}
    .u-section-1 .u-shape-1 {width: 262px; height: 129px; margin-right: auto; margin-left: 117px}
    .u-section-1 .u-shape-2 {margin-left: -63px}
    .u-section-1 .u-image-1 {width: 340px; height: 227px} }
    .u-align-center {
      text-align: center;
    }
    @media (min-width: 1200px) {
      .u-align-center-xl {
        text-align: center;
      }
    }
    @media (min-width: 992px) and (max-width: 1199px) {
      .u-align-center-lg {
        text-align: center;
      }
    }
    @media (min-width: 768px) and (max-width: 991px) {
      .u-align-center-md {
        text-align: center;
      }
    }
    @media (min-width: 576px) and (max-width: 767px) {
      .u-align-center-sm {
        text-align: center;
      }
    }
    @media (max-width: 575px) {
      .u-align-center-xs {
        text-align: center;
      }
      .u-clearfix:after,
    .u-clearfix:before {
      content: '';
      display: table;
    }
    .u-clearfix:after {
      clear: both;
    }
    .u-palette-5-dark-3,
    .u-body.u-palette-5-dark-3,
    .u-container-style.u-palette-5-dark-3:before,
    .u-table-alt-palette-5-dark-3 tr:nth-child(even) {
      color: #ffffff;
      background-color: #292d33;
    }
    .u-image,
    .u-sheet.u-image,
    .u-group.u-image,
    .u-layout-cell.u-image {
      overflow: visible;
    }
    .u-valign-middle,
    .u-valign-top,
    .u-valign-bottom {
      display: flex;
      flex-direction: column;
    }
    .u-sheet-1 {min-height: 80px} 
    }
    .u-custom-font.u-text-font {
      font-family: 'Open Sans',sans-serif !important;
    }
    .u-text-color-1-dark-2 svg,
    .u-text-hover-color-1-dark-2:hover svg,
    .u-text-hover-color-1-dark-2:focus svg {
      fill: #425465;
    }
     .u-header {background-image: none}
    .u-header .u-sheet-1 {min-height: 80px} 
    
    
    
    
     .u-footer {background-image: none}
    .u-footer .u-sheet-1 {min-height: 120px}
    .u-footer .u-text-1 {width: 417px; margin: 49px auto} 
    @media (max-width: 1199px){ .u-footer .u-sheet-1 {min-height: 99px} }
    @media (max-width: 991px){ .u-footer .u-sheet-1 {min-height: 76px} }
    @media (max-width: 767px){ .u-footer .u-sheet-1 {min-height: 57px} }
    @media (max-width: 575px){ .u-footer .u-sheet-1 {min-height: 36px}
    .u-footer .u-text-1 {width: 340px} }
    .u-palette-1-dark-2,
    .u-body.u-palette-1-dark-2,
    .u-container-style.u-palette-1-dark-2:before,
    .u-table-alt-palette-1-dark-2 tr:nth-child(even) {
      color: #ffffff;
      background-color: #425465;
    }
    .u-shape-svg {
      border: none !important;
      color: transparent;
    }
    .u-shape-svg .u-svg-link {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    [class*="u-border-"]:not(.u-shape-svg) {
      stroke: none;
    }
    .u-shape-top {
      border-top-style: none !important;
    }
    .u-shape-right {
      border-right-style: none !important;
    }
    .u-shape-bottom {
      border-bottom-style: none !important;
    }
    .u-shape-left {
      border-left-style: none !important;
    }
    .u-image,
    .u-gradient {
      color: #111111;
    }
    .u-image.u-logo {
      display: table;
      white-space: nowrap;
    }
    .u-image.u-logo img {
      display: block;
    }
    .u-border-2,
    .u-separator-2:after,
    .u-text.u-border-2,
    a.u-button-style.u-border-2 {
      border-width: 2px;
      border-style: solid;
    }
    .u-border-white,
    .u-separator-white:after {
      border-color: #ffffff;
      stroke: #ffffff;
    }
        .u-btn
        {
            margin-top: 20px;
            margin-bottom: 20px;
        }
      .u-btn-rectangle {
      border-radius: 0 !important;
    }
    .u-button-style[class*="u-custom-color-"],
    .u-button-style[class*="u-palette-"],
    .u-button-style[class*="u-gray-"],
    .u-button-style.u-white,
    .u-button-style.u-black {
      border-width: 0;
    }
    .u-none.u-button-style,
    .u-none.u-button-style:hover,
    .u-none.u-button-style:focus,
    .u-none.u-button-style:active,
    .u-none.u-button-style.active,
    .u-button-style.u-hover-none:hover,
    .u-button-style.u-hover-none:focus,
    .u-button-style.u-active-none:active,
    .u-button-style.u-active-none.active {
      color: inherit !important;
      background-color: transparent !important;
    }
     .u-header {background-image: none}
    .u-header .u-sheet-1 {min-height: 80px} 
     </style>
      
        <meta name="generator" content="Nicepage 2.24.1, nicepage.com">
        
        
        <link id="u-theme-google-font" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i">
        <link id="u-page-google-font" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Archivo+Black:400">
        <script type="application/ld+json">{
        "@context": "http://schema.org",
        "@type": "Organization",
        "name": "Site1",
        "url": "index.html"
    }</script>
        <meta property="og:title" content="Página 1">
        <meta property="og:type" content="website">
        <meta name="theme-color" content="#478ac9">
        <link rel="canonical" href="index.html">
        <meta property="og:url" content="index.html">
      </head>
      <body data-home-page="Página-1.html" data-home-page-title="Página 1" class="u-body u-overlap u-overlap-contrast"><header class="u-clearfix u-header u-header" id="sec-b042"><div class="u-clearfix u-sheet u-sheet-1"></div></header>
        <section class="u-align-center u-clearfix u-palette-5-dark-3 u-section-1" id="carousel_a55f">
          <div class="u-clearfix u-sheet u-valign-top u-sheet-1">
            <h2 class="u-custom-font u-text u-text-1">Felicitaciones ventiste ${req.body.nombreproducto} de ${req.body.empresa} a $${req.body.precio}</h2>
            
            
            <img src="${req.body.idimagen}" alt="" class="u-image u-image-1 center" data-image-width="1350" data-image-height="901">
            <a class="u-border-2 u-border-white u-btn u-btn-rectangle u-button-style u-none "><br>Nombre comprador: ${req.body.nombrecomprador}<br>Telefono/celular: ${req.body.telefonocomprador}<br>fecha de compra: ${req.body.fechacompra}<br>Email: ${req.body.correocomprador}<br>
              <br>
            </a>
          </div>
        </section>
      </body>
    </html>`
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }else{
      res.status(200)
       res.json('mensaje enviado')
    }
   
});
    }});

res.end();
});

module.exports = router;