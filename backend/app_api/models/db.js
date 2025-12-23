var mongoose=require("mongoose");
//var dbURI="mongodb://localhost/mekanbul";
//var dbURI = 'mongodb+srv://test:test@cluster0.mwfrbfo.mongodb.net/mekanbul?appName=Cluster0';

//require("dotenv").config();
var dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI);
/*mongoose.connection.on("connected",function(){
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
require("./user");*/
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

/**
 * Global cache (Vercel serverless için şart)
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connected");
  return cached.conn;
}

module.exports = connectDB;