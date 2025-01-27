import { LOG_LEVELS, log, Serialisable } from "./log"
import { createWriteStream } from 'fs'
import { PNG } from 'pngjs'
import logUpdate from 'log-update'


export interface Cell<T extends Serialisable> {
    x: number
    y:number
    val: T
}

export interface Row<T extends Serialisable> {
    y: number
    cells: Cell<T>[]
    cell(index:number):Cell<T>
}

export interface Grid<T extends Serialisable> {
    rows: Row<T>[]
    row(index:number):Row<T> 
    cellCount?:number
}

export interface CellProducer<T extends Serialisable> {
    (x:number, y:number, v:any):Cell<T>
}

export interface Location {
    x:number
    y:number
}

export enum Dir {
    EAST=1,
    SOUTH=2,
    WEST=3,
    NORTH=0
}

export const rotateCW = (dir:Dir):number => {
    if (dir === Dir.WEST) {
        return Dir.NORTH
    }
    return (dir+1)
}

export const rotateACW = (dir:Dir):number => {
    if (dir === Dir.NORTH) {
        return Dir.WEST
    }
    return (dir-1)
}

export const moveDir = (l:Location, d:Dir):Location => {
    switch (d) {
        case Dir.NORTH: {
            return {x:l.x, y:l.y-1}
        }
        case Dir.EAST: {
            return {x:l.x+1, y:l.y}
        }
        case Dir.SOUTH: {
            return {x:l.x, y:l.y+1}
        }
        case Dir.WEST: {
            return {x:l.x-1, y:l.y}
        }
    }
}

export const getAheadCell = <T extends Serialisable>(dir: Dir, grid: Grid<T>, y: number, x: number):Cell<T> => {
    return dir === Dir.NORTH ? grid.rows[y - 1]?.cells?.[x] :
        dir === Dir.EAST ? grid.rows[y]?.cells?.[x + 1] :
            dir === Dir.SOUTH ? grid.rows[y + 1]?.cells?.[x] :
                grid.rows[y]?.cells?.[x - 1]
}

export const getBehindCell = <T extends Serialisable>(dir: Dir, grid: Grid<T>, y: number, x: number):Cell<T> => {
    return dir === Dir.NORTH ? grid.rows[y + 1]?.cells?.[x] :
        dir === Dir.EAST ? grid.rows[y]?.cells?.[x - 1] :
            dir === Dir.SOUTH ? grid.rows[y - 1]?.cells?.[x] :
                grid.rows[y]?.cells?.[x + 1]
}

export const getLeftCell = <T extends Serialisable>(dir: Dir, grid: Grid<T>, y: number, x: number):Cell<T> => {
    return dir === Dir.EAST ? grid.rows[y - 1]?.cells?.[x] :
        dir === Dir.SOUTH ? grid.rows[y]?.cells?.[x + 1] :
            dir === Dir.WEST ? grid.rows[y + 1]?.cells?.[x] :
                grid.rows[y]?.cells?.[x - 1]
}

export const getRightCell = <T extends Serialisable>(dir: number, grid: Grid<T>, y: number, x: number):Cell<T> => {
    return dir === Dir.EAST ? grid.rows[y + 1]?.cells?.[x] :
        dir === Dir.SOUTH ? grid.rows[y]?.cells?.[x - 1] :
            dir === Dir.WEST ? grid.rows[y - 1]?.cells?.[x] :
                grid.rows[y]?.cells?.[x + 1]
}

export const filterGrid = <T extends Serialisable>(grid:Grid<T>, filter:T):Cell<T>[] => {
    const matchingGridSquares:Cell<T>[] = []
    grid.rows.forEach(r => r.cells.forEach(c => {
        if (c.val === filter) {
            matchingGridSquares.push(c)
        }
    }))
    return matchingGridSquares;
}

export const makeGrid = <T extends Serialisable>(allLines:string, producer: CellProducer<T> = (x,y,val) =>({x,y,val}), separator: string = ''):Grid<T> => {
    const rows:Row<T>[] = allLines.split("\n").map((l,y) => {
        const cells:Cell<T>[] = l.split(separator).map((val,x) => producer(x,y,val))
        return {cells: cells,y,cell: (i) => cells[i]}
    })
    return {rows, row: (i) => rows[i]}
}

export const makeGridOfSize = <T extends Serialisable>(x:number, y:number, producer: CellProducer<T> = (x,y,val) =>({x,y,val})):Grid<T> => {
    const rows:Row<T>[] = Array.apply(null, Array(y)).map((_l,y) => {
        const cells:Cell<T>[] = Array.apply('.', Array(x)).map((val,x) => producer(x,y,val))
        return {cells: cells,y,cell: (i) => cells[i]}
    })
    return {rows, row: (i) => rows[i]}
}

export const printGrid = <T extends Serialisable>(grid:Grid<T>, joiner:string = "", serializer = (c:Cell<T>)=>c?.val?.toString()):void => {
    log(LOG_LEVELS.INFO, grid.rows.map((r) => r.cells.map(serializer).join(joiner)).join('\n'))
}

export const reprintGrid = <T extends Serialisable>(grid:Grid<T>):void => {
    logUpdate(grid.rows.map((r) => r.cells.map((c:Cell<T>)=>c?.val?.toString()).join('')).join('\n') + '\n')
}

export const getCardinalNeighbors = <T extends Serialisable>(grid:Grid<T>, cell:Cell<T>):Cell<T>[] => {
    return [grid.rows[cell.y]?.cells?.[cell.x - 1], grid.rows[cell.y]?.cells?.[cell.x + 1], grid.rows[cell.y - 1]?.cells?.[cell.x], grid.rows[cell.y+1]?.cells?.[cell.x]].filter(a => !!a)
}

export const getByCoords = <T extends Serialisable>(grid:Grid<T>, x:number, y:number):Cell<T> => {
    return grid.rows[y]?.cells?.[x]
}

export const getByValue = <T extends Serialisable>(grid:Grid<T>, value:T):Cell<T> => {
    return getByMatcher(grid, (v) => v.val === value)
}

export const getAllByValue = <T extends Serialisable>(grid:Grid<T>, value:T):Cell<T>[] => {
    return getAllByMatcher(grid, (v) => v.val === value)
}

export const getByMatcher = <T extends Serialisable>(grid:Grid<T>, matcher:(a:any) => boolean):Cell<T> => {
    let matchedCell
    grid.rows.forEach(r => {
        matchedCell = matchedCell ?? r.cells.find(matcher)
    })
    return matchedCell
}

export const getAllByMatcher = <T extends Serialisable>(grid:Grid<T>, matcher:(a:any) => boolean):Cell<T>[] => {
    let matchedCells:Cell<T>[] = []
    grid.rows.forEach(r => {
        r.cells.filter(matcher).forEach(c => matchedCells.push(c))
    })
    return matchedCells
}

export const getDir = <T extends Serialisable>(from:Cell<T>, to:Cell<T>):Dir => {
    if (from.x < to.x) {
        return Dir.WEST
    }
    if (from.x > to.x) {
        return Dir.EAST
    }
    if (from.y < to.y) {
        return Dir.NORTH
    }
    return Dir.SOUTH
} 

export const toPNG = async (grid:Grid<number>,fileName:string) => {
    const width = grid.rows[0].cells.length
    const height = grid.rows.length
    const png = new PNG({width, height})
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (width * y + x) << 2
            const resolvedPixelVal = grid.rows[y].cells[x].val
            if (resolvedPixelVal === 0) {
                png.data[idx] = 0 //red
                png.data[idx+1] = 0 //green
                png.data[idx+2] = 0 //blue
                png.data[idx+3] = 255 //alpha (0 is transparent)
            } else if (resolvedPixelVal === 1) {
                png.data[idx] = 255 //red
                png.data[idx+1] = 255 //green
                png.data[idx+2] = 255 //blue
                png.data[idx+3] = 255 //alpha (0 is transparent)
            } else {
                png.data[idx] = 0 //red
                png.data[idx+1] = 0 //green
                png.data[idx+2] = 0 //blue
                png.data[idx+3] = 0 //alpha (0 is transparent)
            }
            
        }
    }

    await new Promise((resolve, _reject) => png.pack().pipe(createWriteStream(fileName)).on('finish', resolve))
}
