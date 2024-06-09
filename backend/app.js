var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var dotenv = require("dotenv");
var cors = require("cors");
var MongoStore = require('connect-mongo');
dotenv.config();

var AdmitStudent = require("./routes/Dashboard/AdmitStudent");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var databaseConn = require("./public/javascripts/DatabaseConn");
var generateResult = require("./routes/Dashboard/generateClassResults");
var studentMarksUpdate = require("./routes/Dashboard/fetchStudents");
var updateStudentMarks = require('./routes/Teachers/updateStudentMarks');
var downloadResults = require('./routes/Dashboard/downloadResults');
var updateStudentInfo = require("./routes/Dashboard/updateStudentInfo");
var updateStudent = require("./routes/Teachers/fetchUpdStd");
var login = require('./routes/admin/login');
var teacherAss = require("./routes/Teachers/classesRoute");
var teacherlogin = require("./routes/Teachers/login");
var profile = require("./routes/Teachers/getProfile");
var assign = require("./routes/Teachers/assignmet");
var staff = require("./routes/Dashboard/staffs");
var promotionRoutes = require("./routes/Dashboard/promoteStudents");
var reportForms = require("./routes/Dashboard/reportCards");
var ensureAuthenticated = require("./routes/Teachers/Auth");
var reportform = require("./routes/Dashboard/ReportForm");
var fees = require('./routes/Dashboard/studentFeesUpd');
var feesReport = require("./routes/Dashboard/feesReport");
var exam = require("./routes/Dashboard/exams");
var uploadExam = require("./routes/Teachers/uploadExam");
var app = express();
var uri = process.env.MONGO_URL;
var key = process.env.SECRET_KEY;
var schoolAggregate = require("./routes/Dashboard/schoolAgregate");

databaseConn(uri);

app.use(session({
  secret: key,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: uri}),
  cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
}));

const allowedOrigins = [
  'http://localhost:5173',
  'https://etim.vercel.app',
  'https://teachersportal.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // For legacy browser support
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions))

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post("/AdmitStudent", AdmitStudent);
app.post("/generateResult", generateResult);
app.get('/students/', studentMarksUpdate);
app.put('/students/marks', updateStudentMarks);
app.use("/download-pdf/", downloadResults);
app.use("/students", updateStudentInfo);
app.use("/admin", login);
app.use('/api', updateStudent); 
app.use("/fees",fees);
app.use('/ass',assign);
app.use("/classes", teacherAss);
app.use('/api/auth', teacherlogin);
app.get('/profile/:id', profile);
app.use("/staff",staff)
app.use('/api/promotion', promotionRoutes);
app.get("/api/aggregate",schoolAggregate);
app.post('/generate/reportForms',reportform);
app.get("/download-report",reportForms);
app.get("/fetchFeesReports",feesReport);
app.use("/ip",exam);
app.post("/exams/upload",uploadExam)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.title = err.title;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
