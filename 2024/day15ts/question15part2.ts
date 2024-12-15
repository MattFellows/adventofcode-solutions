import fs from 'fs'
import { Cell, Dir, Grid, getAheadCell, getBehindCell, makeGrid, printGrid } from '../utils/grid'

const input = fs.readFileSync('./input-small.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const gridStr = lines.filter(l => l.startsWith('#'))
const instructions = lines.filter(l => !l.startsWith('#'))
const grid = makeGrid<string>(gridStr.join("\n"))

let botLocationCell:Cell<string> = grid.rows.filter(r => r.cells.map(c => c.val).includes('@')).map(r => {
    return r.cells[r.cells.map(c => c.val).indexOf('@')]
})[0]

const processInstruction = (g:Grid<string>, i:string):Grid<string> => {
    console.log(`Instruction: ${i} Bot Location ${botLocationCell.x},${botLocationCell.y}`)
    const dir = i === '^' ? Dir.NORTH : i === '>' ? Dir.EAST : i === 'v' ? Dir.SOUTH : Dir.WEST
    console.log('Dir: ', dir)
    let cellAhead = getAheadCell(dir, g, botLocationCell.y, botLocationCell.x)
    let moves = 0
    while (cellAhead && cellAhead.val !== '.' && cellAhead.val !== '#') {
        console.log(`${cellAhead.x}${cellAhead.y} (${cellAhead.val})`)
        moves++
        cellAhead = getAheadCell(dir, g, cellAhead.y, cellAhead.x)
    }
    if (cellAhead && cellAhead.val === '.') {
        console.log(`Found empty: Moving ${moves} boxes`)
        let cellBehind = getBehindCell(dir, g, cellAhead.y, cellAhead.x)
        while (moves >= 0) {
            // printGrid(g)
            console.log('Moving ', cellBehind.val)
            cellAhead = getAheadCell(dir, g, cellBehind.y, cellBehind.x)
            cellAhead.val = cellBehind.val
            cellBehind = getBehindCell(dir, g, cellBehind.y, cellBehind.x)
            moves--
        }
        cellAhead = getAheadCell(dir, g, cellBehind.y, cellBehind.x)
        cellAhead.val = cellBehind.val
        botLocationCell = getAheadCell(dir, g, cellAhead.y, cellAhead.x)
        getBehindCell(dir, g, botLocationCell.y, botLocationCell.x).val = '.'
        console.log(`New Bot Location ${botLocationCell.x},${botLocationCell.y}`)

    }
    return g
}

// let after = processInstruction(grid,instructions[1].split('')[0])
// printGrid(after)
// after = processInstruction(grid,instructions[1].split('')[1])
// printGrid(after)


let newGrid = grid
instructions.forEach(il => il.split('').forEach(i => newGrid = processInstruction(newGrid,i)))

console.log('')
printGrid(newGrid)

const calculateScore = (g:Grid<string>):number => {
    let rowScores = g.rows.map(r => r.cells.filter(c => c.val === 'O').map(c => (100*c.y) + c.x))
    console.log(rowScores) 
    return rowScores.filter(r => r.length > 0).map(r => r.reduce((p,c) => p+c)).reduce((p,c) => p+c)
}

console.log(calculateScore(newGrid))