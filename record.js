const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function ls() {
  const { stdout, stderr } = await exec('python3 record.py');
  console.log('stdout:', stdout);
  if(stderr)
    console.log('stderr:', stderr);
}
ls();