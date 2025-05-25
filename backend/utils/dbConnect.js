// const mongoose = require('mongoose');

// const MONGODB_URI = process.env.MONGO_URI;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGO_URI environment variable');
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     console.log('Using cached MongoDB connection');
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000, // Fail fast if server not found
//     };

//     console.log('Establishing new MongoDB connection');
//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log('Connected to MongoDB');
//       return mongoose;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// module.exports = dbConnect;
