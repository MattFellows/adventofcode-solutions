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

const movedBots = originalBots.map(b => iterateBot(b,100,gridSize))

const gridBots = (grid:Grid<string>,bots:Bot[]):Grid<string> => {
  bots.forEach(b => {
    // console.log(`Adding ${b.p.x},${b.p.y}`)
    grid.rows[b.p.y].cells[b.p.x].val = `${Number(grid.rows[b.p.y].cells[b.p.x].val) + 1}`
  })
  return grid;
}

const countBotsInQuadrants = (bots:Bot[],gridSize:Location):number[] => {
  const values = [0,0,0,0]
  bots.forEach(b => {
    const p = b.p
    const halfWidth = Math.floor(gridSize.x/2)
    const halfHeight = Math.floor(gridSize.y/2)
    // console.log(halfWidth,halfHeight)
    if (p.x < halfWidth && p.y < halfHeight) {
      values[0] +=1
    } else if (p.x < halfWidth && p.y > halfHeight) {
      values[2] +=1
    } else if (p.x > halfWidth && p.y > halfHeight) {
      values[3] +=1
    } else if (p.x > halfWidth && p.y < halfHeight) {
      values[1] +=1
    }
  })
  return values
}

const newGrid = gridBots(emptyGrid,movedBots)
printGrid(newGrid)

console.log(countBotsInQuadrants(movedBots,gridSize))
console.log(countBotsInQuadrants(movedBots,gridSize).reduce((p,c) => p*c))