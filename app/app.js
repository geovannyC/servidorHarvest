
const express = require('express'),
 app = express(),
 path = require('path'),
 cors = require('cors'),
 morgan = require('morgan'),
 productsRoutes = require('../routes/route'),
 exhand = require('express-handlebars');
app.use(express.static('src'));
app.engine('.hbs', exhand({
    defaultLayout: 'main',
    layoutsDir: path.join
}))
app.use(express.json({limit: '2mb', extended: true}))
app.use(express.urlencoded({limit: '2mb', extended: true}))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/', productsRoutes);
module.exports = app;