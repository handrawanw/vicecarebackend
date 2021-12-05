const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const TxDetailSchema=new Schema({
    no_po:{
        type:String,
        required:["nomor tidak boleh kosong",true]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    jumlah:{
        type:Number,
        required:["jumlah order tidak boleh kosong",true]
    },
    id_product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    },
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const TxDetailModel=mongoose.model("tx_detail",TxDetailSchema);

module.exports=TxDetailModel;
