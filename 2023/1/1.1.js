var fs = require('fs');
var path = require('path');
var BUFFER = bufferFile('./input.txt');

const numbers = ["one","two","three","four","five","six","seven","eight","nine","1","2","3","4","5","6","7","8","9"];

const bufferFile = (relPath) => {
    return fs.readFileSync(path.join(__dirname, relPath)); 
}

const getNumFromIndex = (index) => {
  if (Number.isInteger(parseInt(index.key, 10))) {
    return new String(index.key);
  }
  return new String(numbers.indexOf(index.key) + 1);
}

const parseNumbersFromLines = (lines) => {
  result = lines.toString().split("\n").map(line => {
      const indexesForward = numbers.map(n => ({key: n, value: line.indexOf(n)})).filter(i => i.value !== -1);
      const indexesBackward = numbers.map(n => ({key: n, value: line.lastIndexOf(n)})).filter(i => i.value !== -1);

      const firstDigit = getNumFromIndex(indexesForward.sort((i1, i2) => i1.value - i2.value)[0]);
      const lastDigit  = getNumFromIndex(indexesBackward.sort((i1, i2) => i2.value - i1.value)[0]);

      //console.log(`${line} => ${firstDigit.toString()}${lastDigit.toString()}`, indexesForward, indexesBackward);
      return (firstDigit || lastDigit).toString() + (lastDigit || firstDigit).toString();
    })
    
  //console.log(result)

  let sum = 0;
  result.forEach(a => sum += parseInt(a, 10))
  return sum;
}

console.log(parseNumbersFromLines(BUFFER));