import fs from 'fs'
import { machine } from 'os'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const possibleCombinators = lines[0].split(',').map(s => s.trim()).sort((s1,s2) => s2.length - s1.length)

const desiredCombinations = lines.slice(2)

const cache = new Map<string,string[]>()

const findComb2 = (wanted:string, depth:number):string[] => {
    let cached = cache.get(wanted)
    if (cached !== undefined) {
        return cached
    }
    if (depth === 0) console.log(`Finding ${wanted} at depth ${depth}`)
    let matched
    let remainingWanted = wanted
    let matchedCombinators:string[] = []
    for (let i = 0; i < possibleCombinators.length; i++) {
        let cached = cache.get(remainingWanted)
        if (cached !== undefined) {
            return cached
        }
        // console.log(`${i}`)
        const possibleCombinator = possibleCombinators[i];
        if (remainingWanted.startsWith(possibleCombinator)) {
            if (depth === 0) console.log(`${remainingWanted} matched ${possibleCombinator} (${depth}, ${i})`)
            matched = possibleCombinator
            remainingWanted = remainingWanted.substring(possibleCombinator.length)
            
            if (remainingWanted.trim().length) {
                // console.log(`Checking ${remainingWanted} (${depth})`)
                const subMatches = findComb2(remainingWanted, depth+1)
                if (subMatches.length) {
                    if (depth === 0) console.log(`Found submatches: ${subMatches} (${depth})`)
                    matchedCombinators.push(possibleCombinator)
                    subMatches.forEach(p => matchedCombinators.push(p))
                    remainingWanted = ''
                } else {
                    if (depth === 0) console.log(`Ruling out submatches ${remainingWanted} (${depth})`)
                    cache.set(remainingWanted, [])
                    remainingWanted = possibleCombinator + remainingWanted
                }
            } else {
                matchedCombinators.push(possibleCombinator)
                if (depth === 0) console.log(`Returning ${matchedCombinators} from depth ${depth}`)
                return matchedCombinators
            }
        }
    }
    if (depth === 0) console.log(`${wanted} ?== ${matchedCombinators.join("")} (${wanted === matchedCombinators.join("")})`)
    if (wanted === matchedCombinators.join("")) {
        cache.set(wanted, matchedCombinators)
        return matchedCombinators
    }
    if (depth === 0) console.log(`Ruling out ${wanted} (${depth})`)
    cache.set(wanted, [])
    return []
}

let countSuccess = 0
desiredCombinations.forEach(d => {
    const combinations = findComb2(d,0)
    console.log(combinations)
    console.log()
    if (combinations.length) {
        countSuccess++
    }
})

// findComb2(desiredCombinations[desiredCombinations.length-1],0)
console.log(`-------------------------------- ${countSuccess} ------------------------`)