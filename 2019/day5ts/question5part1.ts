import fs from 'fs'
import { getOutput, process, setInput } from '../utils/intcode'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))

setInput(1)
process(program)
console.log(getOutput())