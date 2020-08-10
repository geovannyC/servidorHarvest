;
'use strict'
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/harvest', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  })
    .then(() => {
        console.log("La conexión a la base de datos se ha realizado correctamente")
    
    // CREAR EL SERVIDOR WEB CON NODEJS

})
// Si no se conecta correctamente escupimos el error
.catch(err => console.log(err));

module.exports = mongoose