const express=require('express');
const router=express.Router();
const menuItem=require('../models/menu');
const { findByIdAndUpdate } = require('../models/person');

router.post('/',async(req,res)=>{
    try{
      const data=req.body;
      const newMenuItem=new menuItem(data);
      const response=await newMenuItem.save();
      console.log("data saved");
      res.status(200).json(response);
  
    }catch(err){
      console.log(err);
      res.status(500).json({Error:"Internal Server Error"});
    }
});
  
router.get('/', async (req,res)=>{
    try{
      const data= await menuItem.find();
      console.log("data fetched");
      res.status(200).json(data);
    }catch(err){
      console.log(err);
      res.status(500).json({error:"Internal server error"});
    }
});

router.get('/:taste', async(req,res)=>{
    try{
        const tasteType=req.params.taste;
        if(tasteType == 'spicy' || tasteType == 'sour' || tasteType == 'sweet')
        {
            const data=await menuItem.find({taste:tasteType});
            console.log('data fetched');
            res.status(200).json(data);
        }
        else
        {
            res.status(404).json({ERROR:'taste does not exist'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }
});

router.put('/:id',async(req,res)=>{
  try{
    const menuId=req.params.id;
    const updatedData=req.body;
    const response=await menuItem.findByIdAndUpdate(menuId,updatedData,{
      new:true,
      runValidators:true
    });

    if(!response)
    {
      console.log("Data does not exist");
      res.status(404).json({Error:"menu item not found"});
    }

    console.log("Data Updated");
    res.status(200).json(response);
  }catch(err){
    console.log(err);
    res.status(500).json({Error:"Internal Server Error"})
  }
});

router.delete('/:id',async(req,res)=>{
  try{
    const menuId=req.params.id;
    const response=await menuItem.findByIdAndDelete(menuId);

    if(!response)
    {
      console.log("Data does not exist");
      res.status(404).json({Error:"menu item not found"});
    }

    console.log("Data Deleted");
    res.status(200).json({Message:"Menu item deleted Successfully"});

  }catch(err){
  console.log(err);
  res.status(500).json({Error:"Internal Server Error"})
  }
})

module.exports=router;