import fs from 'fs'
import path from 'path'

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


const splitWriteProcessWrite = async (stones:number[], i:number, splits:number):Promise<void> => {
    const sizeOfSection = Math.floor(stones.length / splits)
    // console.log(`${sizeOfSection}/${stones.length}`)
    for (let sub = 0; sub < splits; sub++) {
        // console.log(`Spliceing(${sub * sizeOfSection}, ${(sub+1) <= splits ? (sub+1) * sizeOfSection : undefined})`)
        let stonesSection = stones.slice(sub * sizeOfSection, (sub+1) <= splits ? (sub+1) * sizeOfSection : undefined)
        stonesSection = processTones(stonesSection)
        // console.log(`Writing ${i}, ${sub} ${splits}`, stonesSection)
        await fs.writeFileSync(`stones${i}--${sub}.tmp`, stonesSection.join(" "))
    }
}


await splitWriteProcessWrite(stones, 0, 1)
let tmpInput = fs.readFileSync(`stones0--0.tmp`).toString()
stones = tmpInput.split(" ").map(Number)

for (let i = 1; i < 30; i++) {
    await splitWriteProcessWrite(stones, i, 1)
    await fs.rmSync(`stones${i-1}--0.tmp`)
    tmpInput = fs.readFileSync(`stones${i}--0.tmp`).toString()
    stones = tmpInput.split(" ").map(Number)
}

await splitWriteProcessWrite(stones, 30, 1000)

for (let j = 30; j < 75; j++) {
    console.log(j, cache.size)
    for (let sub = 0; sub < 1000; sub++) {
        tmpInput = fs.readFileSync(`stones${j}--${sub}.tmp`).toString()
        stones = processTones(tmpInput.split(" ").map(Number))
        await fs.writeFileSync(`stones${j+1}--${sub}.tmp`, stones.join(" "))
        await fs.rmSync(`stones${j}--${sub}.tmp`)
    }
}

let total = 0
for (let sub = 0; sub < 100; sub++) {
    tmpInput = fs.readFileSync(`stones75--${sub}.tmp`).toString()
    stones = tmpInput.split(" ").map(Number)
    total += stones.length
}
console.log(total)

