const express = require('express');
const router = express.Router();
var path = require('path');
var multer = require('multer');
const app = express();
var VerifyToken = require('../middleware/VerifyToken');
var VerifyAdminToken = require('../middleware/verifyIsAdmin');
const { check, validationResult } = require('express-validator');
const {
    getTourCategories,
    addTourCategories,
    updateTourCategories,
    addTour,
    updateTour,
    getTour,
    getTourDetail,
    getTourTags,
    getCategorizedTour
    
} = require('../controller/tour_pacakage.controller');

//file upload 

app.use('/tours',express.static(path.join(__dirname,'/tours')));
var storage =   multer.diskStorage({ 
    destination: function (req, file, callback) {     
        callback(null, 'tours');   
    },
    filename: function (req, file, callback) { 
        //  callback(null, file.fieldname + '-' + Date.now());
        // callback(null,file.originalname + path.extname(file.originalname)); 
      //  console.log("function "+file.originalname);
        callback(null,file.originalname)  
    }
}); 
var upload = multer({ storage : storage});

router.get('/categories', VerifyToken, getTourCategories); 
router.post('/categories/add',VerifyToken,[
    check('tour_category_name').isLength({ min: 1 })],     addTourCategories
);
router.post('/categories/update',VerifyToken,[
    check('tour_category_name').isLength({ min: 1 }).withMessage('Tour Category name is required'),check('tour_categories_id').isLength({ min: 1 })
    .withMessage('Category id required')],     updateTourCategories
);

/*router.post('/add',upload.single('tour_thumb[]'),VerifyToken,    addTour
);*/
var cpUpload = upload.fields([{ name: 'tour_thumb', maxCount: 1 }, { name: 'tour_gallery', maxCount: 8 }])

router.post('/add',cpUpload,VerifyToken,    addTour
);


router.post('/update',cpUpload,VerifyToken,    updateTour
);

router.get('/tags',cpUpload,VerifyToken,    getTourTags
);

router.post('/get',VerifyToken, getTour); 
router.get('/detail/:id',VerifyToken, getTourDetail);  
router.post('/getCategorizedTour',VerifyToken, getCategorizedTour); 
module.exports = router;  