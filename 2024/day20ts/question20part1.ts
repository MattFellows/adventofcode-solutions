import fs from 'fs'
import { Cell, Dir, Grid, getAheadCell, getBehindCell, getByMatcher, getByValue, getLeftCell, getRightCell, makeGrid, makeGridOfSize, printGrid, rotateACW, rotateCW } from '../utils/grid'

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

interface Cheat {
    start: CostedCell
    one: CostedCell
    two: CostedCell
    saving: number
}

const maze = makeGrid(input, (x,y,val) =>({x,y,val,cheapestCost:Number.POSITIVE_INFINITY,dir:Dir.EAST}))
printGrid(maze)

const start = getByValue(maze, 'S') as CostedCell
const end = getByValue(maze, 'E') as CostedCell
start.val = '.'
end.val = '.'
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
            print(cellAhead, 'Ahead')
            queue[queue.length] = cellAhead
        } 
        if (cellLeft && isEmptyCell(cellLeft) && (!cellLeft.cheapestCost || firstInQueue.cheapestCost + 1 < cellLeft.cheapestCost)) {
            cellLeft.cheapestCost = firstInQueue.cheapestCost + 1
            cellLeft.dir = rotateACW(firstInQueue.dir)
            print(cellLeft, 'Left')
            queue[queue.length] = cellLeft
        } 
        if (cellRight && isEmptyCell(cellRight) && (!cellRight.cheapestCost || firstInQueue.cheapestCost + 1 < cellRight.cheapestCost)) {
            cellRight.cheapestCost = firstInQueue.cheapestCost + 1
            cellRight.dir = rotateCW(firstInQueue.dir)
            print(cellRight, 'Right')
            queue[queue.length] = cellRight
        }
    }
}

const queue = [start]
while (queue.length) {
    processQueue(queue)
}

console.log(end.cheapestCost)

const cheats:Cheat[] = []

const findCheats = (q:CostedCell[]) => {
    const firstInQueue = q.pop()
    if (firstInQueue) {
        // console.log(`${firstInQueue.x},${firstInQueue.y}`)
        const cellAhead = getAheadCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        const cellLeft = getLeftCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        const cellRight = getRightCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell
        const cellBehind = getBehindCell(firstInQueue.dir, maze, firstInQueue.y, firstInQueue.x) as CostedCell

        const cellAhead2 = getAheadCell(firstInQueue.dir, maze, cellAhead.y, cellAhead.x) as CostedCell
        const cellLeft2 = getLeftCell(firstInQueue.dir, maze, cellLeft.y, cellLeft.x) as CostedCell
        const cellRight2 = getRightCell(firstInQueue.dir, maze, cellRight.y, cellRight.x) as CostedCell
        const cellBehind2 = getBehindCell(firstInQueue.dir, maze, cellBehind.y, cellBehind.x) as CostedCell
        
        // console.log(`A ${cellAhead?.val} -> ${cellAhead2?.val} (${cellAhead2?.cheapestCost} >? ${firstInQueue.cheapestCost})`)

        if (cellAhead?.val === '#' && cellAhead2?.val === '.') {
            if (cellAhead2.cheapestCost > firstInQueue.cheapestCost) {
                cheats.push({start: firstInQueue, one:cellAhead, two:cellAhead2, saving: cellAhead2.cheapestCost-firstInQueue.cheapestCost-2})
            }
        }

        // console.log(`L ${cellLeft?.val} -> ${cellLeft2?.val} (${cellLeft2?.cheapestCost} >? ${firstInQueue.cheapestCost})`)

        if (cellLeft?.val === '#' && cellLeft2?.val === '.') {
            if (cellLeft2.cheapestCost > firstInQueue.cheapestCost) {
                cheats.push({start: firstInQueue, one:cellLeft, two:cellLeft2, saving: cellLeft2.cheapestCost-firstInQueue.cheapestCost-2})
            }
        }

        // console.log(`R ${cellRight?.val} -> ${cellRight2?.val} (${cellRight2?.cheapestCost} >? ${firstInQueue.cheapestCost})`)

        if (cellRight?.val === '#' && cellRight2?.val === '.') {
            if (cellRight2.cheapestCost > firstInQueue.cheapestCost) {
                cheats.push({start: firstInQueue, one:cellRight, two:cellRight2, saving: cellRight2.cheapestCost-firstInQueue.cheapestCost-2})
            }
        }

        // console.log(`B ${cellBehind?.val} -> ${cellBehind2?.val} (${cellBehind2?.cheapestCost} >? ${firstInQueue.cheapestCost})`)

        if (cellBehind?.val === '#' && cellBehind2?.val === '.') {
            if (cellBehind2.cheapestCost > firstInQueue.cheapestCost) {
                cheats.push({start: firstInQueue, one:cellBehind, two:cellBehind2, saving: cellBehind2.cheapestCost-firstInQueue.cheapestCost-2})
            }
        }

        q.push(getByMatcher(maze, (a => (a as CostedCell)?.cheapestCost === firstInQueue?.cheapestCost+1)) as CostedCell)
    }
}
// 
const queueC = [start]
while (queueC.length) {
    findCheats(queueC)
    // console.log(cheats.sort((c1,c2) => c1.saving - c2.saving).map(c => `${c.saving}`))
    // console.log()
}
console.log(cheats.sort((c1,c2) => c1.saving - c2.saving).filter(c => c.saving >= 100).length)