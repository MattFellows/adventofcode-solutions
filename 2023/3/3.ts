var fs = require('fs');
var path = require('path');

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
}

const makeGridFromInput = (contents:Buffer|String):Grid => {
  const associativeArrayGrid: [GridSquare[]] = [[]]
  const gridSquares = [] as GridSquare[];
  const lines = contents.toString().split("\n")
  const maxY = lines.length;
  let maxX = 0;
  for (let y = 0; y < 3; y ++) {
    const line = lines[y];
    const lineOfGrid = [] as GridSquare[]
    const chars = line.split("")
    for (let x = 0; x < chars.length; x++) {
      if (x > maxX) {
        maxX = x
      }
      const value = chars[x];
      lineOfGrid.push({x,y,value})
      gridSquares.push({x,y,value});
    }
    associativeArrayGrid.push(lineOfGrid);
  }
  return {gridSquares, associativeArrayGrid, maxX, maxY};
}

const getSquareOfGrid = (x:number, y:number, grid:Grid):GridSquare => {
  return grid.associativeArrayGrid?.[y]?.[x];
}

const isSymbol = (gridSquare:GridSquare):boolean => {
  return gridSquare && !(gridSquare?.value?.match?.(/[\d\.]/));
}

const hasAdjacentSymbol = (gridSquare:GridSquare, grid:Grid):boolean => {
  return  isSymbol(getSquareOfGrid(gridSquare.x, gridSquare.y+1, grid)) ||
          isSymbol(getSquareOfGrid(gridSquare.x, gridSquare.y-1, grid)) ||

          isSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y+1, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y-1, grid)) ||           
          
          isSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y+1, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y-1, grid));
}

const isPartNumber = (gridSquare:GridSquare, grid:Grid):boolean => {
  return Number.isInteger(parseInt(gridSquare.value, 10)) && hasAdjacentSymbol(gridSquare, grid)
}

const groupNumbers = (grid:Grid):PPN[] => {
  const potentialParts = [] as PPN[];
  for (let y = 0; y < grid.maxY; y++) {
    for (let x = 0 ; x < grid.maxX; x++) {
      const sq = grid.associativeArrayGrid[y][x]
      if (sq) {
        let potentialPartNumbers = [] as GridSquare[];
        if (Number.isInteger(parseInt(sq.value, 10))) {
          potentialPartNumbers.push(sq)
          for (let i = 1; i < (grid.maxX - x); i++) {
            let psq = grid.associativeArrayGrid[y][x + i]
            if (Number.isInteger(parseInt(sq.value, 10))) {
              potentialPartNumbers.push(psq)
            } else {
              break
            }
          }
          x = x+potentialPartNumbers.length;
          potentialParts.push({number: parseInt(potentialPartNumbers.map(p=>p.value).join(""), 10), gridSquares: potentialPartNumbers});
        }
      }
    }
  }
  return potentialParts;
}

const processPart1 = () => {
  const BUFFER = ".123.\n..?..\n.....";//bufferFile('./input.txt');
  const grid = makeGridFromInput(BUFFER);
  console.log(grid.associativeArrayGrid)
  const groupedNumbers = groupNumbers(grid);
  console.log(groupedNumbers)
  const partNumbers = grid.gridSquares.filter(g => isPartNumber(g, grid));
    
}

processPart1()