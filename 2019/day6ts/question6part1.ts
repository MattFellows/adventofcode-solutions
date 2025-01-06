import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

interface Planet {
    name:string
    directOrbit?:Planet
    distanceFromCOM?:number
}

const COM:Planet = {name:'COM', distanceFromCOM:0}
const planets:Map<string,Planet> = new Map()
planets.set(COM.name, COM)

let allFound = false
while (!allFound) {
    allFound = true
    lines.forEach(orbit => {
        const inner = orbit.split(')')[0]
        const outer = orbit.split(')')[1]
        if (!planets.has(inner)) {
            allFound = false
            return
        }
        const innerP:Planet = planets.get(inner)!
        const outerP:Planet = planets.get(outer) ?? {name:outer}
    
        outerP.directOrbit = innerP
        outerP.distanceFromCOM = innerP.distanceFromCOM! + 1
        planets.set(outer, outerP)
    })
    console.log(`Looping: ${planets.size}`)
}


console.log([...planets.values()].map(p => p.distanceFromCOM!).reduce((p,c) => p+c))