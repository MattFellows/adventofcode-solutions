const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const data = []
input.split("\n").forEach(line => {
  const levels = line.split(" ").map(l => parseInt(l, 10))
  data.push(levels)
});

const isPass = (levels) => {
  let allIncreasingAndSpacedOK = true;
  for (let i = 0; i < levels.length - 1; i++) {
    allIncreasingAndSpacedOK = allIncreasingAndSpacedOK && levels[i] < levels[i+1] && (levels[i+1] - levels[i] <= 3)
  }
  let allDecreasingAndSpacedOK = true;
  for (let i = 0; i < levels.length - 1; i++) {
    allDecreasingAndSpacedOK = allDecreasingAndSpacedOK && levels[i] > levels[i+1] && (levels[i] - levels[i+1] <= 3)
  }
  return allIncreasingAndSpacedOK || allDecreasingAndSpacedOK
}

console.log(data.filter(isPass).length)
