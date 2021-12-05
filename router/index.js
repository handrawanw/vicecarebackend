const express=require("express");
const Router=express.Router();

// Router file
const UsersRouter=require("./user");
const SupplierRouter=require("./supplier");
const ProductRouter=require("./product");
const TransaksiPO=require("./tx_transaksi");
// Router file

// Register Router
Router.use("/user",UsersRouter);
Router.use("/supplier",SupplierRouter);
Router.use("/product",ProductRouter);
Router.use("/transaksi",TransaksiPO);
// Register Router

module.exports=Router;
