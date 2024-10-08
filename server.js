const express=require('express');
const db=require('./db');
const app=express();

require('dotenv').config();
const PORT=process.env.PORT || 3000;

const bodyParser=require('body-parser');
app.use(bodyParser.json());

app.get('/',(req,res)=>{
  res.send("Welocome to my restaurant");
})

//middleware
const logRequest=(req,res,next)=>{
  console.log(`[${new Date().toLocaleString()}] Request made to ${req.originalUrl}`);
  next();
}

app.use(logRequest);

const passport=require('./auth');
app.use(passport.initialize());
const localAuthmiddleware=passport.authenticate('local',{session:false});


const personRoute=require('./routes/personRoute')
app.use('/person',personRoute);

const menuRoute=require('./routes/menuRoute');
app.use('/menu',menuRoute);

app.use(passport.initialize());

app.listen(PORT,()=>{
  console.log("listening on port 3000");
});