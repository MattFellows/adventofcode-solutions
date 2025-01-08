import fs from 'fs'
import { parseImageFormat } from '../utils/sif'

const input = fs.readFileSync('./input.txt').toString()
const sif = parseImageFormat(input, 25, 6)

sif.toPNG('./output.png')
