//var path = require('path');
//var favicon = require('serve-favicon');
var fs = require('fs');

var program = require('commander');
var querystring = require('querystring');
var generalEndpoint = require('./generalEndpoint');


const key = 'abcdefghijklmnop';

function range(val) {
  return val.split('..').map(Number);
}
 
function list(val) {
  return val.split(',');
}
 
function collect(val, memo) {
  memo.push(val);
  return memo;
}
 
function increaseVerbosity(v, total) {
  return total + 1;
}

 
program
  .version('1.0.0')
  .usage('[options] <file ...>')

  .option('-H, --hostname <hostname>','Qlik Sense Server Host name. localhost if not specified')
  .option('-P, --port <port>', 'API Port Number, 4242 will be use if not specified', parseInt)
  .option('-o, --object <object>', 'MANDATORY : Object type like user, app, stream, systemrule, etc...')
  .option('-m, --method <method>','GET or POST. GET will be use if not specified')
  .option('-f, --full','Get all details about the object type')
  .option('-w, --write','Write output result to file')
  .option('-M, --many','Write many object at the same time')
  .option('-i, --import', 'Import an object')
  .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
  .parse(process.argv);


// Set the default option

if (!program.hostname) 
  program.hostname='localhost';

if (!program.port) 
  program.port='4242';

if (!program.method) 
  program.method='GET';

// Mandatory flags

if (!program.object) 
  throw new Error('--object required');

if ((program.write) && (program.args.length() == 0))
	 throw new Error('fileName required with --write option');


options = {
   hostname: program.hostname,
   port: program.port,
   path: '/qrs/'+program.object,
   method: program.method,
   headers: {
      'x-qlik-xrfkey' : key,
      'X-Qlik-User' : 'UserDirectory= Internal; UserId= sa_repository '
   },
   key: fs.readFileSync("./cer/"+program.hostname+"/client_key.pem"),
   cert: fs.readFileSync("./cer/"+program.hostname+"/client.pem"),
   ca: fs.readFileSync("./cer/"+program.hostname+"/root.pem")
};





generalEndpoint[program.method](options ,program, key);
 

