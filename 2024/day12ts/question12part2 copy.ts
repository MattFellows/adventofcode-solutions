import fs from 'fs'
import { Cell, Grid, Row, getCardinalNeighbors, makeGrid, printGrid } from '../utils/grid'

const input = fs.readFileSync('./input-small.txt').toString()
const grid = makeGrid<string>(input)

interface ContiguousArea {
    val: string
    cells: Cell<string>[]
}

const groupdCells:Set<Cell<string>> = new Set<Cell<string>>()

const findAndFilterContiguousCells = (grid:Grid<string>, y:number, x:number, d:number = 0, originCell:Cell<string>):Cell<string>[] => {
    const startCell = grid.rows[y].cells[x]
    const allKnownContiguousCells:Map<Cell<string>,Cell<string>[]> = new Map()
    groupdCells.add(startCell)

    // console.log(`FindAndFilter: (${startCell.x}, ${startCell.y}, [${startCell.val}]) (${d})`)

    const startCellNeighbors = getCardinalNeighbors(grid, startCell)
    const filteredNeighbors = startCellNeighbors.filter(n => n.val === startCell.val)
    
    for (let i = 0; i < filteredNeighbors.length; i++) {
        const n = filteredNeighbors[i];
        allKnownContiguousCells.set(originCell, [...(allKnownContiguousCells.get(originCell) || []), n])
        if (!groupdCells.has(n)) {
            groupdCells.add(n)
            const newContiguousCells = findAndFilterContiguousCells(grid, n.y, n.x, d+1, originCell)
            // console.log(`Adding (${n.val} [${d}]): `, newContiguousCells.map(c => `(${c.x},${c.y})`))
            allKnownContiguousCells.set(originCell, [...(allKnownContiguousCells.get(originCell) || []), ...newContiguousCells])

        }
    }
    // console.log(`Returning from depth ${d} with ${(allKnownContiguousCells.get(originCell) || []).map(c => `(${c.x},${c.y})`)}`)
    return (allKnownContiguousCells.get(originCell) || [])
}

const findAllContiguousCellsWithValue = (grid:Grid<string>, y:number, x:number):ContiguousArea => {
    const cell = grid.rows[y].cells[x]
    // console.log('findAllContiguousCellsWithValue: ', cell)
    const cells = findAndFilterContiguousCells(grid, y, x, 0, cell)
    const uniqueCells = new Set<Cell<string>>()
    cells.forEach(a => uniqueCells.add(a))
    if (!uniqueCells.has(cell)) {
        uniqueCells.add(cell)
    }
    const val = cell.val
    // console.log(`Found: ${uniqueCells.size} ${val}s`)
    return {val, cells: [...uniqueCells.values()]}
} 

const makeGroups = (grid:Grid<string>):ContiguousArea[] => {
    const contiguousAreas:ContiguousArea[] = []
    for (let y = 0; y < grid.rows.length; y++) {
        for (let x = 0; x < grid.rows[y].cells.length; x++) {
            // console.log('Maybe find cells for: ', x, y, grid.rows[y].cells[x])
            if (!groupdCells.has(grid.rows[y].cells[x])) {
                // console.log('BeforeSize: ', contiguousAreas.length)
                contiguousAreas.push(findAllContiguousCellsWithValue(grid, y, x))
                // console.log('AfterSize: ', contiguousAreas.length)
            }
        }
    }
    // console.log('TotalSize: ', contiguousAreas.length)
    return contiguousAreas;
}

const makeSubGrid = (area:ContiguousArea):Grid<string> => {
    let maxX:Cell<string> = {x:0,y:0,val:''}
    let maxY:Cell<string> = {x:0,y:0,val:''}
    let minX:Cell<string> = {x:0,y:0,val:''}
    let minY:Cell<string> = {x:0,y:0,val:''}
    let cellCount = 0;
    area.cells.forEach(c => {
        if(!maxX || maxX.x < c.x) {
            maxX = c
        }
        if(!minX || minX.x > c.x) {
            minX = c
        }
        if(!maxY || maxY.y < c.y) {
            maxY = c
        }
        if(!minY || minY.y > c.y) {
            minY = c
        }
    })
    const rows:Row<string>[] = []
    const yDelta = maxY.y - minY.y
    const xDelta = maxX.x - minX.x
    for (let y = 0; y <= yDelta; y++) {
        const cells:Cell<string>[] = []
        for (let i = 0; i <= xDelta; i++) {
            cells.push({x:i,y,val:'.'})
        }
        const row:Row<string> = {cells,y,cell:(i) => cells[i]}
        rows.push(row)
    }
    area.cells.forEach(c => {
        cellCount++
        rows[c.y - minY.y].cells[c.x - minX.x] = {y:c.y - minY.y,x:c.x - minX.x,val:c.val}
    })

    const grid = {rows, row:(i) => rows[i], cellCount};
    // printGrid(grid)
    // console.log()
    return grid
}

const rotateCW = (dir:number):number => {
    if (dir === 3) {
        return 0
    }
    return (dir+1)
}

const rotateACW = (dir:number):number => {
    if (dir === 0) {
        return 3
    }
    return (dir-1)
}

const countLeftHandCorners = (grid:Grid<string>, x:number, y:number):number => {
    let cell = grid.rows[y].cells[x]
    let corners = 0
    let dir = 1;
    let left = getLeftCell(dir, grid, y, x)
    let ahead = getAheadCell(dir, grid, y, x)
    let right = getRightCell(dir, grid, y, x)
    let newX = x
    let newY = y
    do {
        // console.log(`(${newX},${newY})[${cell.val}] L${left?.val}(${left?.x},${left?.y}) A${ahead?.val}(${ahead?.x},${ahead?.y}) R${right?.val}(${right?.x},${right?.y}) CornersSoFar ${corners}`)
        if (left?.val !== cell.val && ahead?.val === cell.val) {
            // console.log('Moving ahead')
            newX = ahead?.x
            newY = ahead?.y
        } /*else if (left?.val !== cell.val && ahead.val !== cell.val) {
            console.log('Rotating CW and moving')
            dir = (dir + 1) % 4
            ahead = getAheadCell(dir, grid, newY, newX)
            newX = ahead?.x
            newY = ahead?.y
            corners++
        } */else if (left?.val === cell.val) {
            dir = rotateACW(dir)
            // console.log(`Rotating ACW and moving: new Dir ${dir}`)
            ahead = getAheadCell(dir, grid, newY, newX)
            newX = ahead?.x
            newY = ahead?.y
            corners++
        } else {
            dir = rotateCW(dir)
            // console.log(`Rotating CW: new Dir (${dir})`)
            corners++
        }
        left = getLeftCell(dir, grid, newY, newX)
        ahead = getAheadCell(dir, grid, newY, newX)
        right = getRightCell(dir, grid, newY, newX)
        // const tmpGridRows = grid.rows.map(a => ({...a, cells:a.cells.map(c => ({...c}))}))
        // tmpGridRows[newY].cells[newX].val = '*'
        // printGrid({...grid, rows:tmpGridRows})
    } while ((newX !== x || newY !== y || dir != 1))
    // console.log('Returning Corners: ', corners)
    return corners
}

const countSides = (grid:Grid<string>):number => {
    let countSides = 0
    for (let y = 0; y < grid.rows.length; y++) {
        for (let x = 0; x < grid.rows[y].cells.length; x++) {
            if (grid.rows[y].cells[x].val !== ".") {
                return countLeftHandCorners(grid, x, y)
            }
        }
    }
    return countSides;
}

const groups = makeGroups(grid);
// console.log(groups[6])
const subGrids = groups.map(makeSubGrid)
// subGrids.forEach(g => {printGrid(g);console.log();})
printGrid(subGrids[5])
console.log(countSides(subGrids[5]))

const perims = subGrids.map(g => ({...g, countSides: countSides(g)}))
console.log(perims)
const costs = perims.map(g => g.countSides * (g.cellCount||0))

console.log(costs.reduce((p,c) => p+c))

function getAheadCell(dir: number, grid: Grid<string>, y: number, x: number) {
    return dir === 0 ? grid.rows[y - 1]?.cells?.[x] :
        dir === 1 ? grid.rows[y]?.cells?.[x + 1] :
            dir === 2 ? grid.rows[y + 1]?.cells?.[x] :
                grid.rows[y]?.cells?.[x - 1]
}

function getLeftCell(dir: number, grid: Grid<string>, y: number, x: number) {
    return dir === 1 ? grid.rows[y - 1]?.cells?.[x] :
        dir === 2 ? grid.rows[y]?.cells?.[x + 1] :
            dir === 3 ? grid.rows[y + 1]?.cells?.[x] :
                grid.rows[y]?.cells?.[x - 1]
}

function getRightCell(dir: number, grid: Grid<string>, y: number, x: number) {
    return dir === 1 ? grid.rows[y + 1]?.cells?.[x] :
        dir === 2 ? grid.rows[y]?.cells?.[x - 1] :
            dir === 3 ? grid.rows[y - 1]?.cells?.[x] :
                grid.rows[y]?.cells?.[x + 1]
}
