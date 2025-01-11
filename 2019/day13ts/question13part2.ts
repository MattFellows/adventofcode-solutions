import fs from 'fs'
import { getByValue, makeGridOfSize, printGrid, reprintGrid } from '../utils/grid'
var Jetty = require("jetty");
import { sleep } from "../utils/utils"
import { IntCode } from '../utils/intcode';

const jetty = new Jetty(process.stdout)
// jetty.clear()

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(',').map(Number)
// console.log(output)

interface ScreenElem {
    x:number
    y:number
    id:number
}

const intCode = IntCode()
program[0] = 2
intCode.setProgram(program)

const grid = makeGridOfSize(42, 26, (x,y,v) => ({x,y,val:'.'}))

let outputBuffer:number[] = []

intCode.registerInputRequestHandler (():number => {
    const paddle = getByValue(grid, '3')
    const ball = getByValue(grid, '4')
    if (!paddle || !ball) {
        return 0
    }if (paddle.x > ball.x) {
        return -1
    } else if (paddle.x < ball.x) {
        return 1
    } 
    return 0
})

intCode.registerOutputHandler((o) => {
    // console.log('output: ', o, outputBuffer)
    if (outputBuffer.length === 2) {
        const x = outputBuffer.shift()!
        const y = outputBuffer.shift()!
        const id = o
        if (x === -1) {
            console.log(o)
        }
        else { 
            screen.set(`${x},${y}`,{x,y,id})
            maxX = Math.max(maxX, x)
            maxY = Math.max(maxY, y)
        }
        if (id === 4) {
            screen.forEach((a,b) => {
                const l = {x:b.split(',')[0],y:b.split(',')[1]}
                grid.rows[l.y].cells[l.x].val = `${a.id}`
            })
            // reprintGrid(grid,jetty)
        }
    } else {
        outputBuffer.push(o)
    }
})
intCode.process()

const output = intCode.getOutput()
fs.writeFileSync('./output.js.txt', JSON.stringify(output))

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
