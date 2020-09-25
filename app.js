const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(session({secret: 'sessssdd', saveUninitialized: true, resave: true}));

app.use('/', routes);
module.exports = app;