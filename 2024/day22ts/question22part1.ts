import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

const mix = (n1:number, n2:number):number => {
    return n1 ^ n2
}

const prune = (n1:number):number => {
    return ((n1 % 16777216) + 16777216) % 16777216
}

const nextTimes64 = (n1:number):number => {
    return prune(mix(n1 << 6, n1))
}

const nextDivied32 = (n1:number):number => {
    return prune(mix(n1 >> 5, n1))
}

const nextTimes2048 = (n1:number):number => {
    return prune(mix(n1 << 11, n1))
}

const next = (n1:number):number => {
    return nextTimes2048(nextDivied32(nextTimes64(n1)))
}

console.log(mix(15, 42), 37)
console.log(prune(100000000), 16113920)
console.log(next(123), 15887950)
console.log(next(next(123)), 16495136)


console.log(lines.map(l => {
    const start = Number(l)
    let current = start
    for (let i = 0; i < 2000; i++) {
        current = next(current)
    }
    console.log(`${start}: ${current}`)
    return current
}).reduce((p,c) => p+c))