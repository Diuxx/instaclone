require('dotenv/config');
var cors = require('cors')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require('./database/connexion');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var likesRouter = require('./routes/likes');
var uploadRouter = require('./routes/upload');

var app = express();

// socket io
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    credentials: true
  }
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);
app.use('/upload', uploadRouter);
app.use("/public/uploads", express.static(path.join(__dirname, 'public/uploads')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

io.on('connection', (socket) => {
  console.log('<!> Someone just ask to connect <!>');

  socket.on('like', (post) => io.emit('like', post));
  socket.on('unlike', (post) => io.emit('unlike', post));
  socket.on('post', (post) => io.emit('post', post));
  socket.on('post-delete', (post) => io.emit('post-delete', post));
});

http.listen(process.env.IO_PORT, () => {
  console.log(`Server [socket-io] is running on port ${process.env.IO_PORT}`)
});

app.listen(process.env.PORT, () => {
    console.log(`Server [node-js] is running on port ${process.env.PORT}`);
});

module.exports = app;
