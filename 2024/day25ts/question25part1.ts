import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

const keys:number[][] = []
const locks:number[][] = []

const convertToNums = (o:string[]):number[] => {
    let a = 0,b = 0,c = 0,d = 0,e = 0
    for (let i = 0; i < 7; i++) {
        if (o[i][0] === '#') {
            a += 1
        }
        if (o[i][1] === '#') {
            b += 1
        }
        if (o[i][2] === '#') {
            c += 1
        }
        if (o[i][3] === '#') {
            d += 1
        }
        if (o[i][4] === '#') {
            e += 1
        }
    }
    return [a,b,c,d,e]
}

for (let i = 0; i < lines.length - 6; i = i + 8) {
    
    const obj = lines.slice(i, i+7)
    if (obj[0] === '#####') {
        locks.push(convertToNums(obj))
    }
    if (obj[6] === '#####') {
        keys.push(convertToNums(obj))
    }
}


console.log(locks)
console.log()
console.log(keys)

let countFit = 0
locks.forEach(l => {
    keys.forEach(k => {
        let fits = true
        for (let i = 0; i < 5; i++) {
            fits = fits && (l[i] + k[i] <= 7)
        }
        if (fits) {
            countFit++
        }
    })
})

console.log(countFit)