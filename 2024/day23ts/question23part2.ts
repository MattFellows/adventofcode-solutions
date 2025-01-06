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

const makeGroups = (n:Map<string,string[]>):Set<string> => {
    const groups:Set<string> = new Set()
    let count = 0;
    //for (let [key, val] of n) {
        const key = 'bd'
        const val = n.get(key)!
        console.log(`${++count} of ${n.size} (${(count/n.size) * 100}%)`, key, val)
        val.filter(v => v !== key).forEach((va, i2) => {
            // console.log(i2)
            n.get(va)?.filter(v => v !== key && v !== va).forEach((v3,i3) => {
                // console.log(i3)
                if (n.get(v3)?.includes(key)) {
                    groups.add([key, va, v3].sort().join(','))
                }
                n.get(v3)?.filter(v => v !== key && v !== va && v !== v3).forEach(v4 => {
                    if (n.get(v4)?.includes(key)) {
                        groups.add([key, va, v3, v4].sort().join(','))
                    }
                    n.get(v4)?.filter(v => v !== key && v !== va && v !== v3 &&v !== v4).forEach(v5 => {
                        if (n.get(v5)?.includes(key)) {
                            groups.add([key, va, v3, v4, v5].sort().join(','))
                        }
                        n.get(v5)?.filter(v => v !== key && v !== va && v !== v3 &&v !== v4 && v !== v5).forEach(v6 => {
                            if (n.get(v6)?.includes(key)) {
                                groups.add([key, va, v3, v4, v5, v6].sort().join(','))
                            }
                            n.get(v6)?.filter(v => v !== key && v !== va && v !== v3 &&v !== v4 && v !== v5 && v !== v6).forEach(v7 => {
                                if (n.get(v7)?.includes(key)) {
                                    groups.add([key, va, v3, v4, v5, v6, v7].sort().join(','))
                                }
                                n.get(v7)?.filter(v => v !== key && v !== va && v !== v3 &&v !== v4 && v !== v5 && v !== v6 && v !== v7).forEach(v8 => {
                                    if (n.get(v8)?.includes(key)) {
                                        groups.add([key, va, v3, v4, v5, v6, v7, v8].sort().join(','))
                                    }
                            //         n.get(v8)?.forEach(v9 => {
                            //             if (n.get(v9)?.includes(key)) {
                            //                 groups.add([key, va, v3, v4, v5, v6, v7, v8, v9].sort().join(','))
                            //             }
                            //             n.get(v9)?.forEach(v10 => {
                            //                 if (n.get(v10)?.includes(key)) {
                            //                     groups.add([key, va, v3, v4, v5, v6, v7, v8, v9, v10].sort().join(','))
                            //                 }
                            //                 n.get(v10)?.forEach(v11 => {
                            //                     if (n.get(v11)?.includes(key)) {
                            //                         groups.add([key, va, v3, v4, v5, v6, v7, v8, v9, v10, v11].sort().join(','))
                            //                     }
                            //                     n.get(v11)?.forEach(v12 => {
                            //                         if (n.get(v11)?.includes(key)) {
                            //                             groups.add([key, va, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12].sort().join(','))
                            //                         }
                            //                         n.get(v12)?.forEach(v13 => {
                            //                             if (n.get(v13)?.includes(key)) {
                            //                                 groups.add([key, va, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13].sort().join(','))
                            //                             }
                            //                         })
                            //                     })
                            //                 })
                            //             })
                            //         })
                                })
                            })
                        })
                    })
                })
            })
        })
    //}
    return groups
}

const allNetworksArray = [...allNetworks.entries()];

console.log(allNetworksArray.map(n => `${n[0]},${n[1].length}`))

const groups = [...makeGroupsOf3(allNetworks).values()].sort((a,b) => a.split(',')[0].localeCompare(b.split(',')[0]))

console.log(groups.filter(a => a.split(',').filter(s => s.startsWith('t')).length).length)

const bigSet:Set<string> = new Set()
const bigGroup = groups.map(n => `${n.split(',')[0]},${groups.filter(g => g.split(',').includes(n.split(',')[0])).length}`)
.sort((a,b) => Number(b.split(',')[1]) - Number(a.split(',')[1]))
.filter(a => Number(a.split(',')[1]) === 66)

console.log()
console.log(bigGroup)
console.log('^^')
bigGroup.forEach(g => bigSet.add(g))
console.log(bigSet)
console.log([...bigSet.values()].map(a => a.split(',')[0]).join(','))

// const allGroups = [...makeGroups(allNetworks)]
// console.log(allGroups.sort((a,b) => b.length - a.length))
// console.log(allGroups[0].length)
// console.log(allGroups[0])
