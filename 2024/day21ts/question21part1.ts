import fs from 'fs'
import { Cell, getByValue, makeGrid, printGrid } from '../utils/grid'
import { Serialisable } from '../utils/log'

const input = fs.readFileSync('./input-small.txt').toString()
const lines = input.split("\n").map(l => l.trim())

const numberPadGrid = makeGrid(['789','456','123','#0A'].join('\n'))
const directionPadGrid = makeGrid(['#^A','<v>'].join('\n'))

// printGrid(numberPadGrid)
// printGrid(directionPadGrid)

const hThenV = (start:Cell<Serialisable>, destination:Cell<Serialisable>):string => {
    let directionSet = ''
    if (destination.x > start.x) {
        // console.log(`Adding >: ${destination.x} - ${start.x} ${''.padStart(destination.x - start.x, '>')}`)
        directionSet += ''.padStart(destination.x - start.x, '>')
    } else if (destination.x < start.x) {
        // console.log(`Adding <: ${start.x} - ${destination.x} ${''.padStart(start.x - destination.x, '<')}`)
        directionSet += ''.padStart(start.x - destination.x, '<')
    }

    if (destination.y > start.y) {
        // console.log(`Adding v: ${destination.y} - ${start.y} ${''.padStart(destination.y - start.y, 'v')}`)
        directionSet += ''.padStart(destination.y - start.y, 'v')
    } else if (destination.y < start.y) {
        // console.log(`Adding ^: ${start.y} - ${destination.y} ${''.padStart(start.y - destination.y, '^')}`)
        directionSet += ''.padStart(start.y - destination.y, '^')
    }
    return directionSet
}

const vThenH = (start:Cell<Serialisable>, destination:Cell<Serialisable>):string => {
    let directionSet = ''
    if (destination.y > start.y) {
        // console.log(`Adding v: ${destination.y} - ${start.y} ${''.padStart(destination.y - start.y, 'v')}`)
        directionSet += ''.padStart(destination.y - start.y, 'v')
    } else if (destination.y < start.y) {
        // console.log(`Adding ^: ${start.y} - ${destination.y} ${''.padStart(start.y - destination.y, '^')}`)
        directionSet += ''.padStart(start.y - destination.y, '^')
    }

    if (destination.x > start.x) {
        // console.log(`Adding >: ${destination.x} - ${start.x} ${''.padStart(destination.x - start.x, '>')}`)
        directionSet += ''.padStart(destination.x - start.x, '>')
    } else if (destination.x < start.x) {
        // console.log(`Adding <: ${start.x} - ${destination.x} ${''.padStart(start.x - destination.x, '<')}`)
        directionSet += ''.padStart(start.x - destination.x, '<')
    }
    return directionSet
}

const numberToDirectionSet = (pin:string):string => {
    let directionSet = ''
    let start = getByValue(numberPadGrid, 'A')
    // console.log(start)
    pin.split('').forEach(c => {
        let destination = getByValue(numberPadGrid, c)
        // console.log(`D ${JSON.stringify(destination)}`)
        if (start.y !== 3) {
            directionSet += hThenV(start, destination)
        } else if (start.x !== 0) {
            directionSet += vThenH(start, destination)
        }
        directionSet += 'A'
        // console.log('Result: ', directionSet)
        start = destination
    })
    return directionSet
}

const directionSetToDirectionSet = (directions:string):string => {
    let directionSet = ''
    let start = getByValue(directionPadGrid, 'A')
    directions.split('').forEach(c => {
        let destination = getByValue(directionPadGrid, c)
        if (start.y !== 0) {
            directionSet += hThenV(start, destination)
        } else if (start.x !== 0) {
            directionSet += vThenH(start, destination)
        }
        directionSet += 'A'
        start = destination
    })
    return directionSet
}

// console.log(numberToDirectionSet('029A'))
// console.log(directionSetToDirectionSet(numberToDirectionSet('029A')))
// console.log(directionSetToDirectionSet(directionSetToDirectionSet(numberToDirectionSet('029A'))))


const expectedResults = ['029A: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A',
'980A: <v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A',
'179A: <v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A',
'456A: <v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A',
'379A: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A']

const result = lines.map((l,c) => {
    const myPresses = directionSetToDirectionSet(directionSetToDirectionSet(numberToDirectionSet(l)))
    const expected = expectedResults[c]
    console.log(`${l}: ${myPresses}` === expected)
    console.log(`${l}: ${myPresses}`.length === expected.length)
    return (myPresses.length * parseInt(l, 10))
}).reduce((p,c) => p+c)

console.log(result)