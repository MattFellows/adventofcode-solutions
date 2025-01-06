import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

const allNetworks:Map<string,string[]> = new Map()
lines.forEach(l => {
    const split = l.split('-')
    const A = split[0]
    const B = split[1]
    if (allNetworks.has(A)) {
        allNetworks.get(A)!.push(B)
    } else {
        allNetworks.set(A, [B])
    }
    if (allNetworks.has(B)) {
        allNetworks.get(B)!.push(A)
    } else {
        allNetworks.set(B, [A])
    }
})

const makeGroupsOf3 = (n:Map<string,string[]>):Set<string> => {
    const groupsOf3:Set<string> = new Set()
    for (let [key, val] of n) {
        val.forEach(va => {
            n.get(va)?.forEach(v => {
                if (n.get(v)?.includes(key)) {
                    groupsOf3.add([key, va, v].sort().join(','))
                }
            })
        })
    }
    return groupsOf3
}

const groups = [...makeGroupsOf3(allNetworks).values()].sort((a,b) => a.split(',')[0].localeCompare(b.split(',')[0]))

console.log(groups.filter(a => a.split(',').filter(s => s.startsWith('t')).length).length)