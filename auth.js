const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const person=require('./models/person');

passport.use(new LocalStrategy(async (USERNAME,password,done)=>{
    try{
      //console.log('Received Credentials',USERNAME,password);

      const user=await person.findOne({username:USERNAME});
      if(!user){
        return done(null,false,{MESSAGE:"Incorrect Username"});
      }
  
      const isPasswordMatch=await user.comparePassword(password);
  
      if(isPasswordMatch){
        return done(null,user);
      }else{
        return done(null,false,{MESSAGE:"Incorrect Password"})
      }
    }catch(err){
      return done(err);
    }
  }));

  module.exports=passport;
  