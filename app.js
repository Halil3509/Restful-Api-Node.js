var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user_router');
var orderRouter =require('./routes/order_router');

var app = express();

//Bizi engellemeyen bazı uyarıları almamızı engeller kodu sağlama almış oluruz.
mongoose.Promise = global.Promise;

//Database bağlama işlemleri 
const dbURL='mongodb://halililbo:fD8DRaxhX6XjJfRP@cluster0-shard-00-00.qjj48.mongodb.net:27017,cluster0-shard-00-01.qjj48.mongodb.net:27017,cluster0-shard-00-02.qjj48.mongodb.net:27017/baskanlik-secimi-bireysel?ssl=true&replicaSet=atlas-10dmto-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('Data base bağlandı.')).catch((err) => console.log("Database bağlanamadı hata: "+err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use('/uploads',express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/user',userRouter);
app.use('/order',orderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
