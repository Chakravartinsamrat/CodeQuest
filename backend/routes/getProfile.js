const express=require('express')
const { requiresAuth } = require('express-openid-connect')
const router=express.Router()

const User = require('../models/User')




router.get('/',requiresAuth(), async(req,res)=>{
    // const appUser=req.oidc.user.email;
    const appUser='john@example.com'
    const appUserData=await User.findOne({email:appUser})
    res.json(appUserData)
})

module.exports=router;