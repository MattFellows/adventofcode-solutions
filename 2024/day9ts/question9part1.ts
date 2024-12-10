import fs from 'fs'
import { LOG_LEVELS, log } from '../utils/log'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

const mapLineToDiskBlocks = (l) => {
    log(LOG_LEVELS.DEBUG, `Expanding ${l}`)
    const expansion = l.split("").map((n:string,i:number) => {
        log(LOG_LEVELS.DEBUG, `Expanding ${i}, ${n} times`)
        if (i % 2 == 0) {
            return Array.from({length: Number(n)}, () => `${i/2}`)
            // return `${n}`.replace(/[0-9]/, `${(i)/2}`).padStart(Number(n), `${(i)/2}`)
        } else {
            return Array.from({length: Number(n)}, () => `.`)
        }
    })
    return expansion.flat()
}

const defrag = (blocks) => {
    for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].match(/[0-9]/)) {
            for (let j = 0; j < blocks.length; j++) {
                if (blocks[j] === '.') {
                    blocks[j] = blocks[i]
                    blocks[i] = '.'
                }
            }
        }
    }
    blocks[blocks.length] = blocks.shift()
    return blocks
}

const checksum = (blocks) => {
    let total = 0
    blocks.forEach((b,i) => {
        if (b !== '.') {
            total += (Number(b) * i)
        }
    })
    return total
}
log(LOG_LEVELS.DEBUG, lines.join("\n"))
const mapped = mapLineToDiskBlocks(lines[0])
log(LOG_LEVELS.DEBUG, mapped)
const defragged = defrag(mapped)
log(LOG_LEVELS.DEBUG, defragged)
log(LOG_LEVELS.DEBUG, checksum(defragged))
