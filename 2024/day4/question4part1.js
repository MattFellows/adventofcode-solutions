const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const grid = lines.map(l => l.split(""))

const dotGrid = [...grid].map(a => a.map(l => '.'))


let countXMAS = 0;

const checkHorizontalForwards = (y,x) => {
  const match = grid[y].length >=x+3 
  && grid[y][x] === 'X' 
  && grid[y][x+1] === 'M'  
  && grid[y][x+2] === 'A'  
  && grid[y][x+3] === 'S' 

  if (grid[y].length >=x+3) {
    console.log(`HF ${grid[y][x]}${grid[y][x+1]}${grid[y][x+2]}${grid[y][x+3]} ${match}`)
  }
  if (match) {
    countXMAS++
    dotGrid[y][x] = grid[y][x]
    dotGrid[y][x+1] = grid[y][x+1]
    dotGrid[y][x+2] = grid[y][x+2]
    dotGrid[y][x+3] = grid[y][x+3]
  }
}

const checkHorizontalBackwards = (y,x) => {
  const match = x >= 3 
  && grid[y][x] === 'X' 
  && grid[y][x-1] === 'M'  
  && grid[y][x-2] === 'A'  
  && grid[y][x-3] === 'S' 

  if (x >= 3 ) {
    console.log(`HB ${grid[y][x]}${grid[y][x-1]}${grid[y][x-2]}${grid[y][x-3]} ${match}`)
  }
  if (match) {
    countXMAS++
    dotGrid[y][x] = grid[y][x]
    dotGrid[y][x-1] = grid[y][x-1]
    dotGrid[y][x-2] = grid[y][x-2]
    dotGrid[y][x-3] = grid[y][x-3]
  }
}

const checkVerticalForwards = (y,x) => {
  const match = grid.length > y+3 
  && grid[y][x] === 'X' 
  && grid[y+1][x] === 'M'  
  && grid[y+2][x] === 'A'  
  && grid[y+3][x] === 'S' 

  if (grid.length > y+3) {
    console.log(`VF ${grid[y][x]}${grid[y+1][x]}${grid[y+2][x]}${grid[y+3][x]} ${match}`)
  }
  if (match) {
    countXMAS++
    dotGrid[y][x] = grid[y][x]
    dotGrid[y+1][x] = grid[y+1][x]
    dotGrid[y+2][x] = grid[y+2][x]
    dotGrid[y+3][x] = grid[y+3][x]
  }
}

const checkVerticalBackwards = (y,x) => {
  const match = y >= 3 
  && grid[y][x] === 'X' 
  && grid[y-1][x] === 'M'  
  && grid[y-2][x] === 'A'  
  && grid[y-3][x] === 'S' 

  if (y >= 3) {
    console.log(`VB ${grid[y][x]}${grid[y-1][x]}${grid[y-2][x]}${grid[y-3][x]} ${match}`)
  }
  if (match) {
    countXMAS++
    dotGrid[y][x] = grid[y][x]
    dotGrid[y-1][x] = grid[y-1][x]
    dotGrid[y-2][x] = grid[y-2][x]
    dotGrid[y-3][x] = grid[y-3][x]
  }
}

const checkDiagonalFF = (y,x) => {
  const match = grid.length > y+3  
  && grid[y].length > x+3 
  && grid[y][x] === 'X' 
  && grid[y+1][x+1] === 'M'  
  && grid[y+2][x+2] === 'A'  
  && grid[y+3][x+3] === 'S' 

  if (grid.length > y+3 && grid[y].length > x+3) {
    console.log(`DFF ${grid[y][x]}${grid[y+1][x+1]}${grid[y+2][x+2]}${grid[y+3][x+3]} ${match}`)
  }
  if (match) {
    countXMAS++
    dotGrid[y][x] = grid[y][x]
    dotGrid[y+1][x+1] = grid[y+1][x+1]
    dotGrid[y+2][x+2] = grid[y+2][x+2]
    dotGrid[y+3][x+3] = grid[y+3][x+3]
  }
}

const checkDiagonalFB = (y,x) => {
  const match = grid.length > y+3  
  && x >= 3 
  && grid[y][x] === 'X' 
  && grid[y+1][x-1] === 'M'  
  && grid[y+2][x-2] === 'A'  
  && grid[y+3][x-3] === 'S' 

  if (grid.length > y+3 && x >= 3) {
    console.log(`DFB ${grid[y][x]}${grid[y+1][x-1]}${grid[y+2][x-2]}${grid[y+3][x-3]} ${match}`)
  }
  if (match) {
    countXMAS++
    dotGrid[y][x] = grid[y][x]
    dotGrid[y+1][x-1] = grid[y+1][x-1]
    dotGrid[y+2][x-2] = grid[y+2][x-2]
    dotGrid[y+3][x-3] = grid[y+3][x-3]
  }
}

const checkDiagonalBF = (y,x) => {
  const match = y >= 3 
  && grid[y].length > x+3 
  && grid[y][x] === 'X' 
  && grid[y-1][x+1] === 'M'  
  && grid[y-2][x+2] === 'A'  
  && grid[y-3][x+3] === 'S' 

  if (y >= 3 && grid[y].length > x+3) {
    console.log(`DB ${grid[y][x]}${grid[y-1][x+1]}${grid[y-2][x+2]}${grid[y-3][x+3]} ${match}`)
  }
  if (match) {
    countXMAS++
    dotGrid[y][x] = grid[y][x]
    dotGrid[y-1][x+1] = grid[y-1][x+1]
    dotGrid[y-2][x+2] = grid[y-2][x+2]
    dotGrid[y-3][x+3] = grid[y-3][x+3]
  }
}

const checkDiagonalBB = (y,x) => {
  const match = x >= 3 
  && y >= 3
  && grid[y][x] === 'X' 
  && grid[y-1][x-1] === 'M'  
  && grid[y-2][x-2] === 'A'  
  && grid[y-3][x-3] === 'S' 

  if (x >= 3 && y >= 3) {
    console.log(`DB ${grid[y][x]}${grid[y-1][x-1]}${grid[y-2][x-2]}${grid[y-3][x-3]} ${match}`)
  }
  if (match) {
    countXMAS++
    dotGrid[y][x] = grid[y][x]
    dotGrid[y-1][x-1] = grid[y-1][x-1]
    dotGrid[y-2][x-2] = grid[y-2][x-2]
    dotGrid[y-3][x-3] = grid[y-3][x-3]
  }
}

const checkHorizontal = (y,x) => {
  checkHorizontalForwards(y,x)
  checkHorizontalBackwards(y,x)
}

const checkVertical = (y,x) => {
  checkVerticalForwards(y,x)
  checkVerticalBackwards(y,x)
}

const checkDiagonal = (y,x) => {
  checkDiagonalFF(y,x)
  checkDiagonalFB(y,x)
  checkDiagonalBF(y,x)  
  checkDiagonalBB(y,x)  
}



for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === 'X') {
      console.log(`${y}${x}`)
      checkHorizontal(y,x)
      checkVertical(y,x)
      checkDiagonal(y,x)
    }
  }
}

console.log(dotGrid.map(a => a.join('')).reduce((p,c) => p + '\r\n' + c))

console.log(countXMAS)