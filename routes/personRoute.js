const express=require('express');
const router=express.Router();
const person=require('../models/person');

router.post('/',async (req,res)=>{
  try{
    const data=req.body;
  
    const newPerson=new person(data);
    
    const response=await newPerson.save();
    console.log("data is saved");
    res.status(200).json(response);
  
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});
  }
})
  
router.get('/', async (req,res)=>{
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