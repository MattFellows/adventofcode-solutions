const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const equations = lines.map(l => {
  const left = Number(l.substring(0, l.indexOf(':')))
  const right = l.substring(l.indexOf(':') + 1).trim().split(" ").map(Number)
  return {total: left, numbers: right}
})

console.log(equations)

const setupEquations = (e) => {
  const numberEquations = []
  for (let i = 0; i < e.numbers.length; i++) {
    numberEquations.push(e.numbers[i])
    numberEquations.push('+')
  }
  numberEquations.pop()
  return {total: e.total, numbers: numberEquations.filter(a => a !== undefined), valid: undefined}
}

const isValid = (e) => {
  let numberTotal = 0
  for (let i = 0; i < e.numbers.length-2; i = i + 2) {
    if (i == 0) {
      numberTotal = e.numbers[i]
    }
    if (e.numbers[i+1] === '+') {
      numberTotal = numberTotal + e.numbers[i+2]
    }
    if (e.numbers[i+1] === '*') {
      numberTotal = numberTotal * e.numbers[i+2]
    }
    if (e.numbers[i+1] === '|') {
      numberTotal = Number(`${numberTotal}${e.numbers[i+2]}`)
    }
  }
  return numberTotal === e.total
}

const dec2bin = (dec) => {
  return (dec >>> 0).toString(2);
}

const dec2trin = (dec) => {
  return (dec >>> 0).toString(3);
}

/*
0 => 1 + + +
1 => 1 * + +
2 => 3 + * +
3 => 3 * * +
4 => 5 + + *
5 => 5 * + *
6 => 7 + * *
7 => 7 * * *
*/
const canBeValid = (e) => {
  const numNumbers = (e.numbers.length + 1)/2;
  const numOperators = (e.numbers.length - 1)/2
  const trinaryOperations = Math.pow(3, numOperators)
  for (let i = 0; i < trinaryOperations; i++) {
    const operationsBin = dec2trin(i).padStart(dec2trin(trinaryOperations-1).length, '0').split("").reverse()
    for (let j = 0; j < operationsBin.length; j++) {
      e.numbers[(2 * j) + 1] = operationsBin[j] === '2' ? '|' : operationsBin[j] === '1' ? '*' : '+'
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

const validEquations = equations.map(mapValid).filter(a => a !== undefined)
console.log()
console.log(validEquations)
console.log()
console.log(validEquations.map(c => c.total).reduce((p,c) => p+c))

// for (let i = 0; i < 25; i=i+1) {
//   console.log(i, dec2trin(i))
// }

