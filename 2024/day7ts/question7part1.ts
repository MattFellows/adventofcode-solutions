import fs from 'fs'

interface Equation {
  total: number
  numbers: (number|string)[]
  valid: boolean | undefined
}

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const equations = lines.map(l => {
  const left = Number(l.substring(0, l.indexOf(':')))
  const right = l.substring(l.indexOf(':') + 1).trim().split(" ").map(Number)
  return {total: left, numbers: right, valid: undefined}
})

console.log(equations)

const setupEquations = (e:Equation) => {
  const numberEquations:(number|string)[] = []
  for (let i = 0; i < e.numbers.length; i++) {
    numberEquations.push(e.numbers[i])
    numberEquations.push('+')
  }
  numberEquations.pop()
  return {total: e.total, numbers: numberEquations.filter(a => a !== undefined), valid: undefined}
}

const isValid = (e:Equation) => {
  let numberTotal = 0
  for (let i = 0; i < e.numbers.length-2; i = i + 2) {
    if (i == 0) {
      numberTotal = Number(e.numbers[i])
    }
    if (e.numbers[i+1] === '+') {
      numberTotal = numberTotal + Number(e.numbers[i+2])
    }
    if (e.numbers[i+1] === '*') {
      numberTotal = numberTotal * Number(e.numbers[i+2])
    }
  }
  return numberTotal === e.total
}

const dec2bin = (dec:number) => {
  return (dec >>> 0).toString(2);
}


const canBeValid = (e:Equation) => {
  const numNumbers = (e.numbers.length + 1)/2;
  const numOperators = (e.numbers.length - 1)/2
  const binaryOperations = Math.pow(2, numOperators)
  for (let i = 0; i < binaryOperations; i++) {
    const operationsBin = dec2bin(i).padStart(dec2bin(binaryOperations-1).length, '0').split("").reverse()
    for (let j = 0; j < operationsBin.length; j++) {
      e.numbers[(2 * j) + 1] = operationsBin[j] === '1' ? '*' : '+'
    }
    e.valid = isValid(e)
    if (e.valid) {
      return e
    }
  }
}

const mapValid = (e) => {
  const equation = setupEquations(e)
  const fixedEquation = canBeValid(equation)
  return fixedEquation;
}


//mapValid(equations[4])

const validEquations = equations.map(mapValid).filter(a => a !== undefined).map(c => c.total).reduce((p,c) => p + c)
console.log(validEquations)

// for (let i = 3; i < 25; i=i+2) {
  
//   console.log(i, numNumbers, numOperators, binaryLength)
// }
