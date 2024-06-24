const express = require("express");
const dotEnv = require("dotenv")
const mongoose = require("mongoose")
const vendor =require("./route/vendorRoutes");
const bodyparser = require("body-parser")
const firmRoutes = require("./route/firmRoutes")
const productRoutes = require("./route/productRoutes")
const cors = require('cors')
const path = require('path')
const app = express();

const PORT =4001;
dotEnv.config();
app.use(cors())
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Connected Mongo DB Succesfully!"))
.catch((error)=>console.log(error))

app.use(bodyparser.json())
app.use('/vendor', vendor)
app.use('/firm', firmRoutes)
app.use('/product', productRoutes)
app.use('/uploads', productRoutes)

app.listen(PORT,()=>{
    console.log(`Server Started at ${PORT}`)
});

app.use('/',(req,res)=>{
    res.send("Welcome to SUBY")
});

