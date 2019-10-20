const util = require('util');
const exec = util.promisify(require('child_process').exec);

const record = async () => {
    const fileName = `${new Date().valueOf()}.wav`;
    const { stdout, stderr } = await exec(`python3 record.py ${fileName}`);
    console.log(stdout);
    console.log('Returning filename: ' + fileName);
    return fileName;    
};
module.exports = record;