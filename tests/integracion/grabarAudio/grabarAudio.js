const record = require("./record.js");
record().then((filename) => {
    console.log('filename: ' + filename);
});