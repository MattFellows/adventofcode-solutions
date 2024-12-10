import fs from 'fs'
import { makeGrid, printGrid } from '../utils/grid'
import { LOG_LEVELS, log } from '../utils/log'

interface PossibleNode {
    node: string
    x: number
    y: number
    antiNodes?: PossibleNode[]
    toString():string
}

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const grid = makeGrid<PossibleNode>(input, (x,y,v) => ({x: Number(x), y: Number(y), val:{node: v, x: Number(x), y: Number(y), toString: () => v}}))
printGrid(grid)

const findOtherNodes = (node: PossibleNode) => {
    const otherNodes:PossibleNode[] = []
    grid.rows.forEach(l => l.cells.forEach(n => {
        if (n.val.node === node.node && !(n.val.x === node.x && n.val.y === node.y)) {
            otherNodes.push(n.val)
        } 
    }))
    log(LOG_LEVELS.DEBUG, 'Found other Nodes:', otherNodes)
    return otherNodes
}

const findAntiNodes = (n1:PossibleNode, n2: PossibleNode):PossibleNode[] => {
    log(LOG_LEVELS.DEBUG, "Find Antinodes: ", n1, n2)
    const an1X = n1.x - (n2.x - n1.x)
    const an1Y = n1.y - (n2.y - n1.y)
    log(LOG_LEVELS.DEBUG, an1X, an1Y)
    return [grid?.rows?.[an1Y]?.cells?.[an1X]?.val].filter(a => a !== undefined)
}

const addAntiNodes = (nodes:PossibleNode[]) => {
    log(LOG_LEVELS.DEBUG, "Add Antinodes: ", nodes)
    nodes.forEach((n1) => {
        nodes.forEach((n2) => {
            if (n1.x !== n2.x || n1.y !== n2.y) {
                const antiNodes = findAntiNodes(n1,n2)
                log(LOG_LEVELS.DEBUG, `Found ${antiNodes.length} antiNodes`)
                antiNodes.forEach(a => {
                    if (!grid.rows[a.y].cells[a.x].val.antiNodes) {
                        grid.rows[a.y].cells[a.x].val.antiNodes = []
                    }
                    const antiNode = {...n1};
                    antiNode.node
                    grid.rows[a.y].cells[a.x].val.antiNodes!.push(antiNode)
                })
            }
        })
    })
    
}

const foundNodeTypes:string[] = []

for (let y = 0; y < grid.rows.length; y++) {
    for (let x = 0; x < grid.rows[y].cells.length; x++) {
        const possibleNode = grid.rows[y].cells[x]
        if (possibleNode.val.node.match(/^[a-zA-Z0-9]$/) && !foundNodeTypes.includes(possibleNode.val.node)) {
            log(LOG_LEVELS.DEBUG, 'Tower found')
            foundNodeTypes.push(possibleNode.val.node)
            const allNodesOfType:PossibleNode[] = [possibleNode.val, ...findOtherNodes(possibleNode.val)]
            addAntiNodes(allNodesOfType)
        }
    }   
}

log(LOG_LEVELS.DEBUG, '')
log(LOG_LEVELS.DEBUG, grid.rows.map(l => l.cells.map(n => {
    return n.val.node !== '.' ? n.val.node : n.val.antiNodes ? '#' : n.val.node
}).join("")).join("\n"))
log(LOG_LEVELS.DEBUG, '')

log(LOG_LEVELS.INFO, grid.rows.map(l => l.cells.map(n => Number(n.val.antiNodes ? 1 : 0)).reduce((p,c) => p+c)).reduce((p,c) => p+c))


