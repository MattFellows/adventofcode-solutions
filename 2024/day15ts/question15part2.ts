import fs from 'fs'
import { Cell, Dir, Grid, getAheadCell, getBehindCell, getLeftCell, getRightCell, makeGrid, printGrid } from '../utils/grid'

const input = fs.readFileSync('./input-small.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const gridStr = lines.filter(l => l.startsWith('#'))
const instructions = lines.filter(l => !l.startsWith('#'))
const grid = makeGrid<string>(gridStr.join("\n"))

const canMove = (dir:Dir, g:Grid<string>, x:number, y:number, amc:Set<Cell<string>>):boolean => {
    // cons$ole.log(`Can move?`, dir, x, y)
    const currentCell = g.rows[y].cells[x]
    if (currentCell.val === '.') {
        // console.log('Returning True')
        // amc = amc.add(currentCell)
        return true
    }
    let immediateNeighbor, neighborAhead
    let hasNeighbor = false
    if (dir === Dir.NORTH || dir === Dir.SOUTH) {
        if (currentCell.val === '[') {
            immediateNeighbor = dir === Dir.NORTH ? g.rows[y].cells[x+1] : g.rows[y].cells[x-1]
            hasNeighbor = true
        } else if (currentCell.val === ']') {
            immediateNeighbor = dir === Dir.NORTH ? g.rows[y].cells[x-1] : g.rows[y].cells[x+1]
            hasNeighbor = true
        }
    }
    const cellAhead = getAheadCell(dir, g, y, x)
    if (!cellAhead || cellAhead.val === '#') {
        // console.log('Returning False')
        return false
    }
    if (hasNeighbor) {
        neighborAhead = getAheadCell(dir, g, immediateNeighbor.y, immediateNeighbor.x)
    }
    amc = amc.add(currentCell)
    amc = amc.add(cellAhead)
    amc = amc.add(immediateNeighbor)
    amc = amc.add(neighborAhead)
    // console.log(`All Cells: ${hasNeighbor} ${[...amc.values()].filter(a => !!a).map(c => `(${c.x},${c.y})`)}`)
    return (
        cellAhead.val !== '#' && 
        canMove(dir, g, cellAhead.x, cellAhead.y, amc) && 
        (!hasNeighbor || neighborAhead.val !== '#') /* && 
        (!hasNeighbor || canMove(dir, g, immediateNeighbor.x, immediateNeighbor.y, amc)) */
    )
}

const processInstruction = (g:Grid<string>, i:string):Grid<string> => {
    console.log(`Instruction: ${i} Bot Location ${botLocationCell.x},${botLocationCell.y}`)
    const dir = i === '^' ? Dir.NORTH : i === '>' ? Dir.EAST : i === 'v' ? Dir.SOUTH : Dir.WEST
    console.log('Dir: ', dir)
    let cellsToMove = new Set<Cell<string>>()
    cellsToMove.add(botLocationCell)
    let cellAhead = getAheadCell(dir, g, botLocationCell.y, botLocationCell.x)
    let moves = 0
    while (cellAhead && cellAhead.val !== '.' && cellAhead.val !== '#') {
        cellsToMove.add(cellAhead)
        console.log(`${cellAhead.x}${cellAhead.y} (${cellAhead.val})`)
        moves++
        cellAhead = getAheadCell(dir, g, cellAhead.y, cellAhead.x)
    }
    if (cellAhead && cellAhead.val === '.') {
        console.log(`Found empty: Let see if we can move all the boxes for ${moves} moves`)
        const allMovingCells = new Set<Cell<string>>()
        const listOfCanMoves = [...cellsToMove.values()].map(c => canMove(dir, g, c.x, c.y, allMovingCells))
        const canMoveAll = listOfCanMoves.reduce((p,c) => p && c)
        if (canMoveAll) {
            // printGrid(g);
            if (cellsToMove.size > 0) {
                [...cellsToMove.values()].reverse().filter(a => !!a).forEach(c => {
                    const cA = getAheadCell(dir, g, c.y, c.x)
                    if (cA && cA.val != '#') {
                        if (dir === Dir.NORTH || dir === Dir.SOUTH) {
                            let neighbor
                            if (cA.val === '[') {
                                neighbor = dir === Dir.NORTH ? g.rows[cA.y].cells[cA.x+1] : g.rows[cA.y].cells[cA.x-1]
                            } else if (cA.val === ']') {
                                neighbor = dir === Dir.NORTH ? g.rows[cA.y].cells[cA.x-1] : g.rows[cA.y].cells[cA.x+1]
                            }
                            if (neighbor) {
                                neighbor.val = dir === Dir.NORTH ? g.rows[neighbor.y+1].cells[neighbor.x].val : g.rows[neighbor.y-1].cells[neighbor.x].val
                            }
                        }
                        cA.val = c.val
                        console.log(`Moving ${dir} ${c.x},${c.y} to ${cA.x},${cA.y}`)
                    }
                })
                botLocationCell = getAheadCell(dir, g, botLocationCell.y, botLocationCell.x)
            } else {
                botLocationCell = getAheadCell(dir, g, botLocationCell.y, botLocationCell.x)
                botLocationCell.val = '@'
            }
            // printGrid(g);
            getBehindCell(dir, g, botLocationCell.y, botLocationCell.x).val = '.'
            printGrid(g);
            // cellAhead = getAheadCell(dir, g, cellBehind.y, cellBehind.x)
            // cellAhead.val = cellBehind.val
            // botLocationCell = getAheadCell(dir, g, cellAhead.y, cellAhead.x)
            // getBehindCell(dir, g, botLocationCell.y, botLocationCell.x).val = '.'
            console.log(`New Bot Location ${botLocationCell.x},${botLocationCell.y}`)
        }
        

    }
    return g
}

const expandGrid = (g:Grid<string>):Grid<string> => {
    let newGrid = {...g, rows:g.rows.map(r => {
        return {...r, cells: r.cells.flatMap(c => {
            if (c.val === 'O') {
                return [{...c, val:'[', x: c.x*2},{...c, val: ']', x:((c.x)*2)+1}]
            }
            if (c.val === '@') {
                return [{...c, val:'@', x: c.x*2},{...c, val: '.', x: ((c.x)*2)+1}]
            }
            return [{...c, x:c.x*2},{...c, x:((c.x)*2)+1}]
        })}
    })}
    return newGrid
}

printGrid(grid)
let newGrid = expandGrid(grid)



let botLocationCell:Cell<string> = newGrid.rows.filter(r => r.cells.map(c => c.val).includes('@')).map(r => {
    return r.cells[r.cells.map(c => c.val).indexOf('@')]
})[0]
console.log(botLocationCell)
printGrid(newGrid)

// let after = processInstruction(newGrid,instructions[1].split('')[0])
// printGrid(after)
// after = processInstruction(after,instructions[1].split('')[1])
// printGrid(after)


// let newGrid = grid
instructions.forEach(il => il.split('').forEach(i => newGrid = processInstruction(newGrid,i)))

console.log('')
printGrid(newGrid)

const calculateScore = (g:Grid<string>):number => {
    let rowScores = g.rows.map(r => r.cells.filter(c => c.val === 'O').map(c => (100*c.y) + c.x))
    console.log(rowScores) 
    return rowScores.filter(r => r.length > 0).map(r => r.reduce((p,c) => p+c)).reduce((p,c) => p+c)
}

console.log(calculateScore(newGrid))