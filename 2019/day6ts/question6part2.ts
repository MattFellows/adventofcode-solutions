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

const me = planets.get('YOU')!
const santa = planets.get('SAN')!

const myPlanet = me.directOrbit!
const santasPlanet = santa.directOrbit!
let santasRouteToCOM:Planet[] = []
let cur:Planet = santasPlanet
while (cur.name !== 'COM') {
    santasRouteToCOM.push(cur)
    cur = cur.directOrbit!
}

// console.log('S')
// console.log(santasRouteToCOM)
// console.log('S')

let myRouteToSanta:Planet[] = []
cur = myPlanet
while (cur.name !== 'COM' && !santasRouteToCOM.includes(cur)) {
    myRouteToSanta.push(cur)
    cur = cur.directOrbit!
}
// console.log()
// console.log(myRouteToSanta)
// console.log()
if (santasRouteToCOM.includes(cur)) {
    let santaStart = santasPlanet
    while (santaStart !== cur) {
        myRouteToSanta.push(santaStart)
        santaStart = santaStart.directOrbit! 
    }
}

console.log(myRouteToSanta.length)