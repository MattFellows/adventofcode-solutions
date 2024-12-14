import fs from 'fs'
import { Grid, Location, makeGrid, printGrid } from '../utils/grid'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

interface Bot {
  p:Location
  v:Location
}

// console.log((-17%10))

const makeBot = (line:string):Bot => {
  const parts = line.split(' ')
  const positionStr = parts[0].substring(parts[0].indexOf('=')+1)
  const velocitytr = parts[1].substring(parts[1].indexOf('=')+1)

  return { p: { x: Number(positionStr.split(',')[0]), y: Number(positionStr.split(',')[1]) }, v: { x: Number(velocitytr.split(',')[0]), y: Number(velocitytr.split(',')[1]) }}
}

const originalBots = lines.map(makeBot)
const gridSize = {x:101,y:103}
const gridStr = Array.apply(null, new Array(gridSize.y)).map(() => Array.apply(null, new Array(gridSize.x)).map(() => "0").join("")).join("\n")
const emptyGrid = makeGrid<string>(gridStr)
printGrid(emptyGrid)


const iterateBot = (bot:Bot,iterations:number,gridSize:Location):Bot => {
  const newX = (bot.p.x + (iterations * bot.v.x)) % gridSize.x
  const newY = (bot.p.y + (iterations * bot.v.y)) % gridSize.y
  const X = newX < 0 ? gridSize.x - Math.abs(newX) : newX
  const Y = newY < 0 ? gridSize.y - Math.abs(newY) : newY
  const newBot = {...bot,p:{x:X,y:Y}}
  // console.log(`Returning: ${newBot.p.x},${newBot.p.y}`)
  return newBot
}

const gridBots = (grid:Grid<string>,bots:Bot[]):Grid<string> => {
  const newGrid = makeGrid<string>(gridStr);
    bots.forEach(b => {
    // console.log(`Adding ${b.p.x},${b.p.y}`)
    newGrid.rows[b.p.y].cells[b.p.x].val = `${Number(newGrid.rows[b.p.y].cells[b.p.x].val) + 1}`
  })
  return newGrid;
}

const contiguousHoriz = (bots:Bot[], x:number, y:number):number => {
    let contiguousCount = 0;
    for (let xx = x; xx < gridSize.x; xx++) {
        if (bots.filter(b => b.p.x === xx && b.p.y === y).length) {
            contiguousCount++
        } else {
            return contiguousCount
        }
    }
    return contiguousCount
}

const calcContiguousHoriz = (bots:Bot[]):number => {
    let total = 0
    for (let y = 0; y < gridSize.y; y++) {
        for (let x = 0; x < gridSize.x; x++) {
            if (bots.filter(b => b.p.x === x && b.p.y === y).length) {
                total += contiguousHoriz(bots, x, y)
            }
        }
    }
    return total
}

let arrangementEstimate = 0
for (let i = 0; i < 100000; i++) {
    const movedBots = originalBots.map(b => iterateBot(b,i,gridSize))

    const maxContiguousHoriz = calcContiguousHoriz(movedBots)
    if (maxContiguousHoriz > arrangementEstimate) {
        arrangementEstimate = maxContiguousHoriz
        const newGrid = gridBots(emptyGrid,movedBots)
        console.log(`-----------------------------------${i} ${maxContiguousHoriz}-----------------------------------`)
        printGrid(newGrid)
        console.log(i)
    }
}