const express = require('express'); 
const app = express();
const router = express.Router(); 
const { check, validationResult } = require('express-validator');
var VerifyToken = require('../middleware/VerifyToken');
var path = require('path');
const {
    userRegister,userLogin,userProfile,updateProfile,getSocialLogin
} = require('../controller/auth.controller');
//file upload 
const multer = require('multer');
app.use('/profile',express.static(path.join(__dirname,'/profile')));
var storage =   multer.diskStorage({ 
    destination: function (req, file, callback) {     
        callback(null, 'profile');   
    },
    filename: function (req, file, callback) { 
        //  callback(null, file.fieldname + '-' + Date.now());
        // callback(null,file.originalname + path.extname(file.originalname)); 
        callback(null,file.originalname)  
    }
}); 
var upload = multer({ storage : storage}); 
router.post('/register',[
                            check('first_name').isLength({ min: 1 })
                            .withMessage('First name is required'),
                            check('last_name').isLength({ min: 1 })
                            .withMessage('Last name is required'),
                            check('username').isLength({ min: 1 })
                            .withMessage('Username is required'),
                            check('email').isLength({ min: 1 })
                            .withMessage('Email is required'),
                            check('password').isLength({ min: 1 })
                            .withMessage('Password is required'),
                            check('device_token').isLength({ min: 1 })
                            .withMessage('Device token is required'),
                            check('device_name').isLength({ min: 1 })
                            .withMessage('Device name is required'),
                            check('device_type').isLength({ min: 1 })
                            .withMessage('Device type is required'), 
                        ],userRegister);   
router.post('/login',[
                        check('username').isLength({ min: 1 })
                        .withMessage('First name is required'),
                        check('password').isLength({ min: 1 })
                        .withMessage('Password is required'),
                        check('device_token').isLength({ min: 1 })
                        .withMessage('Device token is required'),
                        check('device_name').isLength({ min: 1 })
                        .withMessage('Device name is required')
                     ],userLogin);  
router.get('/get-profile',VerifyToken,userProfile);    
                    
router.post('/update-profile',upload.single('profile_pic'),VerifyToken,updateProfile);  
router.post('/social-login',[
    check('social_id').isLength({ min: 1 })
    .withMessage('Social id is required')
    
 ],getSocialLogin)                             
module.exports = router; 
