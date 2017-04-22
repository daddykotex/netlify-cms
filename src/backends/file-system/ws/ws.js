// arguments
const argv = require('minimist')(process.argv.slice(2));

const directory = argv.d || argv.directory;
if (!directory) {
  throw new Error('Please give a directory to serve via -d or --directory.');
}

const user = argv.u || argv.user;
if (!user) {
  throw new Error('Please give a user to serve via -u or --user.');
}

const password = argv.p || argv.password;
if (!password) {
  throw new Error('Please give a password to serve via -p or --password.');
}

// 

const express = require('express');
const bodyParser = require('body-parser');
const expressPromise = require('express-promise');
const basicAuth = require('express-basic-auth');

const fs = require('fs-promise');

const name = 'node-hello-world';
const port = '8888';

const app = express();

app.use(expressPromise());
app.use(bodyParser.text());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const staticAuth = basicAuth({
  users: { [user]: password },
});


app.get('/login', staticAuth, (req, res) => {
  res.send();
});

app.get('/api/entries', staticAuth, (req, res) => {
  const folderPath = req.query.folder;
  const fullPath = `${ directory }/${ folderPath }`;

  const readFile = (file) => {
    const path = `${ fullPath }/${ file }`;
    return fs.readFile(path, {
      encoding: 'utf8',
    }).then(content => ({
      file: {
        path: file,
      },
      data: content,
    }));
  };

  const readFolderPromise = fs.readdir(fullPath)
    .then(files => Promise.all(files.map(readFile)));

  res.json(readFolderPromise);
});

app.get('/content/file', staticAuth, (req, res) => {
  const filePath = req.query.path;
  const fullPath = `${ directory }/${ filePath }`;

  const readPromise = fs.readFile(
    fullPath, 
    { encoding: 'utf8' }
  );

  res.send(readPromise);
});

app.post('/content/file', staticAuth, (req, res) => {
  const filePath = req.query.path;
  const body = req.body;

  if (!filePath || !body) {
    res.status(400);
    res.send('No body or path');
  } else {
    const fullPath = `${ directory }/${ filePath }`;

    const writePromise = fs.writeFile(fullPath, body).then(() => null);
    res.send(writePromise);
  }
});

app.listen(port, () => {
  console.log(`${name} is listening on port ${port}`);
});
