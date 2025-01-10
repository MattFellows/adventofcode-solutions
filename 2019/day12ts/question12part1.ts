import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
const planetsStrs = input.split("\n").map(l => l.trim())

interface Planet {
    x:number
    y:number
    z:number

    dx:number
    dy:number
    dz:number

    gIter:number
    pIter:number
}

const planetsStart = planetsStrs.map((s:string):Planet => {
    const coords = s.substring(1, s.length -1).split(',').map(s => s.trim().substring(2)).map(Number)
    return {x:coords[0],y:coords[1],z:coords[2],dx:0,dy:0,dz:0,gIter:0,pIter:0}
})

console.log(planetsStart.map(p => `${p.x},${p.y},${p.z}`))

const applyGravity = (planets:Planet[]) => {
    planets.forEach(p1 => {
        planets.forEach(p2 => {
            if (p1.x < p2.x) {
                p1.dx += 1
            } else if (p1.x > p2.x) {
                p1.dx -= 1
            }
            if (p1.y < p2.y) {
                p1.dy += 1
            } else if (p1.y > p2.y) {
                p1.dy -= 1
            }
            if (p1.z < p2.z) {
                p1.dz += 1
            } else if (p1.z > p2.z) {
                p1.dz -= 1
            }
        })
        p1.gIter += 1
    })
}

const applyVelocity = (planets:Planet[]) => {
    planets.forEach(p1 => {
        p1.x += p1.dx
        p1.y += p1.dy
        p1.z += p1.dz
        p1.pIter += 1
    })
}

const calculateEnergy = (planets:Planet[]):number => {
    return planets.map(p => 
        (Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z)) * (Math.abs(p.dx) + Math.abs(p.dy) + Math.abs(p.dz))
    ).reduce((p,c) => p+c)
}

const current = [...planetsStart]
for (let i = 0; i < 1000; i++) {
    applyGravity(current)
    applyVelocity(current)
}

console.log(calculateEnergy(current))

// applyGravity(current)
// applyVelocity(current)

// console.log(current.map(p => `${p.x},${p.y},${p.z}`))
