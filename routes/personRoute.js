const express=require('express');
const router=express.Router();
const person=require('../models/person');
const {jwtAuthMiddleware,generateToken}=require('../jwt');

router.post('/signup',async (req,res)=>{
  try{
    const data=req.body;
  
    const newPerson=new person(data);
    
    const response=await newPerson.save();
    console.log("data is saved");

    const payload={
      id:response.id,
      username:response.username
    }

    console.log(JSON.stringify(payload));
    const token=generateToken(payload);
    console.log('Token is :',token);

    res.status(200).json({response:response,token:token});
  
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});
  }
})
  
//login route

router.post('/login', async(req,res)=>{
  try{
    const {username,password}=req.body;
    const user=await person.findOne({username:username});
    if(!user || !(await user.comparePassword(password)))
    {
      return res.status(401).json({error:'Incorrect Username or Password'})
    }

    const payload={
      id:user.id,
      username:user.username
    }

    const token=generateToken(payload);
    res.json({token:token});
  }catch(err){
    console.log(err);
    res.status(500).json({Error:"Internal Server Error"});
  }
})

router.get('/profile',jwtAuthMiddleware,async (req,res)=>{
  try{
    const userData=req.user;
    console.log(userData);
    const response=await person.findById(userData.id);
    res.status(200).json(response);
  }catch(err){
    console.log(err);
    res.status(500).json({Error:"Internal Server Error"});
  }
})

router.get('/',jwtAuthMiddleware,async (req,res)=>{
  try{
    const data= await person.find();
    console.log("data is fetched");
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});
  }
})

router.get('/:workType',async(req,res)=>{
  try{
    const workType=req.params.workType;

    if(workType == 'chef' || workType =='waiter' || workType =='manager')
    {
      const data= await person.find({work:workType});
      console.log("data is fetched");
      res.status(200).json(data);  
    }else{
        res.status(404).json({ERROR:'work not found'});
    }
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});      
  }
});

router.put('/:id', async(req,res)=>{
  try{
    const id=req.params.id;
    const updatedPersonData=req.body;
    const response=await person.findByIdAndUpdate(id,updatedPersonData,{
      new:true,
      runValidators:true
    });

    if(!response){
      res.status(404).json({Error:"person not found"});
    }

    console.log('Data updated');
    res.status(200).json(response);
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});   
  }
});

router.delete('/:id',async(req,res)=>{
  try{
    const id=req.params.id;
    const response=await person.findByIdAndDelete(id);

    if(!response){
      res.status(404).json({Error:"person not found"});
    }

    console.log('Data updated');
    res.status(200).json({Message:"Person Deleted Successfully"});

  }catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});   
  }
})

module.exports=router;