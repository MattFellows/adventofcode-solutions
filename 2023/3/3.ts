var fs = require('fs');
var path = require('path');
const _ = require('lodash');

const bufferFile = (relPath:string):Buffer => {
  return fs.readFileSync(path.join(__dirname, relPath)); 
}


interface GridSquare {
  x: number
  y: number
  value: string
}

interface Grid {
  gridSquares: GridSquare[]
  associativeArrayGrid: [GridSquare[]]
  maxX: number
  maxY: number
}

interface PPN {
  number: number
  gridSquares: GridSquare[]
  minX: number
  maxX: number
  y: number
}

interface GearRatioPair {
  p1: PPN
  p2: PPN
}

const makeGridFromInput = (contents:Buffer|String):Grid => {
  let associativeArrayGrid: any = [];
  const gridSquares = [] as GridSquare[];
  const lines = contents.toString().split("\n")
  const maxY = lines.length;
  let maxX = 0;
  for (let y = 0; y <= maxY; y ++) {
    const line = lines[y];
    const lineOfGrid = [] as GridSquare[]
    const chars = line?.split("") || []
    for (let x = 0; x < chars.length; x++) {
      if (x > maxX) {
        maxX = x
      }
      const value = chars[x];
      lineOfGrid.push({x,y,value})
      gridSquares.push({x,y,value});
    }
    (associativeArrayGrid as any).push(lineOfGrid);
  }
  return {gridSquares, associativeArrayGrid, maxX, maxY};
}

const getSquareOfGrid = (x:number, y:number, grid:Grid):GridSquare => {
  return grid.associativeArrayGrid?.[y]?.[x];
}

const isSymbol = (gridSquare:GridSquare):boolean => {
  return gridSquare && !(gridSquare?.value?.match?.(/[\d\.]/));
}

const isAsteriskSymbol = (gridSquare:GridSquare):boolean => {
  return gridSquare && !!(gridSquare?.value?.match?.(/\*/));
}

const hasAdjacentSymbol = (gridSquare:GridSquare, grid:Grid):boolean => {
  return  isSymbol(getSquareOfGrid(gridSquare.x, (gridSquare.y+1), grid)) ||
          isSymbol(getSquareOfGrid(gridSquare.x, (gridSquare.y-1), grid)) ||

          isSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y+1, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y-1, grid)) ||           
          
          isSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y+1, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y-1, grid));
}

const hasAdjacentAsteriskSymbol = (gridSquare:GridSquare, grid:Grid):boolean => {
  return  isAsteriskSymbol(getSquareOfGrid(gridSquare.x, (gridSquare.y+1), grid)) ||
          isAsteriskSymbol(getSquareOfGrid(gridSquare.x, (gridSquare.y-1), grid)) ||

          isAsteriskSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y+1, grid)) || 
          isAsteriskSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y, grid)) || 
          isAsteriskSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y-1, grid)) ||           
                  
          isAsteriskSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y+1, grid)) || 
          isAsteriskSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y, grid)) || 
          isAsteriskSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y-1, grid));
}

const isPartNumber = (groupedNumber:PPN, grid:Grid):boolean => {
  return groupedNumber.gridSquares.filter(gridSquare => hasAdjacentSymbol(gridSquare, grid)).length > 0;
}

const isGear = (groupedNumber:PPN, grid:Grid):boolean => {
  return groupedNumber.gridSquares.filter(gridSquare => hasAdjacentAsteriskSymbol(gridSquare, grid)).length > 0;
}

const groupNumbers = (grid:Grid):PPN[] => {
  const potentialParts = [] as PPN[];
  for (let y = 0; y < grid.maxY; y++) {
    for (let x = 0 ; x < grid.maxX; x++) {
      const firstDigitOfPotentialNumber = grid.associativeArrayGrid?.[y]?.[x]
      let potentialPartNumbers = [] as GridSquare[];
      if (firstDigitOfPotentialNumber && firstDigitOfPotentialNumber.value.match(/\d/)) {
        // console.log(`Starting number: ${sq.value}`)
        potentialPartNumbers.push(firstDigitOfPotentialNumber)
        for (let i = 1; i < (grid.maxX - x + 1); i++) {
          let psq = grid.associativeArrayGrid[y][x + i]
          if (psq && psq.value.match(/\d/)) {
            // console.log(`Adding to number: ${psq.value}`)
            potentialPartNumbers.push(psq)
          } else {
            // console.log(`Stopping number: ${psq.value}`)
            i = grid.maxX + 10
          }
        }
        const ppnY = y;
        const ppnMinX = x;
        const ppnMaxX = x+potentialPartNumbers.length;
        x = ppnMaxX;
        potentialParts.push({number: parseInt(potentialPartNumbers.map(p=>p.value).join(""), 10), gridSquares: potentialPartNumbers, minX: ppnMinX, maxX: ppnMaxX, y: ppnY});
      }
    }
  }
  return potentialParts;
}

const outputGrid = (gridSquares:GridSquare[], grid:Grid):void => {
  let minX = gridSquares.map(g => g.x).sort((a,b) => a - b)[0]
  let minY = gridSquares.map(g => g.y).sort((a,b) => a - b)[0]
  let maxX = gridSquares.map(g => g.x).sort((a,b) => b - a)[0]
  let row1 = [] as GridSquare[]
  let row2 = [] as GridSquare[]
  let row3 = [] as GridSquare[]
  for (let x = minX-1; x <= maxX+1; x++) {
    row1.push(getSquareOfGrid(x, minY-1, grid))
    row2.push(getSquareOfGrid(x, minY, grid))
    row3.push(getSquareOfGrid(x, minY+1, grid))
  }
  console.log("")
  console.log(row1.map(g=>g?.value||' ').join(""))
  console.log(row2.map(g=>g?.value||' ').join(""))
  console.log(row3.map(g=>g?.value||' ').join(""))
  console.log("")
}

const isGearRatio = (ppn1:PPN, ppn2:PPN, grid:Grid):boolean => {
  const p1MinX = ppn1.minX;
  const p1Y = ppn1.y;
  const p1MaxX = ppn1.maxX;
  const p1SurroundingSquares: GridSquare[] = new Array();
  for (let x = p1MinX-1; x <= p1MaxX+1; x++) {
    p1SurroundingSquares.push(getSquareOfGrid(x, p1Y-1, grid))
    p1SurroundingSquares.push(getSquareOfGrid(x, p1Y+1, grid))
  }
  p1SurroundingSquares.push(getSquareOfGrid(p1MinX-1, p1Y, grid))
  p1SurroundingSquares.push(getSquareOfGrid(p1MaxX+1, p1Y, grid))
  //console.log(`${p1MinX}-${p1MaxX}x${p1Y}: ${ppn1.number}`)

  const part2GridSquares = ppn2.gridSquares;
  const p2MinX = ppn2.minX;
  const p2Y = ppn2.y;
  const p2MaxX = ppn2.maxX;
  const p2SurroundingSquares: GridSquare[] = new Array();
  for (let x = p2MinX-1; x <= p2MaxX+1; x++) {
    p2SurroundingSquares.push(getSquareOfGrid(x, p2Y-1, grid))
    p2SurroundingSquares.push(getSquareOfGrid(x, p2Y+1, grid))
  }
  p2SurroundingSquares.push(getSquareOfGrid(p2MinX-1, p2Y, grid))
  p2SurroundingSquares.push(getSquareOfGrid(p2MaxX+1, p2Y, grid))
  //console.log(`${p2MinX}-${p2MaxX}x${p2Y}`)

  let foundGearInCommon = false;
  if (p1SurroundingSquares && p2SurroundingSquares) {
    p1SurroundingSquares.forEach((p1) => {
      if (p1) {
        p2SurroundingSquares.forEach((p2) => {
          if (p2 && p1.x === p2.x && p1.y === p2.y) {
            if (isAsteriskSymbol(getSquareOfGrid(p1.x, p1.y, grid))) {
              foundGearInCommon = true
            }
          }
        })
      }
    })
  }
  return foundGearInCommon;  
}


const processPart1 = () => {
  //const BUFFER = ".123..456.\n..?.......\n.......?..";
  const BUFFER = bufferFile('./input.txt');
  const grid = makeGridFromInput(BUFFER);
  const groupedNumbers = groupNumbers(grid);
  const partNumbers = groupedNumbers.filter(g => isPartNumber(g, grid));
  let sum = 0;
  partNumbers.forEach(ppn => sum += ppn.number)
  console.log(sum)
}

const processPart2 = () => {
  //const BUFFER = ".123..456.\n..*.......\n.10.....?..";
  const BUFFER = bufferFile('./input.txt');
  const grid = makeGridFromInput(BUFFER);
  const groupedNumbers = groupNumbers(grid);
  const partNumbers = groupedNumbers.filter(g => isPartNumber(g, grid));
  const potentialGears = partNumbers.filter(g => isGear(g, grid));
  const gearRatioPairs: Map<string, GearRatioPair> = new Map()
  potentialGears.forEach(p1 => {
    potentialGears.forEach(p2 => {
      if (!_.isEqual(p1, p2)) {
        if (isGearRatio(p1, p2, grid)) {
          const key1 = [p1.minX,p1.maxX,p1.y,p2.minX,p2.maxX,p2.y].join("-")
          const key2 = [p2.minX,p2.maxX,p2.y,p1.minX,p1.maxX,p1.y].join("-")
          if (!gearRatioPairs.has(key1) && !gearRatioPairs.has(key2)) {
            gearRatioPairs.set(key1,{p1, p2})
          }
        }
      }
    })
  })
  console.log(gearRatioPairs);
  console.log(Array.from(gearRatioPairs.values()).map((grp) => grp.p1.number * grp.p2.number).reduce((sum:number, cur:number) => sum+cur, 0))
}

processPart2()