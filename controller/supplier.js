const SuppliersModel=require("../model/suppliers");

class Supplier {

    static allSupplier(req,res,next){
        const {skip,limit}=req.query;
        let Dates=new Date();
        Dates.setUTCHours(0,0,0,0e2);
        
        SuppliersModel.aggregate([
            {
                $facet:{
                    "tx_now":[
                        {
                            $group:{
                                _id:null,
                                total_supplier:{
                                    $sum:1
                                }
                            }
                        },{
                            $project:{
                                _id:0,
                                total_supplier:1
                            }
                        }
                    ],
                    "supplier_new":[
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
                                total_supplier_new:{
                                    $sum:1
                                }
                            }
                        },{
                            $project:{
                                _id:0,
                                total_supplier_new:1
                            }
                        }
                    ],
                    "ViewData":[
                        {
                            $skip: skip ? Number(skip) : 0
                        }, {
                            $limit: limit ? Number(limit)>100?100:Number(limit) : 25
                        },
                    ]
                }
            }
        ]).then((data)=>{
            res.status(200).json({
                message:`Supplier berhasil ditampilkan`,
                payload:data.length>0?data[0]:null
            });
        }).catch(next);
    }

    static addSupplier(req,res,next){
        const {id}=req.decoded;
        const {nama_supplier,email,alamat,no_hp}=req.body;
        SuppliersModel.create({nama_supplier,email,alamat,no_hp}).then((data)=>{
            res.status(200).json({
                message:"Supplier baru berhasil ditambahkan",
                payload:data
            });
        }).catch(next);
    }

    static editSupplier(req,res,next){
        const {id_supplier}=req.params;
        const {nama,email,alamat,no_hp}=req.body;
        SuppliersModel.findOneAndUpdate({_id:id_supplier},{nama,email,alamat,no_hp}).then((data)=>{
            res.status(200).json({
                message:"Supplier berhasil diperbarui",
                payload:data
            });
        }).catch(next);
    }

    static deleteSupplier(req,res,next){
        const {role}=req.decoded;
        const {id_supplier}=req.params;
        if(role&&role===20){
            /*
                User yang di izinkan untuk menghapus data Supplier role 20
            */
            SuppliersModel.findOneAndDelete({_id:id_supplier}).then((data)=>{
                res.status(200).json({
                    message:"Supplier berhasil dihapus",
                    payload:data
                });
            }).catch(next);
        }else{
            res.status(403).json({
                message:"Anda tidak di izinkan untuk menghapus supplier",
                payload:null
            });
        }
    }

}

module.exports=Supplier;
