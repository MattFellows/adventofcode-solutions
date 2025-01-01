import fs from 'fs'
import { Cell, Dir, Grid, getAheadCell, getBehindCell, getByValue, getLeftCell, getRightCell, makeGrid, makeGridOfSize, printGrid, rotateACW, rotateCW } from '../utils/grid'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

interface CostedCell {
    x:number
    y:number
    val:string
    cheapestCost:number
    previousCell?:CostedCell
    dir:Dir
}

let maze = makeGridOfSize(71,71, (x,y,val) =>({x,y,val:'.',cheapestCost:Number.POSITIVE_INFINITY,dir:Dir.EAST}))
printGrid(maze)

const processLine = (line:string):void => {
    const x = Number(line.split(",")[0])
    const y = Number(line.split(",")[1])
    // console.log(`Dropping ${x},${y}`)
    maze.rows[y].cells[x].val = '#'
}

lines.slice(0,1024).forEach(processLine)
printGrid(maze)

let start = maze.rows[0].cells[0] as CostedCell
let end = maze.rows[maze.rows.length-1].cells[maze.rows[maze.rows.length-1].cells.length-1] as CostedCell
console.log(`${start.x},${start.y} -> ${end.x},${end.y}`)

start.cheapestCost = 0

const isEmptyCell = (c:CostedCell) => {
    return c.val === '.' || c.val === 'E'
}

const print = (c:CostedCell,p:string):void => {
    // console.log(`${p}: (${c.x},${c.y}) Heading: ${c.dir}: Cost: ${c.cheapestCost}`)
}

const processQueue = (q:CostedCell[]) => {
    const firstInQueue = q.pop()
    if (firstInQueue) {
        const cellAhead = getAheadCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        const cellLeft = getLeftCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        const cellRight = getRightCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        if (cellAhead && isEmptyCell(cellAhead) && (!cellAhead.cheapestCost || firstInQueue.cheapestCost + 1 < cellAhead.cheapestCost)) {
            cellAhead.cheapestCost = firstInQueue.cheapestCost + 1
            cellAhead.dir = firstInQueue.dir
            // if (cellAhead.x !== end.x || cellAhead.y !== end.y) {
                print(cellAhead, 'Ahead')
                q[q.length] = cellAhead
            // }
        } 
        if (cellLeft && isEmptyCell(cellLeft) && (!cellLeft.cheapestCost || firstInQueue.cheapestCost + 1 < cellLeft.cheapestCost)) {
            cellLeft.cheapestCost = firstInQueue.cheapestCost + 1
            cellLeft.dir = rotateACW(firstInQueue.dir)
            // if (cellLeft.x !== end.x || cellLeft.y !== end.y) {
                print(cellLeft, 'Left')
                q[q.length] = cellLeft
            // }
        } 
        if (cellRight && isEmptyCell(cellRight) && (!cellRight.cheapestCost || firstInQueue.cheapestCost + 1 < cellRight.cheapestCost)) {
            cellRight.cheapestCost = firstInQueue.cheapestCost + 1
            cellRight.dir = rotateCW(firstInQueue.dir)
            // if (cellRight.x !== end.x || cellRight.y !== end.y) {
                print(cellRight, 'Right')
                q[q.length] = cellRight
            // }
        }
    }
}


const queue = [start]
while (queue.length) {
    processQueue(queue)
}

// printGrid(maze, ",", c => `${(c as CostedCell).cheapestCost}`.padStart(8,' '))

console.log(end.cheapestCost)

const remainingLines = lines.slice(1024)
for (let i = 0; i < remainingLines.length; i++) {
    maze = makeGridOfSize(71,71, (x,y,val) =>({x,y,val:'.',cheapestCost:Number.POSITIVE_INFINITY,dir:Dir.EAST}))
    start = maze.rows[0].cells[0] as CostedCell
    end = maze.rows[maze.rows.length-1].cells[maze.rows[maze.rows.length-1].cells.length-1] as CostedCell
    start.cheapestCost = 0

    for (let j = 0; j <= 1024 + i; j++) {
        processLine(lines[j])
    }

    const queue = [start]
    while (queue.length) {
        processQueue(queue)
    }
    console.log(end.cheapestCost)
    if (end.cheapestCost === Number.POSITIVE_INFINITY) {
        console.log(i, lines[1024+i])
        i = Number.POSITIVE_INFINITY
    }
}