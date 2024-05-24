var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var AdmitStudent = require("./routes/AdmitStudent")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var databaseConn = require("./public/javascripts/DatabaseConn")
var dotenv = require("dotenv");
dotenv.config();
var cors = require("cors");
var generateResult = require("./routes/generateClassResults")
var studentMarksUpdate = require("./routes/fetchStudents");
var updateStudentMarks = require('./routes/updateStudentMarks');
var downloadResults = require('./routes/downloadResults');
var updateStudentInfo = require("./routes/updateStudentInfo");

var app = express();
var uri = process.env.MONGO_URL;
var Db = process.env.Db

var connectDB = databaseConn(uri);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.static(__dirname));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post("/AdmitStudent",AdmitStudent);
app.post("/generateResult",generateResult);
app.get('/students',studentMarksUpdate);
app.put('/students/:id/marks',updateStudentMarks);
app.get("/download-pdf/:fileName",downloadResults);
app.use("/students",updateStudentInfo)

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
