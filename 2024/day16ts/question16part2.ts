import fs from 'fs'
import { Cell, Dir, Grid, getAheadCell, getBehindCell, getByMatcher, getByValue, getDir, getLeftCell, getRightCell, makeGrid, printGrid, rotateACW, rotateCW } from '../utils/grid'

const input = fs.readFileSync('./input-small.txt').toString()
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
    console.log(`${p}: (${c.x},${c.y}) Heading: ${c.dir}: Cost: ${c.cheapestCost}`)
}

const processQueue = (q:CostedCell[]) => {
    const firstInQueue = q.pop()
    if (firstInQueue) {
        const cellAhead = getAheadCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        const cellLeft = getLeftCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        const cellRight = getRightCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        if (cellAhead && isEmptyCell(cellAhead) && (!cellAhead.cheapestCost || (firstInQueue.cheapestCost + 1 < cellAhead.cheapestCost))) {
            cellAhead.cheapestCost = firstInQueue.cheapestCost + 1
            cellAhead.dir = firstInQueue.dir
            // if (cellAhead.x !== end.x || cellAhead.y !== end.y) {
                print(cellAhead, 'Ahead')
                q[q.length] = cellAhead
            // }
        } 
        if (cellLeft && isEmptyCell(cellLeft) && (!cellLeft.cheapestCost || (firstInQueue.cheapestCost + 1000 < cellLeft.cheapestCost))) {
            cellLeft.cheapestCost = firstInQueue.cheapestCost + 1001
            cellLeft.dir = rotateACW(firstInQueue.dir)
            // if (cellLeft.x !== end.x || cellLeft.y !== end.y) {
                print(cellLeft, 'Left')
                q[q.length] = cellLeft
            // }
        } 
        if (cellRight && isEmptyCell(cellRight) && (!cellRight.cheapestCost || (firstInQueue.cheapestCost + 1000 < cellRight.cheapestCost))) {
            cellRight.cheapestCost = firstInQueue.cheapestCost + 1001
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

const costPrinter = c => {
    const cc = (c as CostedCell).cheapestCost !== Number.POSITIVE_INFINITY ? `${(c as CostedCell).cheapestCost}` : '.'
    return c.val === '#' ? '#####' : cc.padStart(5,' ')
    }

printGrid(maze, ",", costPrinter)


console.log(end.cheapestCost)

const allPaths:CostedCell[][] = []

const deProcessQueue = (q:[CostedCell,CostedCell[]][]):void => {
    const qPop = q.pop()
    if (qPop) {
        const firstInQueue = qPop[0] 
        let currentPath = qPop[1]
        const previousInQueue = currentPath[currentPath.length-2]
        console.log(`Heading: ${firstInQueue.dir} (${firstInQueue.cheapestCost})`)
        const cellAhead = getAheadCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        const cellLeft = getLeftCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        const cellRight = getRightCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        
        let pathAhead, pathLeft, pathRight = false

        console.log(`${cellAhead.cheapestCost} ?< ${(previousInQueue.cheapestCost)}`)
        if (cellAhead && isEmptyCell(cellAhead) && (cellAhead.cheapestCost < (previousInQueue.cheapestCost))) {
            cellAhead.dir = getDir(cellAhead, firstInQueue)
            currentPath = [...currentPath, cellAhead]
            q[q.length] = [cellAhead, currentPath]
            pathAhead = true
            print(cellAhead, 'A')
        }
        console.log(`${cellLeft.cheapestCost} ?< ${(previousInQueue.cheapestCost)}`)
        if (cellLeft && isEmptyCell(cellLeft) && (cellLeft.cheapestCost < (previousInQueue.cheapestCost))) {
            cellLeft.dir = getDir(cellLeft, firstInQueue)
            currentPath = [...currentPath, cellLeft]
            q[q.length] = [cellLeft, currentPath]
            pathLeft = true
            print(cellLeft, 'L')
        }
        console.log(`${cellRight.cheapestCost} ?< ${(previousInQueue.cheapestCost)}`)
        if (cellRight && isEmptyCell(cellRight) && (cellRight.cheapestCost < (previousInQueue.cheapestCost))) {
            cellRight.dir = getDir(cellRight, firstInQueue)
            currentPath = [...currentPath, cellRight]
            q[q.length] = [cellRight, currentPath]
            pathRight = true
            print(cellRight, 'R')
        }
        if ((Number(pathLeft) + Number(pathRight) + Number(pathAhead)) > 1) {
            console.log('Pushing: ', allPaths.length)
            allPaths.push(currentPath)
        }
        console.log()
    }
}

let q:[CostedCell,CostedCell[]][] = []
let empty:CostedCell[] = []

const previousCell:CostedCell = getByMatcher(maze, (v) => v.cheapestCost === end.cheapestCost-1) as CostedCell

previousCell.dir = getDir(previousCell, end)
q[q.length] = [previousCell, [previousCell, end]]
while (q.length) {
    deProcessQueue(q)
}

console.log(allPaths.length)
