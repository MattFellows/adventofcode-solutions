const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const grid = lines.map(l => l.split(""))

//console.log(grid.length)
//console.log(grid[6].length)

let xPos, yPos, dir = 0;
for (let y = 0; y < grid.length; y++) {
  const line = grid[y]
  const length = line.length
  console.log(y, length, line, line.includes('^'))
  if (line.includes('^')) {
    console.log('Setting yPos')
    yPos = y;
    for (let x = 0; x < length; x++) {
      console.log('Checking ', x, line[x])
      if (line[x] === '^') {
        console.log('Setting xPos')
        xPos = x
        x = length
      }
    }
    y = grid.length
  }  
}

console.log(xPos, yPos)


const processMap = () => {
  let newPos = {xPos, yPos, dir}
  if (dir === 0) {
    newPos.yPos -= 1;
  } else if (dir === 1) {
    newPos.xPos += 1;
  } else if (dir === 2) {
    newPos.yPos += 1;
  } else if (dir === 3) {
    newPos.xPos -= 1;
  }

  if (newPos.yPos >= grid.length || newPos.xPos >= grid[newPos.yPos].length) {
    grid[yPos][xPos] = 'X'
    xPos = newPos.xPos
    yPos = newPos.yPos
    return 
  }
  const newPosElem = grid[newPos.yPos][newPos.xPos]
  //console.log(newPosElem)
  if (newPosElem === '.' || newPosElem === 'X') {
    grid[yPos][xPos] = 'X'
    xPos = newPos.xPos
    yPos = newPos.yPos
    grid[yPos][xPos] = '^'
  } else if (newPosElem === '#') {
    dir += 1
    dir = dir % 4
  }
  //console.log(grid.map(l => l.join('')).join('\n'))
  //console.log("-----------")
}

while (yPos < grid.length && xPos < grid[yPos].length) {
  processMap()
}


console.log(grid.map(l => l.join('')).join('\n'))

console.log(grid.map(l => l.filter(c => c === 'X').length).reduce((p,c) => p+c))