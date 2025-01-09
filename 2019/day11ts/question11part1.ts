import fs from 'fs'
import { Dir, Location, moveDir, rotateACW, rotateCW } from '../utils/grid'
import { IntCode } from '../utils/intcode'

const input = fs.readFileSync('./input.txt').toString()
const program = input.split(",").map(l => Number(l.trim()))

let location:Location = {x:0, y:0}
let dir = Dir.NORTH
const tilesPainted = new Map<string,number>()
let painting = true

const intCode = IntCode()
intCode.setProgram(program)

intCode.registerInputRequestHandler(() => {
    console.log(`Input Requested: ${tilesPainted.get(`${location.x},${location.y}`)}`)
    return tilesPainted.get(`${location.x},${location.y}`) ?? 0
})

intCode.registerOutputHandler((o) => {
    console.log(`Output: ${o} ${painting ? `Painting: ${o}` : `Turning ${o ? 'CW' : 'ACW'}`}`)
    if (painting) {
        tilesPainted.set(`${location.x},${location.y}`, o)
        console.log('Painted: ', tilesPainted.size)
    } else {
        if (o === 0) {
            dir = rotateACW(dir)            
        } else if (o === 1) {
            dir = rotateCW(dir)
        }
        location = moveDir(location, dir)
        console.log('New Location: ', location)
    }
    painting = !painting
})

await intCode.process()
console.log(tilesPainted.size)

