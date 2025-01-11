import fs from 'fs'
import { makeGridOfSize, printGrid, reprintGrid } from '../utils/grid'
var Jetty = require("jetty");
import { sleep } from "../utils/utils"
import { IntCode } from '../utils/intcode';

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(',').map(Number)

const intCode = IntCode()
intCode.setProgram(program)
await intCode.process()

const output = intCode.getOutput()
fs.writeFileSync('./output.js.txt', JSON.stringify(output))
// console.log(output)

interface ScreenElem {
    x:number
    y:number
    id:number
}

const screen:Map<string,ScreenElem> = new Map()
let parsed = 0;
let minX = 0, maxX = 0, minY = 0, maxY = 0
while (output.length) {
    const x = output.shift()!
    const y = output.shift()!
    const id = output.shift()!
    screen.set(`${x},${y}`,{x,y,id})
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
}

// console.log(maxX,maxY)

const grid = makeGridOfSize(maxX+1, maxY+1, (x,y,v) => ({x,y,val:'.'}))

const blocks:string[] = []
screen.forEach((a,b) => {
    if (a.id === 2) {
        blocks.push(b)
    }
    const l = {x:b.split(',')[0],y:b.split(',')[1]}
    console.log(`Adding ${b} to ${l.x},${l.y}`)
    grid.rows[l.y].cells[l.x].val = `${a.id}`
})

printGrid(grid)

console.log(blocks.length)
