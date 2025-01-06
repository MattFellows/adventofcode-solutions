import fs from 'fs'
import { process } from '../utils/intcode'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))

console.log(process(program))
