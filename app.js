const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
//to prevent our application from threats like ddos or xxs we have defined this feild that for
//every particular ip only 100 request can be sent within a hour
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
//sometimes users enters irreleveant data in the data field and as a developer we have to protect 
//our application from such malware data, so santizing data is the best option using mongoDb
const xss = require('xss-clean');
const hpp = require('hpp');

const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const app = express();
var cors = require("cors");
app.use(cors());

//1) GLOBAL MIDDLEWARES

//SET SECURITY HTTP HEADER
app.use(helmet());
//DEVELOPMENT LOGGING
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//LIMIT REQUEST FROM SAME API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 *1000,
    message: 'Too many request from this IP, please try again in an hour!'
});
// app.use('/api', limiter);

//BODY PARSER, READING DATA FROM BODY INTO REQ.BODY
app.use(express.json({
    limit: '10kb'
}));

//DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

//DATA SANITIZATION AGAINST XSS
app.use(xss());

//PREVENT PARAMETER POLLUTION
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'difficulty',
        'price',
        
    ]
}));

//SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

//TEST MIDDLEWARE
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    next();
});

//2) ROUTES

app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/reviews/', reviewRouter);
app.use("/api/v1/bookings/", bookingRouter);

app.all('*', (req, res, next) => {
    next(new appError(`can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);

module.exports = app;