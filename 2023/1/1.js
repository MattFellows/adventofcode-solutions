var fs = require('fs');
var path = require('path');

const forwardNumericMap = {
  'e': {'i': {'g': {'h': {'t': 8}}}}, 
  'f': {
    'i': {'v': {'e': 5}}, 
    'o': {'u': {'r': 4}}
  }, 
  'n': {'i': {'n':{'e': 9}}},
  'o':{'n':{'e': 1}},
  's': {
    'e': {'v': {'e': {'n': 7}}}, 
    'i':{'x': 6}
  },
  't': {
    'w': {'o': 2}}, 
    'h': {'r': {'e': {'e': 3}}}
  };

const backwardNumericMap = {
    't': {'h': {'g': {'i': {'e': 8}}}}, 
    'e': {
      'v': {'i': {'f': 5}}, 
      'n': {
        'i': {'n': 9}, 
        'o': 1
      }, 
      'e': {'r': {'h': {'t': 3}}}
    }, 
    'r': {'u': {'o': {'f': 4}}}, 
    'n': {'e': {'v': {'e': {'s': 7}}}}, 
    'x': {'i': {'s': 6}}, 
    'o': {'w': {'t': 2}}
  }; 


const bufferFile = (relPath) => {
    return fs.readFileSync(path.join(__dirname, relPath)); // zzzz....
}

const parseNumbersFromLines = (lines) => {


  result = lines.toString().split("\n").map(line => {
      let lineChars = line.split("");
      let matching = false;
      let firstDigit = null;
      let lastDigit = null;
      let currentSubMap = null;
      let currentStrMatch = null;
      for (let i = 0; i < lineChars.length; i++) {
        //console.log(lineChars[i]);
        if (matching && currentSubMap[lineChars[i]]) {
          currentSubMap = currentSubMap[lineChars[i]]
          currentStrMatch = currentStrMatch + lineChars[i]
          console.log('Matching: ', lineChars[i], currentSubMap, currentStrMatch)
          if (Number.isInteger(currentSubMap)) {
            firstDigit = ""+currentSubMap
            break
          }
        } else if (matching) {
          matching = false
          currentSubMap = null;
          i = i - (currentStrMatch.length - 1);
        }
        if (!matching && forwardNumericMap[lineChars[i]]) {
          matching = true;
          currentSubMap = forwardNumericMap[lineChars[i]];
          currentStrMatch = lineChars[i]
        } else if (!matching && Number.isInteger(parseInt(lineChars[i], 10))) {
          firstDigit = lineChars[i]
          break
        }
      }

      for (let i = lineChars.length-1; i > -1; i--) {
        if (matching && currentSubMap[lineChars[i]]) {
          currentSubMap = currentSubMap[lineChars[i]]
          currentStrMatch = currentStrMatch + lineChars[i]
          console.log('Matching: ', lineChars[i], currentSubMap, currentStrMatch)
          if (Number.isInteger(currentSubMap)) {
            lastDigit = ""+currentSubMap
            break
          }
        } else if (matching) {
          matching = false
          currentSubMap = null;
          i = i + (currentStrMatch.length - 1);
        }
        if (!matching && backwardNumericMap[lineChars[i]]) {
          matching = true;
          currentSubMap = backwardNumericMap[lineChars[i]];
          currentStrMatch = lineChars[i]
        } else if (!matching && Number.isInteger(parseInt(lineChars[i], 10))) {
          lastDigit = lineChars[i]
          break
        }
      }

      if (firstDigit == null) {
        firstDigit = lastDigit
      }
      if (lastDigit == null) {
        lastDigit = firstDigit
      }

      console.log(`${line} => ${firstDigit.toString()}${lastDigit.toString()}`);
      return (firstDigit || lastDigit) + (lastDigit || firstDigit);
    })

  let sum = 0;
  result.forEach(a => sum += parseInt(a, 10))
  return sum;

}

const BUFFER = bufferFile('./input.txt');
console.log(parseNumbersFromLines(BUFFER))