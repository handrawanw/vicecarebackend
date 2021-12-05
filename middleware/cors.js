const whitelist = [
    "http://localhost:3000",
    "http://localhost:3001",
    undefined// buat postman atau insomnia rest api
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Sorry your access is not allowed (CORS)'));
      }
    },
    optionsSuccessStatus: 200,
  }
  
  module.exports=corsOptions;
  