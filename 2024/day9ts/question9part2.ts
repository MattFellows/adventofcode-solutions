import fs from 'fs'
import { LOG_LEVELS, log } from '../utils/log'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

const mapLineToDiskBlocks = (l) => {
    // log(LOG_LEVELS.DEBUG, `Expanding ${l}`)
    const expansion = l.split("").map((n:string,i:number) => {
        // log(LOG_LEVELS.DEBUG, `Expanding ${i}, ${n} times`)
        if (i % 2 == 0) {
            return Array.from({length: Number(n)}, () => `${i/2}`)
            // return `${n}`.replace(/[0-9]/, `${(i)/2}`).padStart(Number(n), `${(i)/2}`)
        } else {
            return Array.from({length: Number(n)}, () => `.`)
        }
    })
    return expansion
}

const defrag = (blocksOfBlocks) => {
    let blocks = blocksOfBlocks.map((a) => a.slice())
    log(LOG_LEVELS.DEBUG, blocks)
    for (let i = blocksOfBlocks.length - 1; i >=0; i--) {
        const b = blocksOfBlocks[i]
        if (b?.[0] !== '.') {
            log(LOG_LEVELS.DEBUG, `Can we fit in ${b} (${b.length}) somewhere in the ${blocks.length} blocks?`)
            for (let x = 0; x < i; x++) {
                if (blocks[x]?.length >= b.length && blocks[x][0] === '.') {
                    log(LOG_LEVELS.DEBUG, `blocks[${x}].length (${blocks.length}) >= ${b.length}`)
                    const remainingBlocks = Array.from({length: blocks[x].length - b.length}, () => '.')
                    const blocksUpToReplacement = blocks.slice(0, x)
                    const replacement = b
                    const blocksUpToReplaceee = blocks.slice(x+1, i)
                    const replaceee = Array.from({length: b.length}, () => '.')
                    const blocksAfterReplacee = blocks.slice(i+1)
                    
                    // log(LOG_LEVELS.DEBUG, `Remainging .s to add: ${remainingBlocks}`)
                    log(LOG_LEVELS.DEBUG, `[${blocksUpToReplacement}, ${replacement}, ${remainingBlocks}, ${blocksUpToReplaceee}, ${replaceee}, ${blocksAfterReplacee}]`)
                    return {blocks: [...blocksUpToReplacement, replacement,  remainingBlocks, ...blocksUpToReplaceee, ...replaceee, ...blocksAfterReplacee].filter(a => a.length > 0), changed: true}
                }
            }
        }
    }

    return {blocks, changed:false}
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
let defragged = defrag(mapped);
while(defragged?.changed) {
    defragged = defrag(defragged.blocks)
}
log(LOG_LEVELS.INFO, defragged.changed, defragged?.blocks.flat())
log(LOG_LEVELS.INFO, checksum(defragged.blocks.flat()))
