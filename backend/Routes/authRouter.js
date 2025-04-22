const router=require('express').Router();
const {signupValidation,loginValidation}=require('../Middlewares/AuthValidation');
const { signup, login } = require('../Controllers/AuthController');

router.post('/login', loginValidation, login);

router.post('/signup',signupValidation,signup);
router.get('/',async(req,res)=>{
    res.send("This Auth is working!")
})

module.exports=router;