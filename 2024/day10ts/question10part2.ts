import fs from 'fs'
import { makeGrid, filterGrid, Grid, Cell } from '../utils/grid'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const grid = makeGrid(input, (x,y,val) => ({toString:() => val, x, y, val: Number(val)}), "")
const trailHeads = filterGrid(grid,0)

// console.log(trailHeads)

const getCardinalNeighbors = (grid:Grid<number>, cell:Cell<number>):Cell<number>[] => {
    return [grid.rows[cell.y]?.cells?.[cell.x - 1], grid.rows[cell.y]?.cells?.[cell.x + 1], grid.rows[cell.y - 1]?.cells?.[cell.x], grid.rows[cell.y+1]?.cells?.[cell.x]].filter(a => !!a)
}

const incrementingPaths = new Map<Cell<number>, Cell<number>[]>();

const countIncrementingPaths = (grid:Grid<number>, cell:Cell<number>, currentPath:Cell<number>[]):number => {
    if (cell.val === 9) {
        if (!incrementingPaths.get(currentPath[0])) {
            incrementingPaths.set(currentPath[0], [])
        }
        const newSet = incrementingPaths.get(currentPath[0])!;
        newSet?.push(currentPath[currentPath.length-1]);
        incrementingPaths.set(currentPath[0], newSet)
        // console.log(`Returning 1 ${currentPath.map(p => `(${p.x},${p.y})`).join(",")}`)
        return 1
    }
    const neighbors = getCardinalNeighbors(grid, cell)
    // console.log(`Found ${neighbors.length} cardinal neighbors: ${JSON.stringify(neighbors)}`)
    let totalPaths = 0;
    neighbors.forEach(c => {
        if (c.val - cell.val === 1) {
            // console.log(`Matching neighbor: (${c.x},${c.y}) ${c.val}`)
            const localPath = [...currentPath]
            localPath.push(c)
            totalPaths += countIncrementingPaths(grid, c, localPath)
        }
    })
    // console.log(`Returning end ${totalPaths}`)
    return totalPaths;
}

trailHeads.forEach(t => countIncrementingPaths(grid, t, [t]))
// countIncrementingPaths(grid, grid.rows[0].cells[4], [grid.rows[0].cells[4]])
const scores = new Map<string, number>()
for (let [k,v] of incrementingPaths.entries()) {
    scores.set(`(${k.x},${k.y})`, (scores.get(`(${k.x},${k.y})`) || 0) + v.length)
}

console.log(scores)

let total = 0
scores.forEach(v => total += v)
console.log(total)
