const multer = require("multer");
const Product = require("../models/Product")
const Firm = require('../models/Firm')
const path = require('path')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
});

const upload = multer({storage:storage})
  
const addProduct = async (req,res) => {
    try{
        const {productName,price,category,bestSeller,description} = req.body;
        const image = req.file? req.file.filename:undefined;
        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId)

    if(!firm){
        return res.status(404).json({message:"Firm not available"});
    }
    const product = new Product({
        productName,price,category,bestSeller,description,image,firm:firm._id
    })
    const savedProduct=await product.save();
    firm.product.push(savedProduct);
    await firm.save()
    return res.status(200).json({savedProduct})
    } catch (error) {
        console.error(error) 
        res.status(500).json({error:"Internal server error"})
    }  
}

const getProductByFirm = async (req,res) => {
    const firmId=req.params.firmId;
    try {
        const firm = await Firm.findById(firmId);
       if(!firm) {
        return res.status(404).json({error:"Firm not Found"})
       }

       const restaurantName=firm.firmName;
       const products = await Product.find({firm:firmId})
        res.status(200).json({restaurantName,products})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal Server error"})
    }
}
const deleteProductById = async (req,res) => {
    const productId=req.params.productId;
    try {
        const deleteProduct = await Product.findByIdAndDelete(productId);
       if(!deleteProduct) {
        return res.status(404).json({error:"No Product Found"})
       }
        res.status(200).json({message:"Product deleted Succesfully"})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal Server error"})
    }
}


module.exports = {addProduct:[upload.single("image"),addProduct],getProductByFirm,deleteProductById};