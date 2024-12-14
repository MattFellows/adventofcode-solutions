import fs from 'fs'
import { Location } from '../utils/grid'

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
    console.log(xStr,yStr)
    return {dx:Number(xStr),dy:Number(yStr)}
}

const makeLocationFromString = (str:string):Location => {
    const xStr = /Prize: X=([0-9]+),.*/.exec(str)?.[1]
    const yStr = /Prize: X=[0-9]+, Y=([0-9]+).*/.exec(str)?.[1]
    console.log(xStr,yStr)
    return {x:Number(xStr),y:Number(yStr)}
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

const findEfficientButtonRoute = (machine:Machine):number[] => {
    let mostBs = {a:0,b:0};
    for (let i = 0; i < 100; i++) {
        if (isMultipleDeltasAway(machine.prize, {x:i*machine.b.dx,y:i*machine.b.dy}, machine.a)) {
            if (i > mostBs.b) {
                mostBs = {a:countDeltasAway(machine.prize, {x:i*machine.b.dx,y:i*machine.b.dy}, machine.a),b:i}
            }
        }
    }
    return [mostBs.a, mostBs.b]
}

console.log(machinesStr.map(makeMachineFromString).map(findEfficientButtonRoute).map(b => 3*b[0] + b[1]).reduce((p,c) => p+c))


