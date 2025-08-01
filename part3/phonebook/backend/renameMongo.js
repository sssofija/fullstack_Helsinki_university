require('dotenv').config();

const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const dbName = "noteApp";
const clusterName = "Cluster0";

const url = `mongodb+srv://sofiiapiepponen:${password}@cluster0.qy68xqk.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=${clusterName}`;

console.log("MongoDB:");
console.log(url);

module.exports = url;
