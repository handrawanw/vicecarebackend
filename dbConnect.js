var mongoose = require('mongoose');

const dbConnect = () => {
    // const mongoURI = process.env.MONGO_URL;
    const mongoURI = 'mongodb+srv://handrawan:1FtwSnIrkcSQBwXq@cluster0.kaius.mongodb.net/purchasing_order?authSource=admin&replicaSet=atlas-da52ap-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
    // const mongoURI = 'mongodb://localhost:27017/purchasing_order';
    mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false,useCreateIndex:true, connectTimeoutMS: 15000 });
    let db = mongoose.connection;
    db.on('error', console.log.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('Welcome to MongoDb')
    });
    
};

module.exports = dbConnect;