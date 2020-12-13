const express = require('express'); 
const app = express();
const router = express.Router(); 
const { check, validationResult } = require('express-validator');
var VerifyToken = require('../middleware/VerifyToken');
var path = require('path');
const {
    userRegister,userLogin,userProfile,updateProfile,getSocialLogin,changePassword
} = require('../controller/auth.controller');
//file upload 
//const multer = require('multer');
const Multer = require('multer');

app.use('/profile',express.static(path.join(__dirname,'/profile')));
/*var storage =   multer.diskStorage({ 
    destination: function (req, file, callback) {     
        callback(null, 'profile');   
    },
    filename: function (req, file, callback) { 
        //  callback(null, file.fieldname + '-' + Date.now());
        // callback(null,file.originalname + path.extname(file.originalname)); 
        callback(null,file.originalname)  
    }
}); */


const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 20 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    },
    fileFilter: (req, file, cb) => {
        console.log("fileFilter");
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        console.log("fileFilter if");
        cb(null, true);
      } else {
        console.log("fileFilter else");
        cb(null, false);
        
        //return cb.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:'Only .png, .jpg and .jpeg format allowed!'});
        //return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, errors: 'Only .png, .jpg and .jpeg format allowed!' });
       //return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
       return cb('Only .png, .jpg and .jpeg format allowed!');
      }
    }

    
  });


//var upload = multer({ storage : storage}); 
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
                    
//router.post('/update-profile',upload.single('profile_pic'),VerifyToken,updateProfile);  
router.post('/update-profile',multer.single('profile_pic'),VerifyToken,updateProfile);  
router.post('/social-login',[
    check('social_id').isLength({ min: 1 })
    .withMessage('Social id is required')
    
 ],getSocialLogin) ;  
 
 router.post('/changePassword',VerifyToken,[
    check('password').isLength({ min: 6 })
    .withMessage('Pasword is required')
    
 ],changePassword);
module.exports = router; 
