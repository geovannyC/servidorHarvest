const express = require('express');
const app = express(),
bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const morgan = require('morgan');
const productsRoutes = require('../routes/route');
const exhand = require('express-handlebars')
app.use(express.static('src'));
app.engine('.hbs', exhand({
    defaultLayout: 'main',
    layoutsDir: path.join
}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/', productsRoutes);
module.exports = app;