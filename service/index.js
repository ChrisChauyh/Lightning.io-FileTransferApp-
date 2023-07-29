const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const multer = require('multer');
const DB = require('./database.js');
const {PeerProxy} = require('./peerProxy.js');
const authCookieName = 'token';
const fs = require('fs');
const path = require('path');





// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser(req.body.email)) {
        res.status(409).send({msg: 'Existing user'});
    } else {
        const user = await DB.createUser(req.body.email, req.body.password);

        // Set the cookie
        setAuthCookie(res, user.token);

        res.send({
            id: user._id,
        });
    }
});

const upload = multer({dest: "uploads"});
app.post('/upload', upload.single('file'), async (req, res) => {
    const userName = req.body.email;
    const fileName = req.body.filenametext;
    const textInput = req.body.textinput;
    const fileNameHash = req.file.filename;
    const show = req.body.public;
    const date = new Date();
    const total = date.toDateString() + ' ' + date.toLocaleTimeString();

    if (userName != null) {
        const fileData = await DB.createFile(
            userName,
            total,
            fileName,
            0,
            textInput,
            show,
            fileNameHash
        );
        res.send(fileData);


    } else {
        res.status(404).send({msg: 'Unknown'});
    }
});

app.delete('/delete/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    const file = await DB.getFile(filename);
    if (file) {
        // Perform the deletion from the database
        await DB.deleteFile(filename);
        // Check if the file exists before attempting to delete it.
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // If the file doesn't exist, respond with an error.
                res.status(404).send('File not found!');
            } else {
                // If the file exists, delete it.
                fs.unlink(filePath, (err) => {
                    if (err) {
                        // If there was an error deleting the file, respond with an error.
                        res.status(500).send('Error deleting file!');
                    } else {
                        // File successfully deleted.
                        res.status(200).send('File deleted!');
                    }
                });
            }
        });

    } else {
        res.status(404).send({msg: 'File not found'});
    }

});
//TODO check if this works


// app.delete('/delete/:filename', async (req, res) => {
//     const filename = req.params.filename;
//     const file = await DB.getFile(filename);
//     if (file) {
//         // Perform the deletion from the database
//         await DB.deleteFile(filename);

//         // Respond with a success message
//         res.send({msg: 'File deleted successfully'});
//     } else {
//         res.status(404).send({msg: 'File not found'});
//     }
// });

// GetFile returns information about a file
app.get('/download/:filename', async (req, res) => {
    const filename = req.params.filename;
    const file = await DB.getFile(filename);
    if (file) {
        // Increment the download count
        file.downloadTimes++;
        await DB.addDownload(file);
        // Send the file to the client for download
        res.download(`uploads/${filename}`, file.name);
    } else {
        res.status(404).send({msg: 'Unknown'});
    }
});


// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.email);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token);
            res.send({id: user._id});
            return;
        }
    }
    res.status(401).send({msg: 'Unauthorized'});
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:email', async (req, res) => {
    const user = await DB.getUser(req.params.email);
    if (user) {
        const token = req?.cookies.token;
        res.send({email: user.email, authenticated: token === user.token});
        return;
    }
    res.status(404).send({msg: 'Unknown'});
});

// secureApiRouter verifies credentials for endpoints
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    const authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if (user) {
        next();
    } else {
        res.status(401).send({msg: 'Unauthorized'});
    }
});

// GetDownloads
secureApiRouter.get('/downloads', async (req, res) => {
    const downloads = await DB.getLatestDownloads();
    res.send(downloads);
});

// Default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({type: err.name, message: err.message});
});

// // Return the application's default page if the path is unknown
// app.use((_req, res) => {
//     res.sendFile('index.html', {root: __dirname + "/build"});
// });


// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}


const httpService = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.use(express.static(path.join(__dirname, '../build')));

app.get("*", function (req, res) {
    res.sendFile(
        path.join(__dirname, "../build/index.html")),
        function (err) {
            if (err) {
                res.status(500).send(err)
            }
        };
});

new PeerProxy(httpService);
