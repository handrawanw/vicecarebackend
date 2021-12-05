const mongoose = require("mongoose");
const TXPengirimanModel = require("../model/tx_pengirimans");
const TXDetail = require("../model/tx_details");
const ProductModel = require("../model/products");
const OrderIDUniq = require("order-id")("key");

class Tx_Pengiriman {

    static async createTransaksi(req,res,next){
        const {id}=req.decoded;
        const { id_product } = req.params;
        const { jumlah } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let CheckProduct = await ProductModel.findById(id_product);
            if (!CheckProduct) {
                /*
                !CheckProduct ini menjelaskan bahwa kalau tipe datanya null atau undefined
                maka error dibawah ini muncul dan transaksi dibatalkan dengan abortTransaction()
                */
                throw new Error("Produk tidak tersedia atau tidak ditemukan");
            }
            let DataTXDetail = await TXDetail.create([{
                no_po: OrderIDUniq.generate(),
                jumlah, id_product,
                user:id,
            }], { session });
            if (session.inTransaction()) {
                await session.commitTransaction();
            }
            res.status(200).json({
                message: "Transaksi berhasil dibuat",
                payload: DataTXDetail.length>0?DataTXDetail[0]:null
            });
        } catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            next(error);
        }
    }

    static async createTransaksiReportPO(req,res,next){
        const {id}=req.decoded;
        const { id_transaksi } = req.params;
        const { nama_pengirim, tanggal_po, tanggal_kirim, status_kiriman, media_pengirim } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let CheckTransaksi = await TXDetail.findById(id_transaksi);
            if (!CheckTransaksi) {
                /*
                !CheckTransaksi ini menjelaskan bahwa kalau tipe datanya null atau undefined
                maka error dibawah ini muncul dan transaksi dibatalkan dengan abortTransaction()
                */
                throw new Error("ID Transaksi tidak tersedia atau tidak ditemukan");
            }
            let DataTXPengiriman = await TXPengirimanModel.create([{
                user:id,
                nama_pengirim, tanggal_po:new Date(), tanggal_kirim, status_kiriman, media_pengirim, detail_tx: CheckTransaksi._id
            }], { session });
            if (session.inTransaction()) {
                await session.commitTransaction();
            }
            res.status(200).json({
                message: "Data pengiriman berhasil dibuat dan sedang dalam proses supplier",
                payload: DataTXPengiriman
            });
        } catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            next(error);
        }
    }

    static updateDetailTx(req,res,next){
        const { id_table } = req.params;
        const { jumlah } = req.body;
        TXDetail.findOneAndUpdate({_id:id_table},{jumlah}).then((data)=>{
            res.status(200).json({
                message: "Data transaksi berhasil diperbarui",
                payload: data
            });
        }).catch(next);
    }

    static updateTXPengirimanModel(req,res,next){
        const { id_table } = req.params;
        const { nama_pengirim, tanggal_po, tanggal_kirim, status_kiriman, media_pengirim } = req.body;
        TXPengirimanModel.findOneAndUpdate({_id:id_table},{ nama_pengirim, tanggal_po, tanggal_kirim, status_kiriman, media_pengirim }).then((data)=>{
            res.status(200).json({
                message: "Data pengiriman berhasil diperbarui",
                payload: data
            });
        }).catch(next);
    }

    static deleteTXPengirimanModel(req,res,next){
        const {role}=req.decoded;
        const {id_table}=req.params;
        if(role&&role===20){
            /*
                User yang di izinkan untuk menghapus data
            */
            TXPengirimanModel.findOneAndDelete({_id:id_table,status_kiriman:"Pending"}).then((data)=>{
                if(data){
                    res.status(200).json({
                        message:"Pengiriman berhasil dicancel",
                        payload:data
                    });
                }else{
                    res.status(404).json({
                        message:"Pengiriman tidak ditemukan",
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


    static deleteTXDetail(req,res,next){
        const {role}=req.decoded;
        const {id_table}=req.params;
        if(role&&role===20){
            /*
                User yang di izinkan untuk menghapus data
            */
                TXDetail.findOneAndDelete({_id:id_table}).then((data)=>{
                if(data){
                    res.status(200).json({
                        message:"Order berhasil dicancel",
                        payload:data
                    });
                }else{
                    res.status(404).json({
                        message:"Order tidak ditemukan",
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

    static viewReportPO(req, res, next) {
        const {id} = req.decoded;
        const { skip, limit } = req.query;
        TXPengirimanModel.aggregate([
            {
                $facet: {
                    "TxStatus": [
                        {
                            $match:{
                                user:mongoose.Types.ObjectId(id)
                            }
                        },
                        {
                            $group: {
                                _id: "$status_kiriman",
                                result: {
                                    $sum: 1
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                status_kiriman: "$_id",
                                count: "$result"
                            }
                        }
                    ],
                    "TotalData":[
                        {
                            $match:{
                                user:mongoose.Types.ObjectId(id)
                            }
                        },
                        {
                            $group:{ 
                                _id:null,
                                total_data: {
                                    $sum: 1
                                },
                            }
                        },
                        {
                            $project: {
                                _id:0,
                                count: "$total_data"
                            }
                        },
                    ],
                    "ViewData": [
                        {
                            $match:{
                                user:mongoose.Types.ObjectId(id)
                            }
                        },
                        {
                            $skip: skip ? Number(skip) : 0
                        }, {
                            $limit: limit ? Number(limit) : 25
                        }, {
                            $lookup: {
                                from: 'tx_details',// dari table tx_details
                                localField: 'detail_tx',// field primary key idnya
                                foreignField: '_id',// primary field
                                as: 'detail_tx'// variabel nama baru atau nama lama
                            }
                        },
                        {
                            $unwind: '$detail_tx'// unwind untuk pecah data array[{}] jadi object {}
                        },
                        {
                            $lookup: {
                                from: 'products',// dari table product
                                localField: 'detail_tx.id_product',// field primary key idnya
                                foreignField: '_id',// primary field
                                as: 'detail_tx.id_product'// variabel nama baru atau nama lama
                            }
                        },
                        {
                            $unwind: '$detail_tx.id_product'// unwind untuk pecah data array[{}] jadi object {}
                        },
                        {
                            $lookup: {
                                from: 'suppliers',// dari table suppliers
                                localField: 'detail_tx.id_product.id_supplier',// field primary key idnya
                                foreignField: '_id',// primary field
                                as: 'detail_tx.id_product.id_supplier'// variabel nama baru atau nama lama
                            }
                        },
                        {
                            $unwind: '$detail_tx.id_product.id_supplier'// unwind untuk pecah data array[{}] jadi object {}
                        },
                        {
                            $project: {// select field yang dibutuhkan 1 tampil 0 tidak tampil
                                "_id":1,
                                "total_data":1,
                                "status_kiriman": 1,
                                "nama_pengirim": 1,
                                "tanggal_po": 1,
                                "tanggal_kirim": 1,
                                "media_pengirim": 1,
                                "detail_tx._id":1,
                                "detail_tx.jumlah": 1,
                                "detail_tx.no_po": 1,
                                "detail_tx.id_product.harga": 1,
                                "detail_tx.id_product.satuan": 1,
                                "detail_tx.id_product.id_supplier": 1,
                                "createdAt": 1,
                                "updatedAt": 1,
                            }
                        }
                    ]
                }
            }
        ]).then((data) => {
            res.status(200).json({
                message: `Report PO berhasil ditampilkan`,
                payload: data.length > 0 ? data[0] : null
            });
        }).catch(next);
    }

    static viewTransaksiPO(req,res,next){
        const {id}=req.decoded;
        const { skip, limit } = req.query;
        TXDetail.aggregate([{
            $facet:{
                "tx_now":[
                    {
                        $match:{
                            user:mongoose.Types.ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',// dari table suppliers
                            localField: 'id_product',// field primary key idnya
                            foreignField: '_id',// primary field
                            as: 'id_product'// variabel nama baru atau nama lama
                        }
                    },{
                        $unwind:"$id_product"
                    },
                    {
                        $group:{
                            _id:null,
                            total_transaction:{
                                $sum:1
                            },
                            volume_transaction:{
                                $sum:{
                                    $multiply:["$jumlah","$id_product.harga"]
                                }
                            }
                        }
                    },{
                        $project:{
                            _id:0,
                            total_transaction:1,
                            volume_transaction:1,
                        }
                    }
                ],
                "ViewData":[
                    {
                        $match:{
                            user:mongoose.Types.ObjectId(id)
                        }
                    },
                    {
                        $skip: skip ? Number(skip) : 0
                    }, {
                        $limit: limit ? Number(limit)>100?100:Number(limit) : 25
                    },{
                        $lookup: {
                            from: 'products',// dari table suppliers
                            localField: 'id_product',// field primary key idnya
                            foreignField: '_id',// primary field
                            as: 'id_product'// variabel nama baru atau nama lama
                        }
                    },{
                        $unwind:"$id_product"
                    },{
                        $lookup: {
                            from: 'suppliers',// dari table suppliers
                            localField: 'id_product.id_supplier',// field primary key idnya
                            foreignField: '_id',// primary field
                            as: 'id_product.id_supplier'// variabel nama baru atau nama lama
                        }
                    },{
                        $unwind:"$id_product.id_supplier"
                    },{
                        $project:{
                            "_id":1,
                            "no_po":1,
                            "jumlah":1,
                            "id_product._id":1,
                            "id_product.nama_product":1,
                            "id_product.satuan":1,
                            "id_product.harga":1,
                            "id_product.suplai_product":1,
                            "id_product.id_supplier._id":1,
                            "id_product.id_supplier.nama_supplier":1,
                            "id_product.id_supplier.email":1,
                            "id_product.id_supplier.alamat":1,
                            "id_product.id_supplier.no_hp":1,
                            "createdAt":1,
                            "updatedAt":1
                        }
                    }
                ]
            }
        }]).then((data)=>{
            res.status(200).json({
                message: `Transaksi PO berhasil ditampilkan`,
                payload: data.length > 0 ? data[0] : null
            });
        }).catch(next);
    }


}


module.exports = Tx_Pengiriman;