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
  return fileCollection.findOne({downloadLink:file});
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

//create a delete file endpoint
async function createFile(email,dateAndTime,fileName,downloadTimes,textinput,public,fileNameHash) {
  // Hash the fileNames before we insert it into the database
  const file = {
    username: email,
    date: dateAndTime,
    name: fileName,
    downloadLink: fileNameHash,
    count: parseInt(downloadTimes, 10),
    text: textinput,
    public: public
  };
  await fileCollection.insertOne(file);

  return file;
}

async function deleteFile(filename) {
  try {
    // Delete the file from the database using the filename
    await fileCollection.deleteOne({ downloadLink: filename });
  } catch (error) {
    throw error;
  }
}

function addDownload(file) {
  const update = {
    $inc: {
      count: 1, // set the new value for the downloadTimes field
    }
  };
  fileCollection.updateOne({ date: file.date }, update);
}

function getLatestDownloads() {
  const query = {};
  const options = {
    sort: { date: -1 },
    limit: 10,
  };
  const cursor = fileCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
  getUser,
  getFile,
  getUserByToken,
  createUser,
  createFile,
  deleteFile,
  addDownload,
  getLatestDownloads,
};
