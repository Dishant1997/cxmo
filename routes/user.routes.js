const express = require('express');
const app = express();
const router = express.Router();
var path = require('path');
const statusConfig = require('../helpers/status');
// middleware for authentication
var VerifyToken = require('../middleware/VerifyToken');
//validation check
const {check, validationResult} = require('express-validator');


const Multer = require('multer');
app.use('/profile',express.static(path.join(__dirname,'/profile')));
 

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

const {
    getUsers,
    getCounts,
    changeUserStatus,
    updateUser,
    userDetail
} = require('../controller/user.controller');  
//var upload = multer({ storage : storage});


router.post('/', VerifyToken, getUsers); 
router.get('/counts',VerifyToken,getCounts);
router.put('/change/status/:id',VerifyToken,changeUserStatus)
router.post('/update/:userId',VerifyToken,multer.single('profile_pic'),updateUser); 
router.get('/detail/:userId',VerifyToken,userDetail)

//router.post('/update/:userId',VerifyToken,upload(req, res),updateUser); 


module.exports = router;  