const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username:{
        type:String,
        required:["Username tidak boleh kosong",true]
    },
    password:{
        type:String,
        required:["password tidak boleh kosong",true]
    },
    fullname:{
        type:String,
        required:["Nama lengkap tidak boleh kosong",true]
    },
    verifikasi:{
        type:Boolean,
        default:true
    },
    role:{
        type:Number,
        default:0
    },
    avatar:{
        type:String,
        required:["avatar tidak boleh kosong",true]
    }
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const UserModel=mongoose.model("user",UserSchema);

module.exports=UserModel;