var mongoose=require("mongoose");
//var dbURI="mongodb://localhost/mekanbul";
//var dbURI = 'mongodb+srv://test:test@cluster0.mwfrbfo.mongodb.net/mekanbul?appName=Cluster0';

require("dotenv").config();
var dbURI = process.env.MONGODB_URI;

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected",function(){
    console.log("Mongoose "+dbURI+" adresindeki veritabanına bağlandı.");
});
mongoose.connection.on("error",function(){
    console.log("Mongoose bağlantı hatası.");
});
mongoose.connection.on("disconnected",function(){
    console.log("Mongoose bağlantısı kesildi.");
});
process.on("SIGINT",function(){
    mongoose.connection.close();
    console.log("Mongoose uygulama sonlandırma nedeniyle bağlantıyı kapattı.");
    process.exit(0);
});
require("./venue");
require("./user");