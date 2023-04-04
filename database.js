const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');


const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;


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

function addDownload(file) {
  fileCollection.insertOne(file);
}

function getLatestDownloads() {
  const query = {};
  const options = {
    sort: { date: -1 },
    limit: 10,
  };
  const cursor = fileCollection.find(query, options);
  return cursor.toArray()
      .then(downloads => {
        // Convert the date strings to Date objects and return the sorted downloads
        return downloads.map(download => {
          download.date = new Date(download.date);
          return download;
        }).sort((a, b) => a.date - b.date);
      });
}

module.exports = {
  getUser,
  getFile,
  getUserByToken,
  createUser,
  createFile,
  // addDownload,
  getLatestDownloads,
};
