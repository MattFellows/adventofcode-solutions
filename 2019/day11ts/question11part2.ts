import fs from 'fs'
import { Dir, Location, makeGridOfSize, moveDir, printGrid, rotateACW, rotateCW, toPNG } from '../utils/grid'
import { IntCode } from '../utils/intcode'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))

let location:Location = {x:0, y:0}
let dir = Dir.NORTH
const tilesPainted = new Map<string,number>()
tilesPainted.set(`${location.x},${location.y}`, 1)
let painting = true

const intCode = IntCode()
intCode.setProgram(program)

intCode.registerInputRequestHandler(() => {
    // console.log(`Input Requested: ${tilesPainted.get(`${location.x},${location.y}`)}`)
    return tilesPainted.get(`${location.x},${location.y}`) ?? 0
})

intCode.registerOutputHandler((o) => {
    // console.log(`Output: ${o} ${painting ? `Painting: ${o}` : `Turning ${o ? 'CW' : 'ACW'}`}`)
    if (painting) {
        tilesPainted.set(`${location.x},${location.y}`, o)
        // console.log('Painted: ', tilesPainted.size)
    } else {
        if (o === 0) {
            dir = rotateACW(dir)            
        } else if (o === 1) {
            dir = rotateCW(dir)
        }
        location = moveDir(location, dir)
        // console.log('New Location: ', location)
    }
    painting = !painting
})

await intCode.process()
let minX = 0, maxX = 0, minY = 0, maxY = 0
tilesPainted.forEach((c,l) => {
    const loc = l.split(',').map(Number)
    minX = Math.min(loc[0],minX)
    maxX = Math.max(loc[0],maxX)
    minY = Math.min(loc[1],minY)
    maxY = Math.max(loc[1],maxY)
})
console.log(minX, maxX, minY, maxY)

const grid = makeGridOfSize(maxX+1, maxY+1, (x,y,v) => ({x,y,val:0}))
tilesPainted.forEach((c,l) => {
    const loc = l.split(',').map(Number)
    const cell = grid.rows[loc[1]].cells[loc[0]]
    if (!cell) {
        console.log(l)
    }
    cell.val = c
})

toPNG(grid, './output.png')
console.log()
printGrid(grid)
console.log()

