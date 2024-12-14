import fs from 'fs'
import { Location } from '../utils/grid'

const input = fs.readFileSync('./input-small.txt').toString()
const lines = input.split("\n").map(l => l.trim())

interface Bot {
  p:Location
  v:Location
}

const makeBot = (line:string):Bot => {
  const parts = line.split(' ')
  const positionStr = parts[0].substring(parts[0].indexOf('=')+1)
  const velocitytr = parts[1].substring(parts[1].indexOf('=')+1)

  return { p: { x: Number(positionStr.split(',')[0]), y: Number(positionStr.split(',')[1]) }, v: { x: Number(velocitytr.split(',')[0]), y: Number(velocitytr.split(',')[1]) }}
}

const bots = lines.map(makeBot)

const iterateBot = (bot:Bot,iterations:number,gridSize:Location):Bot => {
  const newX = (bot.p.x + (iterations * bot.v.x)) % gridSize.x
  const newY = (bot.p.y + (iterations * bot.v.y)) % gridSize.y
  return {...bot,p:{x:newX,y:newY}}
}

const gridSize = {x:11,y:7}
const movedBots = bots.map(b => iterateBot(b,100,gridSize))

const countBotsInQuadrants = (bots:Bot[],gridSize:Location):number[] => {
  const values = [0,0,0,0]
  bots.forEach(b => {
    const p = b.p
    const halfWidth = gridSize.x/2
    const halfHeight = gridSize.y/2
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

console.log(countBotsInQuadrants(movedBots,gridSize))