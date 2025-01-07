import fs from 'fs'
import { IntCode } from '../utils/intcode'
import { generatePermutations, sleep } from '../utils/utils'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))

let max = 0
let maxPerm = ''

const runPerm = async (p) => {
    let amplifiers:any = []
    const amplifierA = IntCode()
    const amplifierB = IntCode()
    const amplifierC = IntCode()
    const amplifierD = IntCode()
    const amplifierE = IntCode()
    amplifiers.push(amplifierA, amplifierB, amplifierC, amplifierD, amplifierE)
    amplifiers.forEach(a => a.setProgram(program))
    amplifierA.setName('A')
    amplifierB.setName('B')
    amplifierC.setName('C')
    amplifierD.setName('D')
    amplifierE.setName('E')
    
    amplifiers.forEach(async (a,i) => {
        a.addInput(Number(p[i]))
    })

    amplifiers.forEach(async (a,i) => {
        if (i === amplifiers.length - 1) {
            a.registerOutputHandler((o:number) => {amplifiers[0].addInput(o)})
        } else {
            a.registerOutputHandler((o:number) => {amplifiers[i+1].addInput(o)})
        }
    })

    amplifierA.addInput(0)
    amplifiers.forEach(a => a.process())

    amplifierE.registerOutputHandler((f) => {
        if (f > max) {
            max = f
            maxPerm = p
        }
    })

    while (!(amplifiers.map(a => a.didHalt()).reduce((p,c) => p && c))) {
        await sleep(10)
        // console.log('Processing...')
    }
    console.log('Finished')
    console.log('MAX: ', max, maxPerm)
}

const permutations = generatePermutations("56789")
for (let i = 0; i < permutations.length; i++) {
    console.log('Trying permutation: ', permutations[i])
    await runPerm(permutations[i])
}

// max = 0
// maxPerm = ''
// await runPerm('97856')

console.log(max, maxPerm)