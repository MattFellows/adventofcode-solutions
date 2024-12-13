import fs from 'fs'

const input = fs.readFileSync('./input-small.txt').toString()
let stones = input.split(" ").map(Number)

const processStone = (stone: number, cache:Map<number,number|number[]>):number|number[] => {
    if (cache.has(stone)) {
        return cache.get(stone)!
    }
    if (stone === 0) {
        cache.set(stone, 1)
        return 1
    } else if (`${stone}`.length % 2 === 0) {
        const numAsStr = `${stone}`
        // console.log(numAsStr, numAsStr.substring(0, numAsStr.length / 2), numAsStr.substring(numAsStr.length / 2))
        const left = (numAsStr.substring(0, numAsStr.length / 2))
        const right = (numAsStr.substring(numAsStr.length / 2))
        // console.log(left, right)
        cache.set(stone, [Number(left), Number(right)])
        return [Number(left), Number(right)]
    } else {
        cache.set(stone,(stone * 2024))
        return stone * 2024
    }
}

const cache = new Map<number,number[]>()

const processTones = (stones:number[]):number[] => {
    const newStones:(number|number[])[] = []
    for (let i = 0; i < stones.length; i++) {
        const stone = stones[i]
        newStones[i] = processStone(stone, cache)
    }
    // console.log(newStones)
    // console.log(newStones.flat())
    return newStones.flat()
}


console.log(stones)
for (let i = 0; i < 75; i++) {
    console.log(i, stones.length)
    stones = processTones(stones)
}

console.log(stones.length)
