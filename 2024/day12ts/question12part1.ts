import fs from 'fs'
import { Cell, Grid, Row, getCardinalNeighbors, makeGrid, printGrid } from '../utils/grid'
import { Serialisable } from '../utils/log'

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

interface CellPerimeter<T extends Serialisable> {
    cell:Cell<T>
    topPerimeter:boolean
    rightPerimeter:boolean
    bottomPerimeter:boolean
    leftPerimeter:boolean
}

const perimeterSize = (grid:Grid<string>):{num:number,cellPerims:CellPerimeter<string>[]} => {
    const cellPerimeters:CellPerimeter<string>[] = []
    let verticalPerims = 0;
    let horizontalPerims = 0;
    let val = grid.rows.map(r => r.cells.reduce((p,c) => c.val !== '.' ? c : p)).reduce((p,c) => c.val !== '.' ? c : p)
    for (let x = 0; x < grid.rows[0].cells.length; x++) {
        let insideVertical = false
        for (let y = 0; y < grid.rows.length; y++) {
            if (grid.rows[y].cells[x].val === val.val) {
                if (!insideVertical) {
                    // console.log(`Add Vertical Match ${x},${y} (${grid.rows[y].cells[x].val})`)
                    insideVertical = true
                    cellPerimeters.push({cell: grid.rows[y].cells[x], topPerimeter:true, rightPerimeter:false, leftPerimeter:false, bottomPerimeter:false})
                    verticalPerims++
                }
            }
            if (grid.rows[y].cells[x].val !== val.val) {
                if (insideVertical) {
                    // console.log(`Add Vertical !Math ${x},${y} (${grid.rows[y].cells[x].val})`)
                    insideVertical = false
                    cellPerimeters.push({cell: grid.rows[y].cells[x], topPerimeter:false, rightPerimeter:false, leftPerimeter:false, bottomPerimeter:true})
                    verticalPerims++
                }
            }
        }
        if (insideVertical) {
            // console.log(`Add Vertical ${x},${grid.rows.length} (*)`)
            insideVertical = false
            cellPerimeters.push({cell: grid.rows[grid.rows.length-1].cells[x], topPerimeter:false, rightPerimeter:false, leftPerimeter:false, bottomPerimeter:true})
            verticalPerims++
        } 
    }
    for (let y = 0; y < grid.rows.length; y++) {
        let insideHorizontal = false
        for (let x = 0; x < grid.rows[y].cells.length; x++) {
            if (grid.rows[y].cells[x].val === val.val) {
                if (!insideHorizontal) {
                    // console.log(`Add Horizontal ${x},${y} (${grid.rows[y].cells[x].val})`)
                    insideHorizontal = true
                    cellPerimeters.push({cell: grid.rows[y].cells[x], topPerimeter:false, rightPerimeter:false, leftPerimeter:true, bottomPerimeter:false})
                    horizontalPerims++
                }
            }
            if (grid.rows[y].cells[x].val !== val.val) {
                if (insideHorizontal) {
                    // console.log(`Add Horizontal ${x},${y} (${grid.rows[y].cells[x].val})`)
                    insideHorizontal = false
                    cellPerimeters.push({cell: grid.rows[y].cells[x], topPerimeter:false, rightPerimeter:true, leftPerimeter:false, bottomPerimeter:false})
                    horizontalPerims++
                }
            }
        }
        if (insideHorizontal) {
            // console.log(`Add Horizontal ${grid.rows[y].cells.length},${y} (*)`)
            insideHorizontal = false
            cellPerimeters.push({cell: grid.rows[y].cells[grid.rows[y].cells.length-1], topPerimeter:false, rightPerimeter:true, leftPerimeter:false, bottomPerimeter:false})
            horizontalPerims++
        }
    }
    // console.log(`V ${verticalPerims} H ${horizontalPerims}`)
    return {num: verticalPerims + horizontalPerims, cellPerims: cellPerimeters};
}


const mergePerims = (cellPerims:CellPerimeter<string>[]):CellPerimeter<string>[] => {
    const mapsetPerims = new Map<Cell<string>,Set<CellPerimeter<string>>>()
    cellPerims.forEach(cp => {
        cellPerims.filter(cp2 => cp2 !== cp).forEach(cp2 => {
            if (cp2.cell.x === cp.cell.x && cp2.cell.y === cp.cell.y) {
                cp.topPerimeter = cp2.topPerimeter || cp.topPerimeter
                cp.rightPerimeter = cp2.rightPerimeter || cp.rightPerimeter
                cp.bottomPerimeter = cp2.bottomPerimeter || cp.bottomPerimeter
                cp.leftPerimeter = cp2.leftPerimeter || cp.leftPerimeter
            }
        })
        mapsetPerims.set(cp.cell, (mapsetPerims.get(cp.cell) || new Set()).add(cp))
    })
    return Array.from(mapsetPerims.values()).flatMap(s => Array.from(s))
}

const groups = makeGroups(grid);
// console.log(groups[6])
const subGrids = groups.map(makeSubGrid)
// subGrids.forEach(g => {printGrid(g);console.log();})
printGrid(subGrids[0])
const subGridPerim = perimeterSize(subGrids[0])
subGridPerim.cellPerims.forEach(cp => {
    console.log(cp.cell.x,cp.cell.y,cp.bottomPerimeter,cp.leftPerimeter,cp.topPerimeter,cp.rightPerimeter)
})

console.log()
mergePerims(subGridPerim.cellPerims).forEach(cp => {
    console.log(cp.cell.x,cp.cell.y,cp.bottomPerimeter,cp.leftPerimeter,cp.topPerimeter,cp.rightPerimeter)
})

// const perims = subGrids.map(g => ({...g, perimeterSize: perimeterSize(g)}))
// console.log(perims)

// const costs = perims.map(g => g.perimeterSize.num * (g.cellCount||0))

// console.log(costs.reduce((p,c)=>p+c))