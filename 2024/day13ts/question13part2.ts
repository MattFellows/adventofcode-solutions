import fs from 'fs'
import { Location } from '../utils/grid'
import { solveSimultaneous2 } from '../utils/maths'

const input = fs.readFileSync('./input.txt').toString()
const machinesStr = input.split("\n").map(l => l.trim()).join("::").split("::::").map(l => l.trim())

interface Button {
    dx:number
    dy:number
}

interface Machine {
    a:Button,
    b:Button,
    prize:Location
}

const makeButtonFromString = (str:string):Button => {
    const xStr = /Button [AB]: X\+([0-9]+),.*/.exec(str)?.[1]
    const yStr = /Button [AB]: X\+[0-9]+, Y\+([0-9]+).*/.exec(str)?.[1]
    // console.log(xStr,yStr)
    return {dx:Number(xStr),dy:Number(yStr)}
}

const BIGNUM = 10000000000000

const makeLocationFromString = (str:string):Location => {
    const xStr = /Prize: X=([0-9]+),.*/.exec(str)?.[1]
    const yStr = /Prize: X=[0-9]+, Y=([0-9]+).*/.exec(str)?.[1]
    // console.log(xStr,yStr)
    return {x:Number(xStr)+10000000000000,y:Number(yStr)+10000000000000}
}

const makeMachineFromString = (str:string):Machine => {
    const parts = str.split("::")

    let a, b, prize
    parts.forEach(p => {
        if (p.indexOf("Button A") > -1) {
            a = makeButtonFromString(p)
        }
        if (p.indexOf("Button B") > -1) {
            b = makeButtonFromString(p)
        }
        if (p.indexOf("Prize") > -1) {
            prize = makeLocationFromString(p)
        }

    })
    return {a,b,prize}
}

const isMultipleDeltasAway = (prize:Location, currentLocation:Location, button:Button):boolean => {
    return (prize.x - currentLocation.x) % button.dx === 0 
    && (prize.y - currentLocation.y) % button.dy === 0 
    && (prize.x - currentLocation.x) / button.dx === (prize.y - currentLocation.y) / button.dy
}

const countDeltasAway = (prize:Location, currentLocation:Location, button:Button):number => {
    return (prize.x - currentLocation.x) / button.dx
}

const solveSimultaneous = (machine:Machine):number => {
    // ((X * a.x) + (Y * b.x)) - prize.x = 0
    // ((X * a.y) + (Y * b.y)) - prize.y = 0
    const solution = solveSimultaneous2([[machine.a.dx,machine.b.dx,machine.prize.x],[machine.a.dy,machine.b.dy,machine.prize.y]])
    if (solution[0] === Math.ceil(solution[0]) && solution[1] === Math.ceil(solution[1])) {
        return 3*solution[0] + solution[1]
    }
    return 0
}

// console.log(machinesStr.map(makeMachineFromString).map(solveSimultaneous))
console.log(machinesStr.map(makeMachineFromString).map(solveSimultaneous).reduce((p,c) => p+c))


