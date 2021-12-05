const {verifytoken}=require("../helper/jwttoken");

class Auth {

    static AuthJWT(req,res,next){
        let token=req.headers.token;
        verifytoken(token,(err,payload)=>{
            if(err){
                throw new Error("Anda harus login terlebih dahulu");
            }else{
                req.decoded=payload;
                next();
            }
        });
    }

}

module.exports=Auth;