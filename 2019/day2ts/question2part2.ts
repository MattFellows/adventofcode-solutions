import fs from 'fs'
import { IntCode } from '../utils/intcode'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))


for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        // console.log('TRYING', i, j)
        const currentProgram = [...program]
        currentProgram[1] = i
        currentProgram[2] = j
        const intCode = IntCode()
        intCode.setProgram(currentProgram)
        const result = await intCode.process()
        if (result[0] === 19690720) {
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
// const result = await intCode.process()
// if (result[0] === 19690720) {
//     console.log(64,29)
//     console.log((100 * 64) + 29)
// } else {
//     console.log('WRONG', result)
// }

// console.log(process(program))
