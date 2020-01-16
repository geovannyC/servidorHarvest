const express = require('express');
const app = express();
const productsRoutes = require('../routes/route');
//direccion master
app.use('/', productsRoutes);
module.exports = app;