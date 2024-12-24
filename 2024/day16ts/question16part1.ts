import fs from 'fs'
import { Cell, Dir, Grid, getAheadCell, getBehindCell, getByValue, getLeftCell, getRightCell, makeGrid, printGrid, rotateACW, rotateCW } from '../utils/grid'

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

const maze = makeGrid(input, (x,y,val) =>({x,y,val,cheapestCost:Number.POSITIVE_INFINITY,dir:Dir.EAST}))
// printGrid(maze)

const start = getByValue(maze, 'S') as CostedCell
const end = getByValue(maze, 'E') as CostedCell
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
                queue[queue.length] = cellAhead
            // }
        } 
        if (cellLeft && isEmptyCell(cellLeft) && (!cellLeft.cheapestCost || firstInQueue.cheapestCost + 1000 < cellLeft.cheapestCost)) {
            cellLeft.cheapestCost = firstInQueue.cheapestCost + 1001
            cellLeft.dir = rotateACW(firstInQueue.dir)
            // if (cellLeft.x !== end.x || cellLeft.y !== end.y) {
                print(cellLeft, 'Left')
                queue[queue.length] = cellLeft
            // }
        } 
        if (cellRight && isEmptyCell(cellRight) && (!cellRight.cheapestCost || firstInQueue.cheapestCost + 1000 < cellRight.cheapestCost)) {
            cellRight.cheapestCost = firstInQueue.cheapestCost + 1001
            cellRight.dir = rotateCW(firstInQueue.dir)
            // if (cellRight.x !== end.x || cellRight.y !== end.y) {
                print(cellRight, 'Right')
                queue[queue.length] = cellRight
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