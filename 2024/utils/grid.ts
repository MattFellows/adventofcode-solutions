import { LOG_LEVELS, log, Serialisable } from "./log"

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
}

export interface CellProducer<T extends Serialisable> {
    (x:number, y:number, v:any):Cell<T>
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

export const printGrid = <T extends Serialisable>(grid:Grid<T>, joiner:string = ""):void => {
    log(LOG_LEVELS.INFO, grid.rows.map((r) => r.cells.map(c => c.val.toString()).join(joiner)).join('\n'))
}

