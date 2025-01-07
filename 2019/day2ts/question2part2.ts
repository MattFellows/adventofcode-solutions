import fs from 'fs'
import { IntCode } from '../utils/intcode'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))

const intCode = IntCode()
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        const currentProgram = [...program]
        currentProgram[1] = i
        currentProgram[2] = j
        intCode.setProgram(currentProgram)
        if (intCode.process()[0] === 19690720) {
            console.log(i,j)
            console.log((100 * i) + j)
        }
    }
}

// const intCode = IntCode()
// const currentProgram = [...program]
// currentProgram[1] = 64
// currentProgram[2] = 29
// intCode.setProgram(currentProgram)
// if (intCode.process()[0] === 19690720) {
//     console.log(64,29)
//     console.log((100 * 64) + 29)
// }

// console.log(process(program))
