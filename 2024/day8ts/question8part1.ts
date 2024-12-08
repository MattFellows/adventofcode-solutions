import fs from 'fs'

interface PossibleNode {
    node: string
    x: number
    y: number
    antiNodes?: PossibleNode[]
}

const input = fs.readFileSync('./input-1.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const grid:PossibleNode[][] = lines.map((l,y) => l.split("").map((c,x) => ({node: c, x: Number(x), y: Number(y)})))

console.log(grid.map(l => l.map(n => n.node).join("")).join("\n"))

const findOtherNodes = (node: PossibleNode) => {
    const otherNodes:PossibleNode[] = []
    grid.forEach(l => l.forEach(n => {
        if (n.node === node.node && !(n.x === node.x && n.y === node.y)) {
            otherNodes.push(n)
        } 
    }))
    // console.log('Found other Nodes:', otherNodes)
    return otherNodes
}

const findAntiNodes = (n1:PossibleNode, n2: PossibleNode):PossibleNode[] => {
    console.log("Find Antinodes: ", n1, n2)
    const dx = Math.abs(n2.x - n1.x)
    const dy = Math.abs(n2.y - n1.y)
    const antiNodeUp = grid[n1.y - dy]?.[n1.x - dx]
    const antiNodeDown = grid[n2.y + dy]?.[n2.x + dx]
    return [antiNodeUp, antiNodeDown].filter(a => a !== undefined)
}

const addAntiNodes = (nodes:PossibleNode[]) => {
    console.log("Add Antinodes: ", nodes)
    nodes.forEach((n1) => {
        nodes.forEach((n2) => {
            if (n1.x !== n2.x || n1.y !== n2.y) {
                const antiNodes = findAntiNodes(n1,n2)
                antiNodes.forEach(a => {
                    if (!grid[a.y][a.x].antiNodes) {
                        grid[a.y][a.x].antiNodes = []
                    }
                    const antiNode = {...n1};
                    antiNode.node
                    grid[a.y][a.x].antiNodes?.push(antiNode)
                })
            }
        })
    })
    
}

const foundNodeTypes:string[] = []

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        const possibleNode = grid[y][x]
        if (possibleNode.node.match(/^[A-Z0-9]$/) && !foundNodeTypes.includes(possibleNode.node)) {
            foundNodeTypes.push(possibleNode.node)
            const allNodesOfType:PossibleNode[] = [possibleNode, ...findOtherNodes(possibleNode)]
            addAntiNodes(allNodesOfType)
        }
    }   
}


console.log(grid.map(l => l.map(n => {
    return n.node !== '.' ? n.node : n.antiNodes ? '#' : n.node
}).join("")).join("\n"))


console.log(grid.map(l => l.map(n => n.node === '.' ? n.antiNodes?.length||0 : 0).reduce((p,c) => p+c)).reduce((p,c) => p+c))


