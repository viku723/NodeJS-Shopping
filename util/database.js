const mongoClient = require('mongodb').MongoClient;
let _db;

const mangoConnect = () => {
   return mongoClient
    .connect('mongodb+srv://viku723:ic6dGGTrqUE84pc@cluster0-aqsrv.mongodb.net/test?retryWrites=true&w=majority')
    .then((client) => {
        _db = client.db();
        return client;
    })
}
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No DB connection found!';
}

exports.mangoConnect = mangoConnect;
exports.getDb = getDb;