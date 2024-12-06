const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const data = []
input.split("\n").forEach(line => {
  const levels = line.split(" ").map(l => parseInt(l, 10))
  data.push(levels)
});

const isPass = (levels,wobbleCheck) => {
  let errorIndicesIncr = []
  let errorIndicesDecr = []
  let allIncreasingAndSpacedOK = true;
  for (let i = 0; i < levels.length - 1; i++) {
    const before = allIncreasingAndSpacedOK
    allIncreasingAndSpacedOK = allIncreasingAndSpacedOK && levels[i] < levels[i+1] && (levels[i+1] - levels[i] <= 3)
    if (before && !allIncreasingAndSpacedOK) {
      errorIndicesIncr.push(i+1)
    }
  }
  let allDecreasingAndSpacedOK = true;
  for (let i = 0; i < levels.length - 1; i++) {
    const before = allDecreasingAndSpacedOK
    allDecreasingAndSpacedOK = allDecreasingAndSpacedOK && levels[i] > levels[i+1] && (levels[i] - levels[i+1] <= 3)
    if (before && !allIncreasingAndSpacedOK) {
      errorIndicesDecr.push(i+1)
    }
  }
  if (wobbleCheck) {
    if (!allIncreasingAndSpacedOK && !allDecreasingAndSpacedOK && errorIndicesIncr.length > 0) {
      for (let i = 0; i < levels.length; i++) {
        if (isPass(levels.slice(0,i).concat(levels.slice(i+1)), false)) {
          return true
        }
      }
    }
    if (!allIncreasingAndSpacedOK && !allDecreasingAndSpacedOK && errorIndicesDecr.length > 0) {
      for (let i = 0; i < levels.length; i++) {
        if (isPass(levels.slice(0,i + 1).concat(levels.slice(i+1)))) {
          return true
        }
      }
    }
  }
  return allIncreasingAndSpacedOK || allDecreasingAndSpacedOK
}

console.log(data.filter(d => isPass(d, true)).length)
