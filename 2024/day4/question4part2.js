const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const grid = lines.map(l => l.split(""))

const dotGrid = [...grid].map(a => a.map(l => '.'))


let countXMAS = 0;

const checkGrid = (y,x) => {
  if (
    y > 0 && 
    y < (grid.length - 1) &&
    x > 0 &&
    x < (grid[y].length - 1)
  ) {
    if (
      (
        grid[y-1][x-1] === 'S' && grid[y+1][x+1] === 'M' ||
        grid[y-1][x-1] === 'M' && grid[y+1][x+1] === 'S'
      ) && 
      (
        grid[y-1][x+1] === 'S' && grid[y+1][x-1] === 'M' ||
        grid[y-1][x+1] === 'M' && grid[y+1][x-1] === 'S'
      )
    ) {
      countXMAS++
    }
  }
}


for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === 'A') {
      console.log(`${y}${x}`)
      checkGrid(y,x)
    }
  }
}

console.log(countXMAS)