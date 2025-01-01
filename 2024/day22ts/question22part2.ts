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

const lastDigit = (n1:number):number => {
    return n1 % 10
}

// console.log(mix(15, 42), 37)
// console.log(prune(100000000), 16113920)
// console.log(next(123), 15887950)
// console.log(next(next(123)), 16495136)


const differenceMaps:Map<string,number> = new Map()

const addDiff = (seq:number[], total:number) => {
    differenceMaps.set(seq.join(','), (differenceMaps.get(seq.join(',')) || 0) + total)
    // if (seq.join(',') === "-2,2,-1,-1" || seq.join(',') === "-2,1,-1,3") {
    //     console.log('Adding: ', seq, total, (differenceMaps.get(seq.join(',')) || 0))
    // }
}

lines.forEach(l => {
    const start = Number(l)
    let totalOnesDigitDiffs:number[] = []
    let current = start
    let added = new Set()
    for (let i = 0; i < 2000; i++) {
        const nextNum = next(current)
        // console.log(current, nextNum)
        totalOnesDigitDiffs.push(lastDigit(nextNum) - lastDigit(current))

        if (i > 3) {
            const last4Diffs = totalOnesDigitDiffs.slice(i-4, i)
            if (!added.has(last4Diffs.join(','))) {
                addDiff(last4Diffs, lastDigit(current))
                added.add(last4Diffs.join(','))
            }
        }

        current = nextNum
    }
})

// console.log(differenceMaps.get([4, -9, 5, 4].join(',')))
// console.log(differenceMaps.get([-2,1,-1,3].join(',')))

const sortedEntries = [...differenceMaps.entries()].sort((a,b) => b[1] - a[1])
console.log(sortedEntries[0])
console.log(differenceMaps.get(sortedEntries[0][0]))
