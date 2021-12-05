const express=require("express");
const Router=express.Router();

const {Login,Daftar,DeleteUser,UpdateUser,UserAll}=require("../controller/user");

// Authentikasi JWT token
const {AuthJWT}=require("../middleware/auth");
// Authentikasi JWT token

Router.get("/",AuthJWT,UserAll);

Router.post("/login",Login);
Router.post("/register",Daftar);

Router.patch("/edit/:id_user",AuthJWT,UpdateUser);

Router.delete("/remove/:id_user",AuthJWT,DeleteUser);

module.exports=Router;
