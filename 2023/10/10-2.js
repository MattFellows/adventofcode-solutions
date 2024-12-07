const fs = require('fs')
const input = fs.readFileSync('./input-3.txt').toString()
const lines = input.split("\n")

const grid = lines.map(l => l.split(''))

const S = {}
for (let i = 0; i < grid.length; i++) {
  const line = grid[i]
  // console.log(line)
  if (line.includes('S')) {
    S.y = i
    S.x = line.indexOf('S')
  }
}

console.log('S: ', S)

const followPathNEAndCount = (gridCopy, xArg, yArg) => {
  console.log('followPathNEAndCount', xArg, yArg)
  let x = xArg
  let y = yArg
  if (gridCopy[y-1][x] === 'F' || gridCopy[y-1][x] === '|' || gridCopy[y-1][x] === '7') {
    gridCopy[y][x] = 0
    gridCopy[y][x] = 0
    let dir = 's'
    let pathResp = followPath(0, gridCopy, y-1, x, dir)
    x = pathResp.x
    y = pathResp.y
    dir = pathResp.dir
    let i = 1
    console.log(`${x} === ${S.x} && ${y} === ${S.y}?`)
    while (!(x === S.x && y === S.y)) {
      console.log(pathResp)
      pathResp = followPath(i++, gridCopy, y, x, dir)
      x = pathResp.x
      y = pathResp.y
      dir = pathResp.dir
      console.log(pathResp)
    } 
  } else if (gridCopy[y][x+1] === 'J' || gridCopy[y][x+1] === '-' || gridCopy[y][x+1] === '7') {
    gridCopy[y][x] = 0
    let dir = 'w'
    let pathResp = followPath(0, gridCopy, y, x+1, dir)
    x = pathResp.x
    y = pathResp.y
    dir = pathResp.dir
    let i = 1
    console.log(`${x} === ${S.x} && ${y} === ${S.y}?`)
    while (!(x === S.x && y === S.y)) {
      console.log(pathResp)
      pathResp = followPath(i++, gridCopy, y, x, dir)
      x = pathResp.x
      y = pathResp.y
      dir = pathResp.dir
      console.log(pathResp)
    } 
  }
  return gridCopy
}

const followPathSWAndCount = (gridCopy, x, y) => {
  console.log('followPathSWAndCount', x, y)
  if (gridCopy[y+1][x] === 'J' || gridCopy[y+1][x] === '|' || gridCopy[y+1][x] === 'L') {
    gridCopy[y][x] = 0
    let dir = 'n'
    let pathResp = followPath(0, gridCopy, y+1, x, dir)
    x = pathResp.x
    y = pathResp.y
    dir = pathResp.dir
    let i = 1
    while (!(x === S.x && y === S.y)) {
      console.log(pathResp)
      pathResp = followPath(i++, gridCopy, y, x, dir)
      x = pathResp.x
      y = pathResp.y
      dir = pathResp.dir
      console.log(pathResp)
    } 
  } else if (gridCopy[y][x-1] === 'F' || gridCopy[y][x-1] === '-' || gridCopy[y][x-1] === 'L') {
    gridCopy[y][x] = 0
    let dir = 'e'
    let pathResp = followPath(0, gridCopy, y, x-1, dir)
    x = pathResp.x
    y = pathResp.y
    dir = pathResp.dir
    let i = 1
    while (!(x === S.x && y === S.y)) {
      console.log(pathResp)
      pathResp = followPath(i++, gridCopy, y, x, dir)
      x = pathResp.x
      y = pathResp.y
      dir = pathResp.dir
      console.log(pathResp)
    } 
  }
  return gridCopy
}

const followPath = (i, gridCopy, y, x, enteredFrom) => {
  console.log(`Follow Path: (${i})`, x, y, grid[y][x], enteredFrom)
  switch (grid[y][x]) {
    case 'F':
      if (enteredFrom === 's') {
        // gridCopy[y][x] = 2
        return  {y, x: x+1, dir:'w'}
      } else {
        // gridCopy[y][x] = 2
        return {y: y+1, x, dir: 'n'}
      }
      break;
    case 'J':
      if (enteredFrom === 'n') {
        // gridCopy[y][x] = 2
        return {y, x: x-1, dir: 'e'}
      } else {
        // gridCopy[y][x] = 2
        return {y: y-1, x, dir: 's'}
      }
      break;
    case '|':
      if (enteredFrom === 's') {
        // gridCopy[y][x] = 0
        return {y: y-1, x, dir: 's'}
      } else {
        // gridCopy[y][x] = 0
        return {y: y+1, x, dir: 'n'}
      }
      break;
    case '-':
      if (enteredFrom === 'e') {
        // gridCopy[y][x] = 1
        return {y: y, x: x-1, dir: 'e'}
      } else {
        // gridCopy[y][x] = 1
        return {y: y, x: x+1, dir: 'w'}
      }
      break;
    case '7':
      if (enteredFrom === 'w') {
        // gridCopy[y][x] = 2
        return {y: y+1, x, dir: 'n'}
      } else {
        // gridCopy[y][x] = 2
        return {y: y, x: x-1, dir: 'e'}
      }
      break;
    case 'L':
      if (enteredFrom === 'e') {
        // gridCopy[y][x] = 2
        return {y: y-1, x, dir: 's'}
      } else {
        // gridCopy[y][x] = 2
        return {y: y, x: x+1, dir: 'w'}
      }
      break;
  }
}

const consolidate = (NEPathCount, SWPathCount) => {
  const consolidated = [];
  for (let y = 0; y < NEPathCount.length; y++) {
    for (let x = 0; x < NEPathCount[y].length; x++) {
      if (!consolidated[y]) {
        consolidated[y] = []
      }
      consolidated[y][x] = NEPathCount[y][x] === SWPathCount[y][x] ? NEPathCount[y][x] : Math.min(SWPathCount[y][x], NEPathCount[y][x])
    }
  }
  return consolidated;
}

const followPathAndCount = () => {
  let gridCopy = grid.map(function(arr) {
    return arr.slice();
  });

  let x = S.x
  let y = S.y
  const NEPathCount = followPathNEAndCount(gridCopy, x, y).map(function(arr) {
    return arr.slice();
  });

  gridCopy = grid.map(function(arr) {
    return arr.slice();
  });

  x = S.x
  y = S.y
  const SWPathCount = followPathSWAndCount(gridCopy, x, y).map(function(arr) {
    return arr.slice();
  });

  // console.log(NEPathCount)
  // console.log(SWPathCount)

  return consolidate(NEPathCount, SWPathCount)
}

const distances = followPathAndCount();
console.log(distances.map(l => l.map(String).map(a => a.padStart(2, ' ')).join("")).join("\n"))

const isInsideH = (x,y,distances) => {
  console.log(`isInsideH ${x} ${y}`)
  let inside = false
  for (let i = 0; i < distances[y].length; i++) {
    if (distances[y][i] === 0 || distances[y][i] === 2) {
      console.log(`Toggle to ${!inside}`)
      inside = !inside
    } else {
      console.log(`!Toggling: ${distances[y][i]}`)
    }
    if (i === x) {
      return inside
    }
  }
}

const isNumber = (x) => {
  console.log(`${x} ${typeof x}`)
  return typeof x === "number"
}

const isInsideV = (x,y,distances) => {
  let inside = false
  for (let i = 0; i < distances.length; i++) {
    if (distances[i][x] === 1 || distances[i][x] === 2) {
      inside = !inside
    }
    if (i === y) {
      return inside
    }
  }
}

let countInside = 0;
for (let y = 0; y < distances.length; y++) {
  for (let x = 0; x < distances[y].length; x++) {
    if (distances[y][x] === '.') {
      if (isInsideH(x,y,distances) && isInsideV(x,y,distances)) {
        distances[y][x] = 'I'
        countInside++
      }
    }
  }
}

console.log(countInside)

console.log(distances.map(l => l.map(String).map(a => a.padStart(2, ' ')).join("")).join("\n"))