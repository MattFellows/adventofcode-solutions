import fs from 'fs'

const input = fs.readFileSync('./input-small.txt').toString()
let stones = input.split(" ").map(Number)

const processTones = (stones:number[]):number[] => {
    const newStones:(number|number[])[] = []
    for (let i = 0; i < stones.length; i++) {
        if (stones[i] === 0) {
            newStones[i] = 1
        } else if (`${stones[i]}`.length % 2 === 0) {
            const numAsStr = `${stones[i]}`
            // console.log(numAsStr, numAsStr.substring(0, numAsStr.length / 2), numAsStr.substring(numAsStr.length / 2))
            const left = (numAsStr.substring(0, numAsStr.length / 2))
            const right = (numAsStr.substring(numAsStr.length / 2))
            // console.log(left, right)
            newStones[i] = [Number(left), Number(right)]
        } else {
            newStones[i] = stones[i]*2024
        }
    }
    // console.log(newStones)
    // console.log(newStones.flat())
    return newStones.flat()
}


console.log(stones)
for (let i = 0; i < 25; i++) {
    console.log(i, stones.length)
    stones = processTones(stones)
}

console.log(stones.length)