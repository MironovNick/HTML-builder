const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const outfile = fs.createWriteStream(path.join(__dirname,'text.txt'));

const readline = require('readline');
let rl = readline.createInterface({
  input: stdin,
  output: stdout,
  prompt: "Введите текст:"
 }); 

rl.prompt();
rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    rl.close();
  } else {
         outfile.write(line +'\n');
         rl.prompt();
  }
});

outfile.on('error', error => console.log('Error', error.message));
 
rl.on('close', () => {
     console.log ("Операция записи в файл завершена!");
     process.exit(0);
});