const fs = require('fs')
const input = fs.readFileSync('./input1.txt').toString()
const left = []
const right = []
input.split("\n").forEach(line => {
  const split = line.split(" ")
  console.log(line)
  console.log(split)
  left.push(parseInt(split[0], 10))
  right.push(parseInt(split[3], 10))
})

const leftSort = left.sort()
const rightSort = right.sort()

const distances = leftSort.map((l, index) => Math.abs(l - rightSort[index]))
console.log(distances)
console.log(distances.reduce((p, c) => p + c))