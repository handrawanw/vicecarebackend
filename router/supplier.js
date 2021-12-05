const express=require("express");
const Router=express.Router();

const {addSupplier,editSupplier,allSupplier,deleteSupplier}=require("../controller/supplier");

// Authentikasi JWT token
const {AuthJWT}=require("../middleware/auth");
// Authentikasi JWT token

Router.get("/",AuthJWT,allSupplier);

Router.post("/addSupplier",AuthJWT,addSupplier);

Router.patch("/editSupplier/:id_supplier",AuthJWT,editSupplier);

Router.delete("/remove/:id_supplier",AuthJWT,deleteSupplier);

module.exports=Router;
