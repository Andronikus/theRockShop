const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(process.env.MONGO_URI, {
  useUnifiedTopology: true,
});

let _db;

const mongoConnect = () => {
  return client
    .connect()
    .then((client) => {
      _db = client.db();
      console.log("get a client and a pool of connections");
    })
    .catch((err) => {
      throw err;
    });
};

const getDB = () => {
  if (!_db) {
    throw new Error("No connections available");
  }
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
