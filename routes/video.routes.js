const express = require('express');
const app = express();
const router = express.Router();
var path = require('path');
// middleware for authentication
var VerifyToken = require('../middleware/VerifyToken');
//validation check
const {check, validationResult} = require('express-validator');
//file upload 
const multer = require('multer');
app.use('/uploads',express.static(path.join(__dirname,'/uploads'))); 
var storage =   multer.diskStorage({ 
    destination: function (req, file, callback) {    
        callback(null, 'uploads');   
    },
    filename: function (req, file, callback) { 
        //  callback(null, file.fieldname + '-' + Date.now());
        callback(null,file.originalname);  
    }
}); 
var upload = multer({ storage : storage}); 
//call controller
const {
    addVideo, 
    getVideo,
    addCategory,
    getCategory
} = require('../controller/video.controller');  
//routes 
router.post('/add', upload.single('video_file_name'),VerifyToken,
                    [  
                        check('video_name').isLength({ min: 1 })
                        .withMessage('Video name  is required')
                    ],addVideo);    
router.post('/get', getVideo);      
//category route
router.post('/add-category', addCategory);        
router.get('/get-category', getCategory);        


module.exports = router;     