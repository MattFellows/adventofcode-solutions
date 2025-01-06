import fs from 'fs'
import { process } from '../utils/intcode'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))

for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        const currentProgram = [...program]
        currentProgram[1] = i
        currentProgram[2] = j
        if (process(currentProgram)[0] === 19690720) {
            console.log(i,j)
            console.log((100 * i) + j)
        }
    }
}

// console.log(process(program))
