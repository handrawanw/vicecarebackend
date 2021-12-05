const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const SupplierSchema=new Schema({
    nama_supplier:{
        type:String,
        required:["nama supplier tidak boleh kosong",true]
    },
    email:{
        type:String,
        required:["email tidak boleh kosong",true]
    },
    alamat:{
        type:String,
        required:["password tidak boleh kosong",true]
    },
    no_hp:{
        type:String,
        required:["no hp tidak boleh kosong",true]
    },
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const SupplierModel=mongoose.model("supplier",SupplierSchema);

module.exports=SupplierModel;