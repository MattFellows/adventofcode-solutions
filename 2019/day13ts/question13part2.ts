import fs from 'fs'
import logUpdate from 'log-update'
import { getByValue, makeGridOfSize, printGrid, reprintGrid } from '../utils/grid'
import { sleep } from "../utils/utils"
import { IntCode } from '../utils/intcode';

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(',').map(Number)

const screen:Map<string,ScreenElem> = new Map()
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
    const paddle = getByValue(grid, '3') ?? getByValue(grid, '_')
    const ball = getByValue(grid, '4') ?? getByValue(grid, 'o')
    if (!paddle || !ball) {
        return 0
    }if (paddle.x > ball.x) {
        return -1
    } else if (paddle.x < ball.x) {
        return 1
    } 
    return 0
})

let score = 0;

intCode.registerOutputHandler((o) => {
    // console.log('output: ', o, outputBuffer)
    if (outputBuffer.length === 2) {
        const x = outputBuffer.shift()!
        const y = outputBuffer.shift()!
        const id = o
        if (x === -1) {
            // console.log(o)
            score = o
        }
        else { 
            screen.set(`${x},${y}`,{x,y,id})
        }
        if (id === 4) {
            screen.forEach((a,b) => {
                const l = {x:b.split(',')[0],y:b.split(',')[1]}
                grid.rows[l.y].cells[l.x].val = `${a.id === 0 ? ' ' : a.id === 3 ? '_' : a.id === 4 ? 'o' : a.id === 2 ? '#' : a.id}`
            })
            reprintGrid(grid)
        }
    } else {
        outputBuffer.push(o)
    }
})
await intCode.process()
console.log(`${score}`)
