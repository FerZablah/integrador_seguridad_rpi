require('dotenv').config()
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('integrador-seguridad.appspot.com');

//-
// Upload a file from a local path.
//-
bucket.upload('./1570988697149.wav', (err, file, apiResponse) => {
  console.log(err, apiResponse);
});