const express=require("express");
const Router=express.Router();

const {viewTransaksiPO, viewReportPO, updateDetailTx, updateTXPengirimanModel ,deleteTXDetail,deleteTXPengirimanModel, createTransaksi, createTransaksiReportPO}=require("../controller/tx_transaksi");

// Authentikasi JWT token
const {AuthJWT}=require("../middleware/auth");
// Authentikasi JWT token

Router.get("/view",AuthJWT,viewReportPO);
Router.get("/viewTransaksi",AuthJWT,viewTransaksiPO);

Router.post("/transaksiPO/:id_product",AuthJWT,createTransaksi);
Router.post("/reportPO/:id_transaksi",AuthJWT,createTransaksiReportPO);

Router.patch("/updateDetailTx/:id_table",AuthJWT,updateDetailTx);
Router.patch("/updatePengiriman/:id_table",AuthJWT,updateTXPengirimanModel);

Router.delete("/deleteDetailTx/:id_table",AuthJWT,deleteTXDetail);
Router.delete("/deleteTXPengirimanModel/:id_table",AuthJWT,deleteTXPengirimanModel);


module.exports=Router;
