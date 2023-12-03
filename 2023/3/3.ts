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

const makeGridFromInput = (lines:Buffer|String[]):GridSquare[] => {
  const gridSquares = [] as GridSquare[];
  lines.forEach((line, y) => {
    (""+line).split("").forEach((value, x) => {
      gridSquares.push({x,y,value});
    })
  });
  return gridSquares;
}

const getSquareOfGrid = (x:number, y:number, grid:GridSquare[]):GridSquare => {
  return grid.filter(g => g.x === x && g.y === y)?.[0]
}

const isSymbol = (gridSquare:GridSquare):boolean => {
  return (gridSquare?.value?.match?.(/^[0-9\.]/)?.length || 0) > 0;
}

const hasAdjacentSymbol = (gridSquare:GridSquare, grid:GridSquare[]):boolean => {
  return  isSymbol(getSquareOfGrid(gridSquare.x, gridSquare.y+1, grid)) ||
          isSymbol(getSquareOfGrid(gridSquare.x, gridSquare.y-1, grid)) ||

          isSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y+1, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x+1, gridSquare.y-1, grid)) ||           
          
          isSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y+1, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y, grid)) || 
          isSymbol(getSquareOfGrid(gridSquare.x-1, gridSquare.y-1, grid));
}

const isPartNumber = (gridSquare:GridSquare, grid:GridSquare[]):boolean => {
  return Number.isInteger(parseInt(gridSquare.value, 10)) && hasAdjacentSymbol(gridSquare, grid)
}

const processPart1 = () => {
  const BUFFER = bufferFile('./input.txt');
  const gridSquares = makeGridFromInput(BUFFER);
  const partNumbers = gridSquares.filter(g => isPartNumber(g, gridSquares))
  console.log(partNumbers)
}

processPart1()