const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const matches = input.split(/(mul\([0-9]+,[0-9]+\))|(do\(\))|(don't\(\))/)
const filteredMatches = []
let doProcess = true;
matches.forEach(i => {
  if (i && i.match(/(do\(\))/)?.length) {
    doProcess = true
  }
  if (i && i.match(/(don't\(\))/)?.length) {
    doProcess = false
  }
  if (i && i.match(/(mul\([0-9]+,[0-9]+\))/)?.length && doProcess) {
    const left = i.substring(4, i.indexOf(","))
    const right = i.substring(i.indexOf(",")+1, i.indexOf(")"))
    filteredMatches.push(parseInt(left, 10) * parseInt(right, 10))
  }
})

console.log(filteredMatches.reduce((p,c) => p+c))