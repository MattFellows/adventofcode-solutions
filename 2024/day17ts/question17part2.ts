import exp from 'constants'
import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

let A = 0
let B = 0
let C = 0

let out:number[] = []

let instPtr = 0
let instructions:number[] = []

const getComboOperand = (op:number):number => {
    switch (op) {
        case 0:
        case 1:
        case 2:
        case 3:
            return op
        case 4:
            return A
        case 5: 
            return B
        case 6:
            return C
    }
    throw new Error("Invalid operand")
}

const runOperation = (opCode:number, operand:number):void => {
    switch (opCode) {
        case 0:
            A = Math.floor(A/Math.pow(2,getComboOperand(operand)))
            break;
        case 1:
            B = B ^ operand
            break;
        case 2:
            B = ((getComboOperand(operand) % 8) + 8) % 8
            break;
        case 3: 
            if (A === 0) {
                return
            }
            instPtr = operand
            break;
        case 4:
            B = B ^ C
            break;
        case 5:
            out.push(((getComboOperand(operand) % 8) + 8) % 8)
            break;
        case 6:
            B = Math.floor(A/Math.pow(2,getComboOperand(operand)))
            break;
        case 7: 
            C = Math.floor(A/Math.pow(2,getComboOperand(operand)))
            break;
    }
}

const cycle = () => {
    const opCpde = instructions[instPtr]
    const operand = instructions[instPtr+1]
    runOperation(opCpde, operand)
    if (opCpde !== 3 || A === 0) {
        instPtr += 2
    }
}

const reset = () => {
    lines.forEach(l => {
        if (l.startsWith('Register A')) {
            A = Number(l.split(':')[1].trim())
        }
        if (l.startsWith('Register B')) {
            B = Number(l.split(':')[1].trim())
        }
        if (l.startsWith('Register C')) {
            C = Number(l.split(':')[1].trim())
        }
        if (l.startsWith('Program')) {
            instructions = l.split(':')[1].trim().split(',').map(Number)
        }
    })
    out = []
    instPtr = 0
}
reset()
console.log(`A: ${A} B: ${B} C: ${C} Instructions: ${instructions} Ptr: ${instPtr}`)
while (instPtr < instructions.length) {
    cycle()
    // console.log(`A: ${A} B: ${B} C: ${C} Instructions: ${instructions} Ptr: ${instPtr}`)
}
const expectedResult = instructions.join(",")
let smallestA = 0
let a = 0;
let ballparkFound = false
while (a < Number.POSITIVE_INFINITY) {
    reset()
    A = a
    while (instPtr < instructions.length) {
        cycle()
    }
    if (a % 100000 === 0) {
        console.log(`Expected: ${expectedResult} Output: ${out.join(',')} ${a / 100000000}`)
    }
    if (out.join(",") === expectedResult) {
        console.log('-------------------------', a, '------------------------')
        smallestA = a
        a = Number.POSITIVE_INFINITY
    } else if (out.length < instructions.length) {
        a += 100000000
    } else {
        if (!ballparkFound) {
            ballparkFound = true
            a -= 100000000
        }
        a++
    }
}

console.log(smallestA, out.join(","))