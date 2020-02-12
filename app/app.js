const express = require('express');
const app = express();
var cors = require('cors');
const logger = require('morgan');
const productsRoutes = require('../routes/route');
//direccion master
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/', productsRoutes);
module.exports = app;