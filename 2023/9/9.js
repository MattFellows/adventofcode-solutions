const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n")

const getDifference = (line) => {
  const numbers = line.split(" ")
  const differences = []
  for (let i = 0; i < numbers.length-1; i++) {
    differences.push(Number(numbers[i+1]) - Number(numbers[i]))
  }
  return differences.join(" ")
}

const getNewDifferenceFromParent = (diff,prevDiff) => {
  if (!prevDiff) {
    const splitDiff = diff.split(" ").map(Number)
    splitDiff.push(splitDiff[splitDiff.length-1])
    return splitDiff.join(" ")
  }
  const splitDiff = diff.split(" ").map(Number)
  const splitPrevDiff = prevDiff.split(" ").map(Number)
  console.log(`Predicting ${splitDiff[splitDiff.length-1]} + ${splitPrevDiff[splitPrevDiff.length-1]} = ${splitDiff[splitDiff.length-1] + splitPrevDiff[splitPrevDiff.length-1]}`)
  splitDiff.push(splitDiff[splitDiff.length-1] + splitPrevDiff[splitPrevDiff.length-1])
  return splitDiff.join(" ")
}

const predictForLine = (line) => {
  console.log("Predict for line: ", line)
  const differences = []
  let difference = getDifference(line)
  do {
    differences.push(difference)
    difference = getDifference(difference)
  } while (!difference.match(/^[0 ]+$/))

  console.log("Original differences: ", differences.join("\n"))
  console.log()

  for (let i = differences.length - 1; i >= 0; i--) {
    if (i === differences.length - 1) {
      differences[i] = getNewDifferenceFromParent(differences[i])
    } else { 
      differences[i] = getNewDifferenceFromParent(differences[i], differences[i+1])
    }
  }

  console.log("Predicted differences: ", differences.join("\n"))
  console.log()

  const prediction = getNewDifferenceFromParent(line, differences[0])
  console.log("Predicted Line: ", prediction)
  console.log()
  console.log()

  return prediction
}

const predictions = lines.map(predictForLine)

console.log()
console.log(predictions.join("\n"))

console.log(predictions.map(p => {
  const nums = p.split(" ").map(Number)
  return nums[nums.length-1]
}).reduce((p,c) => p+c))