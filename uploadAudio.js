require('dotenv').config()
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('integrador-seguridad.appspot.com');

//-
// Upload a file from a local path.
//-
const upload = (filePath) => {
  return new Promise((res, rej) => {    
    bucket.upload(filePath, (err, file, apiResponse) => {
      console.log(apiResponse.name);
      res(apiResponse.name);
    });
  });
}

module.exports = upload;