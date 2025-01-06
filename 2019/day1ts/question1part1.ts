import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => Number(l.trim()))
console.log(lines.map(l => Math.floor(l/3) - 2).reduce((p,c) => p+c))


