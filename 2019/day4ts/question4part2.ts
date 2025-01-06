import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
let minStr = Number(input.split('-')[0].trim())
let maxStr = Number(input.split('-')[1].trim())


const isIncreasingDigits = (n:string):boolean => {
    let allIncreasing = true
    for (let i = 1; i < n.length; i++) {
        allIncreasing = allIncreasing && (Number(n[i]) >= Number(n[i-1]))
    }
    return allIncreasing
}

const noMoreThat2SameDigit = (n:string):boolean => {
    const frequency = new Map<string, number>()
    n.split('').forEach(d => {
        frequency.set(d, frequency.has(d) ? (frequency.get(d) || 0) + 1 : 1)
    })
    return [...frequency.values()].includes(2)
}

let countMatches = 0
for (let i = minStr; i < maxStr; i++) {
    if (i > minStr && i < maxStr
        && `${i}`.length === 6
        && `${i}`.match(/11|22|33|44|55|66|77|88|99|00/)
        && isIncreasingDigits(`${i}`)
        && noMoreThat2SameDigit(`${i}`)
    ) {
        countMatches++
    }
}

console.log(countMatches)