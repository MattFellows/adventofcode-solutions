import fs from 'fs'
import {makeGrid, printGrid, getAllByValue, getAllByMatcher, Cell, getByCoords} from '../utils/grid'

const input = fs.readFileSync('./input-small.txt').toString()

interface Asteroid {
    val:string
    toString:() => string
    manhattanDistance?:number
    crowFliesDistance?:number
    maxAsteroidsVisible?:number
    vectorToReference?:number[]
    angleToReference?:number
}

const grid = makeGrid<Asteroid>(input,(x,y,v) => ({x,y,val:{toString:() => `${v}`,val:v}}))
printGrid(grid)

const calculateVisibleAsteroids = (a: Cell<Asteroid>, asteroids: Cell<Asteroid>[]): number => {
    // console.log(`Calculating visible asteroids for: ${a.x},${a.y}`)
    const vectorSet:Set<string> = new Set()
    asteroids.forEach(b => {
        const vectorAB = [b.x - a.x, b.y - a.y]
        const normalisedxVectorAB = vectorAB[1] !== 0 ? [vectorAB[0] / Math.abs(vectorAB[1]), vectorAB[1] / Math.abs(vectorAB[1])] : [vectorAB[0] / Math.abs(vectorAB[0]), vectorAB[1] / Math.abs(vectorAB[0])]
        vectorSet.add(normalisedxVectorAB.join(','))
    })
    return vectorSet.size - 1

}


const asteroids = getAllByMatcher(grid, (c:Cell<Asteroid>) => c.val.val === '#')

// console.log(calculateVisibleAsteroids(grid.rows[3].cells[4], [...asteroids]))

asteroids.forEach(a => {
    const visibleAsteroids = calculateVisibleAsteroids(a, [...asteroids])
    a.val.maxAsteroidsVisible = Math.max(a.val.maxAsteroidsVisible??0, visibleAsteroids)
})

const bestAseroid = asteroids.sort((a1,a2) => (a2.val.maxAsteroidsVisible??0) - (a1.val.maxAsteroidsVisible??0))[0]
console.log(bestAseroid)

let otherAsteroids = asteroids.filter(a => !(a.x === bestAseroid.x && a.y === bestAseroid.y))
const setOfVectors:Set<string> = new Set()
const mapOfAnglesToAsteroids:Map<number,Cell<Asteroid>[]> = new Map()
otherAsteroids.forEach(b => {
    const vectorAB = [b.x - bestAseroid.x, b.y - bestAseroid.y]
    const normalisedxVectorAB = vectorAB[1] !== 0 ? [vectorAB[0] / Math.abs(vectorAB[1]), vectorAB[1] / Math.abs(vectorAB[1])] : [vectorAB[0] / Math.abs(vectorAB[0]), vectorAB[1] / Math.abs(vectorAB[0])]
    if (vectorAB[0] === 0) {
        normalisedxVectorAB[1] = b.y > bestAseroid.y ? 1 : -1
        normalisedxVectorAB[0] = 0
    }
    if (vectorAB[1] === 0) {
        normalisedxVectorAB[0] = b.x > bestAseroid.x ? 1 : -1
        normalisedxVectorAB[1] = 0
    }
    
    // const normalisedxVectorAB = [vectorAB[0] * b.y / vectorAB[1], b.x * vectorAB[1] / vectorAB[0]]
    setOfVectors.add(normalisedxVectorAB.join(','))
    b.val.crowFliesDistance = Math.sqrt(Math.pow(vectorAB[0],2) + Math.pow(vectorAB[1],2))
    b.val.vectorToReference = normalisedxVectorAB
    b.val.angleToReference = Math.atan2(vectorAB[0], vectorAB[1]); 
    const asteroidsAtAngle = mapOfAnglesToAsteroids.get(b.val.angleToReference) ?? []
    asteroidsAtAngle.push(b)
    mapOfAnglesToAsteroids.set(b.val.angleToReference,asteroidsAtAngle.sort((a,b) => (b.val.crowFliesDistance??0) - (a.val.crowFliesDistance??0)))
    console.log(`Calulated properties of ${b.x},${b.y} (${b.val.crowFliesDistance} ${b.val.angleToReference})`)
})

console.log(`0,-1 => ${Math.atan2(0, -1)}`)
console.log(`1,-1 => ${Math.atan2(1, -1)}`)
console.log(`1,0 => ${Math.atan2(1, 0)}`)
console.log(`1,1 => ${Math.atan2(1,1)}`)
console.log(`0,1 => ${Math.atan2(0,1)}`)
console.log(`-1,1 => ${Math.atan2(-1,1)}`)
console.log(`-1,0 => ${Math.atan2(-1,0)}`)
console.log(`-1,-1 => ${Math.atan2(-1,-1)}`)

// console.log([...mapOfAnglesToAsteroids.values()].sort().reverse())
console.log([ ...mapOfAnglesToAsteroids.keys() ].sort().reverse())

let orderedAsteroids:Cell<Asteroid>[] = []
while (mapOfAnglesToAsteroids.size > 0) {
    const keys = [ ...mapOfAnglesToAsteroids.keys() ].sort().reverse();
    keys.forEach(k => {
        const originalAsteroidsAtAngle = mapOfAnglesToAsteroids.get(k)!.sort((a,b) => (a.val.crowFliesDistance??0) - (b.val.crowFliesDistance??0))
        console.log(`Found ${originalAsteroidsAtAngle.length} asteroids at angle: ${k}(${originalAsteroidsAtAngle.map(a => `${a.x},${a.y} - ${a.val.crowFliesDistance}`)}))`)
        if (originalAsteroidsAtAngle) {
            const newAsteroidToAdd = originalAsteroidsAtAngle.shift()!
            orderedAsteroids.push(newAsteroidToAdd)
            console.log(`Adding ${newAsteroidToAdd.x},${newAsteroidToAdd.y} (${orderedAsteroids.length})`)
            if (originalAsteroidsAtAngle.length > 0) {
                console.log(`Replacing set for angle ${k} with ${originalAsteroidsAtAngle.length} others`)
                mapOfAnglesToAsteroids.set(k, originalAsteroidsAtAngle)
            } else {
                console.log(`Deleting angle: ${k}`)
                mapOfAnglesToAsteroids.delete(k)
            }
        }
    })
}

const outputAsteroids = orderedAsteroids.map((a,i) => `${a?.x},${a?.y} (${a?.val?.angleToReference})`)
console.log(outputAsteroids[0])
console.log(outputAsteroids[1])
console.log(outputAsteroids[2])
console.log(outputAsteroids[9])
console.log(outputAsteroids[19])
console.log(outputAsteroids[49])
console.log(outputAsteroids[99])
console.log(outputAsteroids[198])
console.log(outputAsteroids[199])
console.log(outputAsteroids[200])
console.log(outputAsteroids[298])
