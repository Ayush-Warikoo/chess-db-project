// required module
const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });


readline.question('File Path Input: ', async filePath => {

    // read the file content
    const str = fs.readFileSync(filePath).toString();

    // split
    let arr = str.split(/\-0\s|\-1\s/);
    let count = 0
    // save items as new files
    arr.forEach((data, idx)=> {
        count += 1

        // write to file
        fs.writeFileSync(`${count}.pgn`, data);
    });
    
      readline.close();
    });