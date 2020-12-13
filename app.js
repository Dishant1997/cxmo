const Express = require('express');
const bodyParser = require('body-parser');
var wallet = require('./routes/wallet.routes');
const app = Express();
var web3 = require('./web3');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var cors = require('cors')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//access control
app.use(cors());

//const config = require('./config.js');
var indexRouter = require('./routes/index');

app.use(Express.static(path.join(__dirname, 'public')));  
// for file upload  
app.use('/uploads',Express.static('uploads')); 
app.use('/profile',Express.static('profile'));  
app.use('/tours',Express.static('tours'));  

//route 
app.use('/', indexRouter);
app.use('/wallet', wallet);

//catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
  
//error handler
app.use((err, req, res, next) => { 
  console.log(req);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  // logger.info(err)
  res.status(err.status || 500);
  res.json({ error: err });
}); 
//db sync
const db = require("./models"); 
module.exports = app;