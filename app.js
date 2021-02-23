
const path = require('path');
const logger = require('morgan');
const express = require('express');
const hbs = require('express-handlebars');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const animalsRouter = require('./routes/animals');
const app = express();

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/animals', animalsRouter);


module.exports = app;
