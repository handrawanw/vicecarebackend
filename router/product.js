const express=require("express");
const Router=express.Router();

const {addProduct,viewProduct,editProduct,deleteProduct}=require("../controller/product");

// Authentikasi JWT token
const {AuthJWT}=require("../middleware/auth");
// Authentikasi JWT token


Router.get("/",AuthJWT,viewProduct);

Router.post("/addProduct/:id_supplier",AuthJWT,addProduct);

Router.patch("/edit/:id_product",AuthJWT,editProduct);

Router.delete("/remove/:id_product",AuthJWT,deleteProduct);

module.exports=Router;
