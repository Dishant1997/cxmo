const express = require('express');
const app = express();
const router = express.Router();
var path = require('path');
const maxSize = 11 * 1024 * 1024; // for 1MB 
// middleware for authentication
var VerifyToken = require('../middleware/VerifyToken');
//validation check
const {check, validationResult} = require('express-validator');
//file upload 
const Multer = require('multer');

app.use('/uploads',express.static(path.join(__dirname,'/uploads'))); 




//var upload = multer({ storage : storage}); 
//call controller



  const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 100 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    },
    fileFilter: (req, file, cb) => {
        console.log("fileFilter");
        if (file.mimetype == "video/mp4" || file.mimetype == "video/3gp"  ) {
        console.log("fileFilter if");
        cb(null, true);
      } else {
        console.log("fileFilter else");
        cb(null, false);
        
       return cb('Only mp4 & 3gp format allowed!Max file size is  20 MB');
      }
    }

    
  });

const {
    addVideo, 
    getVideo,
    addCategory,
    getCategory,
    deleteVideo,
    updateVideo,videoDetail
} = require('../controller/video.controller');  
//routes 
router.post('/add', multer.single('video_file_name'),VerifyToken,
                    [  
                        check('video_name').isLength({ min: 1 })
                        .withMessage('Video name  is required')
                    ],addVideo);    
router.post('/get', getVideo);      
//category route
router.post('/add-category', addCategory);        
router.get('/get-category', getCategory); 
router.delete('/delete/:id',VerifyToken,deleteVideo);  
router.post('/update/:video_id',VerifyToken,multer.single('video_file_name'),updateVideo) ;    
router.get('/:video_id',VerifyToken,videoDetail);


module.exports = router;     