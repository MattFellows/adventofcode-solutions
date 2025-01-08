import fs from 'fs'
import { parseImageFormat } from '../utils/sif'

const input = fs.readFileSync('./input.txt').toString()
const sif = parseImageFormat(input, 25, 6)

const counts = sif.layers.map(l => l.countsMap).sort((l1,l2) => (l1.get(0)??0) - (l2.get(0)??0))
const leastZeroesLayer = counts[0]
console.log(counts)
console.log((leastZeroesLayer.get(1)??0) * (leastZeroesLayer.get(2)??0))
