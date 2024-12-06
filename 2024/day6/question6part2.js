const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const grid = lines.map(l => l.split(""))

//console.log(grid.length)
//console.log(grid[6].length)

let history = []

let xPos, yPos, dir = 0;
for (let y = 0; y < grid.length; y++) {
  const line = grid[y]
  const length = line.length
  // console.log(y, length, line, line.includes('^'))
  if (line.includes('^')) {
    // console.log('Setting yPos')
    yPos = y;
    for (let x = 0; x < length; x++) {
      // console.log('Checking ', x, line[x])
      if (line[x] === '^') {
        // console.log('Setting xPos')
        xPos = x
        x = length
      }
    }
    y = grid.length
  }  
}

// console.log(xPos, yPos)

const startingPoint = {xPos, yPos, dir: 0}

const addToHistory = (xPos, yPos, dir) => {
  // console.log('Adding to history', xPos, yPos, dir)
  history.push({yPos, xPos, dir})
  // console.log(history)
}

const processMap = (gridToTest) => {
  addToHistory(xPos, yPos, dir)
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

  if (newPos.yPos < 0 || newPos.yPos >= gridToTest.length || newPos.xPos < 0 || newPos.xPos >= gridToTest[newPos.yPos].length) {
    gridToTest[yPos][xPos] = 'X'
    xPos = newPos.xPos
    yPos = newPos.yPos
    return 
  }
  const newPosElem = gridToTest[newPos.yPos][newPos.xPos]
  //console.log(newPosElem)
  if (newPosElem === '.' || newPosElem === 'X') {
    // console.log('Moving')
    gridToTest[yPos][xPos] = 'X'
    xPos = newPos.xPos
    yPos = newPos.yPos
    gridToTest[yPos][xPos] = '^'
  } else if (newPosElem === '#') {
    // console.log('Rotating')
    dir += 1
    dir = dir % 4
  }
  // console.log(gridToTest.map(l => l.join('')).join('\n'))
  // console.log("-----------")
}

while (yPos < grid.length && xPos < grid[yPos].length) {
  processMap(grid)
}

// console.log(grid.map(l => l.join('')).join('\n'))
// console.log('----------------------------------')

const checkHistory = (history, xPos, yPos, dir) => {
  return history.filter(h => h.xPos === xPos && h.yPos === yPos && h.dir === dir).length > 0
}

let countLoops = 0;
// const y = 6;
// const x = 2
for (let y = 0; y < grid.length; y++) {
 for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === 'X' && (y !== startingPoint.yPos || x != startingPoint.xPos)) {
      history = []
      const testGrid = [...grid].map(function(arr) {
        return arr.slice();
      });
      xPos = Number(startingPoint.xPos)
      yPos = Number(startingPoint.yPos)
      dir = Number(startingPoint.dir)
      grid[yPos][xPos] = '^'
      testGrid[y][x] = '#'
      console.log(grid[y][x], testGrid[y][x], x,y)

      // console.log(testGrid.map(l => l.join('')).join('\n'))
      // console.log('----------------------------------')
      
      while (yPos >= 0 && yPos < testGrid.length && xPos >= 0 && xPos < testGrid[yPos].length && (!checkHistory(history,xPos, yPos, dir))) {
        processMap(testGrid)
      }
      if (checkHistory(history,xPos, yPos, dir)) {
        // console.log(`Loop found: ${x} ${y}`, history)
        countLoops++
      }
    }
 }
}

console.log(countLoops)