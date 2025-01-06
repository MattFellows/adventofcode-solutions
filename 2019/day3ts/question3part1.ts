import fs from 'fs'
import { Cell, makeGridOfSize, printGrid } from '../../2024/utils/grid'
import { Serialisable } from '../../2024/utils/log'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

const maxXAndY = [0,0]
const minXAndY = [0,0]
lines.forEach(l => {
    let currentXAndY = [0,0]
    l.split(',').forEach(vector => {
    
    if (vector.startsWith('U')) {
        currentXAndY[1] += parseInt(vector.substring(1), 10)
    }
    if (vector.startsWith('D')) {
        currentXAndY[1] -= parseInt(vector.substring(1), 10)
    }
    if (vector.startsWith('L')) {
        currentXAndY[0] -= parseInt(vector.substring(1), 10)
    }
    if (vector.startsWith('R')) {
        currentXAndY[0] += parseInt(vector.substring(1), 10)
    }

    maxXAndY[0] = Math.max(maxXAndY[0], currentXAndY[0])
    maxXAndY[1] = Math.max(maxXAndY[1], currentXAndY[1])
    minXAndY[0] = Math.min(minXAndY[0], currentXAndY[0])
    minXAndY[1] = Math.min(minXAndY[1], currentXAndY[1])
    // console.log(minXAndY)
})})

console.log(maxXAndY)
console.log(minXAndY)
const xSize = maxXAndY[0] - minXAndY[0] + 1
const ySize = maxXAndY[1] - minXAndY[1] + 1
console.log(xSize, ySize)
const grid = makeGridOfSize(xSize+1, ySize+1, (x,y,v) => ({x,y,val:'.'}))
printGrid(grid)
const startY = grid.rows.length - Math.abs(minXAndY[1]) - 1
const startX = Math.abs(minXAndY[0])
console.log(startX, startY)
const start = grid.rows[startY].cells[startX]
start.val = 'O'

// printGrid(grid)

const crossovers:Cell<Serialisable>[] = []

lines.forEach((l,id) => {
    let current = start
    l.split(',').forEach(vector => {
    let destination;
    let magnitude = parseInt(vector.substring(1), 10)
    if (vector.startsWith('U')) {
        console.log(`Moving Up ${magnitude} from ${current.x}, ${current.y}`)
        for (let i = 1; i <= magnitude; i++) {
            destination = grid.rows[current.y - i].cells[current.x]
            if (destination.val !== '.' && destination.val !== '*' && destination.val !== `${id}`) {
                destination.val = '*'
                crossovers.push(destination)
                console.log(`Adding: ${destination.x},${destination.y}`)
            } else if (destination.val === '.') {
                destination.val = `${id}`
            }
        }
        current = destination
    }
    if (vector.startsWith('D')) {
        console.log(`Moving Down ${magnitude} from ${current.x}, ${current.y}`)
        for (let i = 1; i <= magnitude; i++) {
            destination = grid.rows[current.y + i].cells[current.x]
            if (destination.val !== '.' && destination.val !== '*' && destination.val !== `${id}`) {
                destination.val = '*'
                crossovers.push(destination)
                console.log(`Adding: ${destination.x},${destination.y}`)
            } else if (destination.val === '.') {
                destination.val = `${id}`
            }
        }
        current = destination
    }
    if (vector.startsWith('L')) {
        console.log(`Moving Left ${magnitude} from ${current.x}, ${current.y}`)
        for (let i = 1; i <= magnitude; i++) {
            destination = grid.rows[current.y].cells[current.x - i]
            if (destination.val !== '.' && destination.val !== '*' && destination.val !== `${id}`) {
                destination.val = '*'
                crossovers.push(destination)
                console.log(`Adding: ${destination.x},${destination.y}`)
            } else if (destination.val === '.') {
                destination.val = `${id}`
            }
        }
        current = destination
    }
    if (vector.startsWith('R')) {
        console.log(`Moving Right ${magnitude} from ${current.x}, ${current.y}`)
        for (let i = 1; i <= magnitude; i++) {
            destination = grid.rows[current.y].cells[current.x + i]
            if (destination.val !== '.' && destination.val !== '*' && destination.val !== `${id}`) {
                destination.val = '*'
                crossovers.push(destination)
                console.log(`Adding: ${destination.x},${destination.y}`)
            } else if (destination.val === '.') {
                destination.val = `${id}`
            }
        }
        current = destination
    }
    // printGrid(grid)
})})

printGrid(grid)

console.log(crossovers.map(c => {
    return ({manhattan: Math.abs(c.x - start.x) + Math.abs(c.y - start.y), x: c.x, y: c.y })
}).sort((m1,m2) => m1.manhattan - m2.manhattan)[0])