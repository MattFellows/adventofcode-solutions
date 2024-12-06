const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const matches = input.split(/(mul\([0-9]+,[0-9]+\))/)
const filteredMatches = matches.filter(i => i.match(/(mul\([0-9]+,[0-9]+\))/)?.length).map(m => {
  const left = m.substring(4, m.indexOf(","))
  const right = m.substring(m.indexOf(",")+1, m.indexOf(")"))
  return parseInt(left, 10) * parseInt(right, 10)
})
console.log(filteredMatches.reduce((p,c) => p+c))