const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {//catching error globally
    console.log('UNCAUGHT REJECTION! Shutting down...');
    console.log(err);
    process.exit(1);
});

dotenv.config({path: './config.env'});
const app = require('./app');

const DB = process.env.DATABASE;
//console.log(app.get(env))
mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify: false

}).then(con =>{
    //console.log(con.connections);
    console.log('DB connection successful');
    //console.log(process.env);
})

const port = process.env.PORT || 5000;
const server = app.listen(port, ()=>{
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log(err);
    console.log('UNHANDLED REJECTION! Shutting down...');
    //error such as connection to db failed(errors which are out of reach of the system)
    server.close(()=>{
        process.exit(1);
    });
});