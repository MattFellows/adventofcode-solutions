import fs from 'fs'

const input = fs.readFileSync('./input-small.txt').toString()
const lines = input.split("\n").map(l => l.trim())
console.log('Lines: ', lines)
