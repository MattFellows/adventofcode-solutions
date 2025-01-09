import fs from 'fs'
import {makeGrid, printGrid, getAllByValue, getAllByMatcher, Cell, getByCoords} from '../utils/grid'

const input = fs.readFileSync('./input.txt').toString()

interface Asteroid {
    val:string
    toString:() => string
    manhattanDistance?:number
    maxAsteroidsVisible?:number
}

const grid = makeGrid<Asteroid>(input,(x,y,v) => ({x,y,val:{toString:() => `${v}`,val:v}}))
printGrid(grid)

const myMod = (a:number, b:number):number => {
    return a === 0 ? 0 : a % b
}

const isMultipleV2 = (b:Cell<Asteroid>,a:Cell<Asteroid>):(c:Cell<Asteroid>) => boolean => {
    const vectorAB = [b.x - a.x, b.y - a.y]
    const normalisedxVectorAB = vectorAB[1] !== 0 ? [vectorAB[0] / Math.abs(vectorAB[1]), vectorAB[1] / Math.abs(vectorAB[1])] : [vectorAB[0] / Math.abs(vectorAB[0]), vectorAB[1] / Math.abs(vectorAB[0])]
    // console.log(b.x, b.y, vectorAB, normalisedxVectorAB)
    return (c) => {
        if (c.x === a.x && c.y === a.y) {
            return false
        }
        if (c.x === b.x && c.y === b.y) {
            return false
        }
        const vectorAC = [c.x - a.x, c.y - a.y]
        const normalisedxVectorAC = vectorAC[1] !== 0 ? [vectorAC[0] / Math.abs(vectorAC[1]), vectorAC[1] / Math.abs(vectorAC[1])] : [vectorAC[0] / Math.abs(vectorAC[0]), vectorAC[1] / Math.abs(vectorAC[0])]
        const isFurtherAway = c.val.manhattanDistance! >= b.val.manhattanDistance!
        // console.log(normalisedxVectorAB, normalisedxVectorAC, isFurtherAway, c.x, c.y)
        return normalisedxVectorAB[0] === normalisedxVectorAC[0] && normalisedxVectorAB[1] === normalisedxVectorAC[1] && isFurtherAway
    }
}

const calculateVisibleAsteroids = (origin: Cell<Asteroid>, asteroids: Cell<Asteroid>[]): number => {
    // console.log(`Calculating visible asteroids for: ${origin.x},${origin.y}`)
    for (let i = 0; i < asteroids.length; i++) {
        const aP = asteroids[i]
        const vector = [aP.x - origin.x, aP.y - origin.y]
        aP.val.manhattanDistance = vector[0] + vector[1]
    }
    let sortedAsteroids = asteroids
    .filter(b => !(b.x === origin.x && b.y === origin.y))
    .sort((a1,a2) => a2.val.manhattanDistance! - a1.val.manhattanDistance!)

    // console.log(sortedAsteroids.map(a => `${a.x},${a.y}`))
    let allBlocked:Cell<Asteroid>[] = []
    for (let i = 0; i < sortedAsteroids.length; i++) {
        const b = sortedAsteroids[i]
        const blocked = sortedAsteroids
        .filter(a => !(a.x === b.x && a.y === b.y))
        .filter(a => allBlocked.indexOf(a) === -1)
        .filter(isMultipleV2(b,origin))
        // console.log('Removing: ',blocked.map(bl => `${bl.x},${bl.y}`))
        allBlocked = allBlocked.concat(blocked)
        // console.log(allBlocked)
    }
    allBlocked.forEach(b => {
        const indexOfB = sortedAsteroids.indexOf(b)
        if (indexOfB !== -1) {
            // console.log('Removing asteroid at ', indexOfB, b.x, b.y)
            // console.log(sortedAsteroids.map(a => `${a.x},${a.y}`))
            sortedAsteroids.splice(indexOfB, 1)
            // console.log(sortedAsteroids.map(a => `${a.x},${a.y}`))
        }
    })
    return sortedAsteroids.length
}

const calculateVisibleAsteroidsv2 = (a: Cell<Asteroid>, asteroids: Cell<Asteroid>[]): number => {
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
    const visibleAsteroids = calculateVisibleAsteroidsv2(a, [...asteroids])
    a.val.maxAsteroidsVisible = Math.max(a.val.maxAsteroidsVisible??0, visibleAsteroids)
})
console.log(asteroids.sort((a1,a2) => (a2.val.maxAsteroidsVisible??0) - (a1.val.maxAsteroidsVisible??0)).map(a => `${a.val.maxAsteroidsVisible} (${a.x},${a.y})[${}]`))

