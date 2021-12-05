const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const TxPengirimanSchema=new Schema({
    nama_pengirim:{
        type:String,
        required:["nama pengirim tidak boleh kosong",true]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    tanggal_po:{
        type:Date,
        required:["tanggal purchasing order tidak boleh kosong",true]
    },
    tanggal_kirim:{
        type:Date,
        required:["tanggal kirim tidak boleh kosong",true]
    },
    status_kiriman:{
        type:String,
        default:"Pending"
    },
    media_pengirim:{
        type:String,
        required:["nama media pengirim tidak boleh kosong",true]
    },
    detail_tx:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tx_detail'
    }
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const TxPengirimanModel=mongoose.model("tx_pengiriman",TxPengirimanSchema);

module.exports=TxPengirimanModel;