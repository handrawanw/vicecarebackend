const express=require("express");
const cors=require("cors");

const app=express();

// database connection
const Connected=require("./dbConnect");
Connected();
// database connection

// cors
const corsConfig=require("./middleware/cors");
// cors

// for form request
app.use(express.urlencoded({extended:true}));
app.use(express.json({}));
// for form request

// Rest API
const RestAPI=require("./router/index");
const ErrorHandler=require("./middleware/errHandler");
app.use("/api/v1",cors(corsConfig),RestAPI,ErrorHandler);
// Rest API

const PORT=process.env.PORT||2021;

app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Server is running ${PORT}`);

});