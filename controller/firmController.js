const multer = require("multer");
const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor")
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
  
const addFirm = async (req,res) => {
    try{
        const {firmName,area,category,region,offer} = req.body;
        const image = req.file? req.file.filename:undefined;
        const vendor = await Vendor.findById(req.vendorId)

    if(!vendor){
        return res.status(404).json({message:"Vendor not available"});
    }
    if (vendor.firmlength>0){
        return res.status(400).json({message:"vendor can only have one firm"})
    }
    const firm = new Firm({
        firmName,area,category,region,offer,image,vendor:vendor._id
    })
    const firmId=await firm.save()
    const vendorFirmName=savedFirm.firmName;
    vendor.firm.push(savedFirm);
    await vendor.save()
    return res.status(200).json({message:"Firm added Succesfully",firmId,vendorFirmName})
    } catch (error) {
        console.log(error) 
        return res.status(500).json("Internal server is error")
    }  
}

const deleteFirmById = async(req,res)=>{
    try {
        const firmId=req.params.firmId;
        const deleteProduct=await Firm.findByIdAndDelete(firmId);

        if(!deleteProduct) {
            return res.status(404).json({error:"No Product Found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internl server error"})
    }
}


module.exports = {addFirm:[upload.single("image"), addFirm],deleteFirmById};