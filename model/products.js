const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const ProductSchema=new Schema({
    nama_product:{
        type:String,
        required:["nama product tidak boleh kosong",true]
    },
    satuan:{
        type:String,
        required:["satuan tidak boleh kosong",true]
    },
    harga:{
        type:Number,
        required:["harga tidak boleh kosong",true]
    },
    suplai_product:{
        type:String,
        required:["suplai_product tidak boleh kosong",true]
    },
    id_supplier:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'supplier',
        required:["id_supplier tidak boleh kosong",true]
    },
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const ProductModel=mongoose.model("product",ProductSchema);

module.exports=ProductModel;