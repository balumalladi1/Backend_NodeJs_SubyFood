const express = require('express')
const firmController=require("../controller/firmController");
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken');

router.post('/add-firm',verifyToken, firmController.addFirm)

router.post('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;
    res.header('Content-Type',image/jpeg);
    res.sendFile(path.join(__dirname,'..','uploads',imageName));
});

router.delete('/:firmId',firmController.deleteFirmById)

module.exports = router;