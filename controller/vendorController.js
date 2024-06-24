const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')
const dotEnv=require('dotenv');

dotEnv.config()

const secretKey = process.env.WhatIsYourName

const vendorRegister = async(req,res) =>{
    const {username,email,password}=req.body;
    try {
        const vendorEmail = await Vendor.findOne({email});
        if(vendorEmail) {
            console.log(vendorEmail)
            return res.status(200).json("Email already taken")
        }
        const hashedpassword = await bcrypt.hash(password,10) 

        const newVendor = new Vendor({
            username,
            email,
            password:hashedpassword
        })
        await newVendor.save();
        res.status(201).json({message:"Vendor registered succesfully"});
        console.log("vendor Register")
    } catch (error){
        console.error(error)
        res.status(500).json({error:"Error occured"})
    }
}

const vendorLogin = async (req,res)=>{
    const {email,password} = req.body
    try{
        const vendor = await Vendor.findOne({email})
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"Invalid username or password"})
        }

        const token = jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"})
       const vendorId=vendor._id
        res.status(200).json({success:"Login succesful",token,vendorId})
        console.log(email,"this is token",token);
        } catch (error){
            console.error(error)
            res.status(500).json({error:"Internal Server error"})
    }    
}

const getAllVendors = async(req,res) =>{
    try {
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal Server error"})   
    }
}

const getVendorById = async (req,res) => {
    const vendorId=req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate("firm");
       if(!vendor) {
        return res.status(404).json({error:"Vendor not Found"})
       }

       const vendorFirmId=vendor.firm[0]._id;
        res.status(200).json({vendorId,vendorFirmId,vendor})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal Server error"})
    }
}

module.exports =  {vendorRegister, vendorLogin,getAllVendors, getVendorById};