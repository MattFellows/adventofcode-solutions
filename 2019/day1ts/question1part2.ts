import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => Number(l.trim()))

const fuelRequirements = (m:number):number => {
    let additionalFuel = Math.floor(m/3) - 2
    // console.log(m,additionalFuel)
    if (additionalFuel > 0) {
        additionalFuel += fuelRequirements(additionalFuel)
    }
    return additionalFuel < 0 ? 0 : additionalFuel
}

console.log(lines.map(l => {const r = fuelRequirements(l); console.log(l, r); return r}).reduce((p,c) => p+c))


