const passport = require('passport');
const CustomStrategy = require('passport-custom')
const {Account} = require('../model');
const {verifyCipher, createCipher} = require('./crypto');

const verifyAuth = passport.authenticate('AUTH', { failureMessage: true });

const authRequired = (req, res, next) => {
    if(req.app.locals.user && process.env.ENVIRON !== "PRODUCTION"){
        req.user = req.app.locals.user;
         return next()
    }
    
    if(req?.isAuthenticated()){
        return next()
    }
    
    res.status(401);
    return res.json({error:true, msg:'Not Authenticated'});
}

const logOut = (req, res, next)=>
    req.logout((err)=>{
          if (err) 
              return next(err);
          return next();
          });

const registerAuth = (passport)=>{
    passport.use('AUTH', new CustomStrategy(
        async (req, done)=>{
          let {_id, _hash, _txt} = req.body;
         // console.log(req.body);
          let user = await Account.findOne({userId:_id});
         // console.log(user)
         if(user){
            let verify = verifyCipher(_id, user.userKey, _hash, _txt);
            if(verify)
              return done(null, user);
         }
          let _errMsg = '';
          _errMsg = "Incorrect Account";
          console.log(_errMsg);
          return done(null, false);
        }
    ));
    
    passport.serializeUser(function(user, done) {
        done(null, user.userId);
     });

     passport.deserializeUser(async (userId, done)=>{
        let user = Account.findOne({userId}).then((user)=>{
                return done(null,user)
        }).catch(done);
     });
}


module.exports = {registerAuth, verifyAuth, logOut, authRequired}