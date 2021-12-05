const UsersModel=require("../model/users");
const SupplierModel=require("../model/suppliers");

// helpers
const {checkPass,hashPass}=require("../helper/compareHash");
const {generateToken}=require("../helper/jwttoken");
// helpers

class User {

    static Login(req,res,next){
        let {username,password}=req.body;
        UsersModel.findOne({
            username
        }).then((data)=>{
            if(data){
                let ValidPassword = checkPass(password, data.password);
                /*
                        checkPass fungsi untuk membandingkan password dalam bentuk hash
                        fungsinya ada di helper compareHash.js
                    */
                if (ValidPassword) {
                    let Payload = generateToken({
                        id: data._id,
                        username: data.username,
                        fullname: data.fullname,
                        role: data.role,
                        id_supplier: data.id_supplier
                    });
                    /*
                        generateToken fungsi sign jwt token untuk generate token dalam bentuk hash dari jwt
                        fungsinya ada di helper jwttoken.js
                    */
                    res.status(200).json({
                        message: "Login berhasil",
                        token:Payload
                    });
                } else {
                    throw new Error("Username atau Password salah");
                }
            }else{
                throw new Error(`Username atau Password salah`);
            }
        }).catch(next);
    }

    static Daftar(req,res,next){
        const { username, password, fullname,role, avatar } = req.body;
        UsersModel.findOne({username}).then(async (Users) => {
            if(Users){
                throw new Error("Username telah terdaftar");
            }else{
                let Account = await UsersModel.create({ username, password, fullname, role, avatar });
                if (Account) {
                    Account.password = hashPass(Account.password);
                    let StatusSave = await Account.save();
                    /*
                        hashPass untuk encrypt password ke hash
                        fungsinya ada di helper pakai bcrypt.js
                    */
                    res.status(200).json({
                        message: "Successfull Register",
                        User: StatusSave
                    });
                } else {
                    throw new Error("Username gagal terdaftar");
                }
            }
        }).catch(next);
    }

    static UserAll(req,res,next){
       const {skip,limit}=req.query;
       let Dates=new Date();
       Dates.setUTCHours(0,0,0,0e2);
       
       UsersModel.aggregate([
           {
                $facet:{
                    "tx_now":[
                        {
                            $group:{
                                _id:null,
                                total_user:{
                                    $sum:1
                                }
                            }
                        },{
                            $project:{
                                _id:0,
                                total_user:1
                            }
                        }
                    ],
                    "user_new":[
                        {
                            $match:{
                                createdAt:{
                                    $gte:Dates,
                                    $lte:new Date()
                                }
                            }
                        },
                        {
                            $group:{
                                _id:null,
                                total_user_new:{
                                    $sum:1
                                }
                            }
                        },{
                            $project:{
                                _id:0,
                                total_user_new:1
                            }
                        }
                    ],
                    "ViewData":[
                        {
                            $skip: skip ? Number(skip) : 0
                        }, {
                            $limit: limit ? Number(limit)>100?100:Number(limit) : 25
                        },{
                            $project:{
                                username:1,
                                role:1,
                                fullname:1,
                                avatar:1,
                                createdAt:1,
                                updatedAt:1
                            }
                        }
                    ]
                }
           }
       ]).then((data)=>{
            res.status(200).json({
                message:`Successfull`,
                payload:data.length>0?data[0]:null
            });
       }).catch(next);
    }

    static UpdateUser(req,res,next){
        const {id_user}=req.params;
        const { username, password, fullname,role, avatar } = req.body;
        UsersModel.findOneAndUpdate({_id:id_user},{ username, password, fullname, role, avatar },{new:true,strict:true}).then((data)=>{
            res.status(200).json({
                message:"Data user berhasil diperbarui",
                payload:data
            });
        }).catch(next);
    }

    static DeleteUser(req,res,next){
        const {role}=req.decoded;
        const {id_user}=req.params;
        if(role&&role===20){
            /*
                User yang di izinkan untuk menghapus data User role 20
            */
            UsersModel.findOneAndDelete({_id:id_user}).then((data)=>{
                if(data){
                    res.status(200).json({
                        message:"Username berhasil dihapus",
                        payload:data
                    });
                }else{
                    res.status(404).json({
                        message:"Username tidak ditemukan",
                        payload:null
                    });
                }
            }).catch(next);

        }else{
            res.status(403).json({
                message:"Anda tidak di izinkan untuk menghapus user",
                payload:null
            });
        }
    }

}

module.exports=User;
