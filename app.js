// Taken from:
// http://stackoverflow.com/questions/24464404/how-to-readline-infinitely-in-node-js

const readline = require('readline');
var log = console.log;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function searchPrompt() {
  rl.question('cmd> ', input => {
    if( input == 'exit' )
      return rl.close();

    log('You entered: ', input);
    searchPrompt();
  });
}