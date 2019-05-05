var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require("passport");
var session = require('express-session');
var config = require("config/index");
var { VERIFY_TOKEN } = require("config/fbwebhook");
var { getFullInfo } = require('services/fbwebhookprocess');
var { directMessage } = require('fbHandle');

require('model/connect');
require('model/schema');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src', 'app', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src', 'app', 'public'), { maxAge: '30 days' }));
app.set('Cache-Control', 'max-age=3000');

app.use(
  session({
    name: 'chatbot_courses',
    proxy: true,
    resave: true,
    secret: "chatbot_courses.secrect", // session secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false /*Use 'true' without setting up HTTPS will result in redirect errors*/,
    }
  })
);

//PassportJS middleware
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions


require('config/passport')(passport);

app.get("/fbwebhook", async (req, res, next) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send();
  }
});

app.post("/fbwebhook", async (req, res, next) => {
  var data = req.body;

  if (data.object == "page") {
    data.entry.forEach(async (pageEntry) => {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      let user = await getFullInfo(pageEntry.messaging, app);
      user.forEach(messagingEvent => {
        directMessage(messagingEvent, app)
      })
    });
    res.status(200).send();
  }
});
require('app/routes')(app)

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
