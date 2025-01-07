import fs from 'fs'
import { IntCode } from '../utils/intcode'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))

const intCode = IntCode()
intCode.setProgram(program)
console.log(await intCode.process())
