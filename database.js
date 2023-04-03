const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');


// const userName = process.env.MONGOUSER;
// const password = process.env.MONGOPASSWORD;
// const hostname = process.env.MONGOHOSTNAME;
const userName = "anonymous4586";
const password = "dRLR30RqtbLVXxqFs";
const hostname = "cluster4586.ihxvlbq.mongodb.net";

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('fileshare').collection('user');
const fileCollection = client.db('fileshare').collection('filedata');

function getFile(file)
{
  return fileCollection.findOne({file:file});
}

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

async function createFile(email,dateAndTime,fileName,downloadTimes,textinput) {

  const file = {
    username: email,
    date: dateAndTime,
    name: fileName,
    count: downloadTimes,
    text: textinput
  };
  await fileCollection.insertOne(file);

  return file;
}

function addScore(score) {
  scoreCollection.insertOne(score);
}

function getHighScores() {
  const query = {};
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
  getUser,
  getFile,
  getUserByToken,
  createUser,
  createFile,
  addScore,
  getHighScores,
};
