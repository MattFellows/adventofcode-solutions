import fs from 'fs'
import { IntCode } from '../utils/intcode'
import { generatePermutations } from '../utils/utils'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))

let max = 0
let maxPerm = ''

const runPerm = async (p) => {

    let amplifierA = IntCode()
    let amplifierB = IntCode()
    let amplifierC = IntCode()
    let amplifierD = IntCode()
    let amplifierE = IntCode()
    amplifierA.setInput([Number(p[0]),0])
    amplifierA.setProgram(program)
    amplifierA.process()
    const aResult = await amplifierA.awaitOutput()
    const aHalted = amplifierA.didHalt()
    console.log('A:', aResult, aHalted)
    amplifierB.setInput([Number(p[1]),aResult[0]])
    amplifierB.setProgram(program)
    amplifierB.process()
    const bResult = await amplifierB.awaitOutput()
    const bHalted = amplifierB.didHalt()
    console.log('B:', bResult)
    amplifierC.setInput([Number(p[2]),bResult[0]])
    amplifierC.setProgram(program)
    amplifierC.process()
    const cResult = await amplifierC.awaitOutput()
    const cHalted = amplifierC.didHalt()
    console.log('C:', cResult)
    amplifierD.setInput([Number(p[3]),cResult[0]])
    amplifierD.setProgram(program)
    amplifierD.process()
    const dResult = await amplifierD.awaitOutput()
    const dHalted = amplifierD.didHalt()
    console.log('D:', dResult)
    amplifierE.setInput([Number(p[4]),dResult[0]])
    amplifierE.setProgram(program)
    amplifierE.process()
    const eResult = await amplifierE.awaitOutput()
    const eHalted = amplifierE.didHalt()
    console.log('E:', eResult)
    console.log(aHalted, bHalted, cHalted, dHalted, eHalted)
    if (eResult[0] > max) {
        max = eResult[0]
        maxPerm = p
    }
}

const permutations = generatePermutations("01234")
for (let i = 0; i < permutations.length; i++) {
    await runPerm(permutations[i])
}

console.log('MAX: ', max, maxPerm)

// runPerm('54321')#

// max = 0
// maxPerm = ''
// runPerm('01234')

// console.log(max, maxPerm)