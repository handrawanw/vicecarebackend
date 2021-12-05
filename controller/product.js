const ProductModel=require("../model/products");

class Product {

    static addProduct(req,res,next){
        const {id}=req.decoded;
        const {id_supplier}=req.params;
        const {nama_product,satuan,harga,suplai_product}=req.body;
        /*
            Didalam produk saya, saya sertakan id_supplier nya dari table supplier
            untuk menerangkan di product ini ada suppliernya,
            dan id_supplier ini relasi ke table supplier
        */
        ProductModel.create({nama_product,satuan,harga,suplai_product,id_supplier}).then((data)=>{
            res.status(200).json({
                message:"Produk berhasil ditambahkan",
                payload:data
            });
        }).catch(next);
    }

    static editProduct(req,res,next){
        const {id_product}=req.params;
        const {nama_product,satuan,harga,suplai_product}=req.body;
        ProductModel.findOneAndUpdate({_id:id_product},{nama_product,satuan,harga,suplai_product},{new:true}).then((data)=>{
            res.status(200).json({
                message:"Produk berhasil di perbarui",
                payload:data
            });
        }).catch(next);
    }

    static viewProduct(req,res,next){
        const {skip,limit}=req.query;
        let Dates=new Date();
        Dates.setUTCHours(0,0,0,0e2);

        ProductModel.aggregate([
            {
                $facet:{
                    "tx_now":[
                        {
                            $group:{
                                _id:null,
                                total_transaction:{
                                    $sum:1
                                }
                            }
                        },{
                            $project:{
                                _id:0,
                                total_transaction:1
                            }
                        }
                    ],
                    "newProduk":[
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
                                total_product:{
                                    $sum:1
                                }
                            }
                        },{
                            $project:{
                                _id:0,
                                total_product:1
                            }
                        }
                    ],
                    "ViewData":[
                        {
                            $skip: skip ? Number(skip) : 0
                        }, {
                            $limit: limit ? Number(limit)>100?100:Number(limit) : 25
                        },{
                            $lookup: {
                                from: 'suppliers',// dari table tx_details
                                localField: 'id_supplier',// field primary key idnya
                                foreignField: '_id',// primary field
                                as: 'id_supplier'// variabel nama baru atau nama lama
                            }
                        },{
                            $unwind:"$id_supplier"
                        },{
                            $project:{
                                "nama_product":1,
                                "satuan":1,
                                "harga":1,
                                "suplai_product":1,
                                "id_supplier._id":1,
                                "id_supplier.email":1,
                                "id_supplier.alamat":1,
                                "id_supplier.no_hp":1,
                                "createdAt":1,
                                "updatedAt":1
                            }
                        }
                    ]
                }
            }
        ]).then((data)=>{
            res.status(200).json({
                message:"Produk berhasil ditampilkan",
                payload:data.length>0?data[0]:null
            });
        }).catch(next);
    }

    static deleteProduct(req,res,next){
        const {role}=req.decoded;
        const {id_product}=req.params;
        if(role&&role===20){
            /*
                User yang di izinkan untuk menghapus data User role 20
            */
            ProductModel.findOneAndDelete({_id:id_product}).then((data)=>{
                if(data){
                    res.status(200).json({
                        message:"Produk berhasil dihapus",
                        payload:data
                    });
                }else{
                    res.status(404).json({
                        message:"Produk tidak ditemukan",
                        payload:null
                    });
                }
            }).catch(next);     
        }else{
            res.status(403).json({
                message:"Anda tidak di izinkan untuk menghapus product",
                payload:null
            });
        }
    }

}

module.exports=Product;
