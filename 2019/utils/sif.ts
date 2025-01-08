import { createWriteStream } from 'fs'
import { PNG } from 'pngjs'

export interface Layer {
    digits:number[]
    countsMap:Map<number,number>
}

export interface SIF {
    layers:Layer[]
    toPNG:(fileName:string) => void
}

export const parseImageFormat = (digitsStr:string, width:number, height:number):SIF => {
    const layers:Layer[] = []
    const allDigits = digitsStr.split('').map(Number)
    const layerLength = width * height
    let layerId = -1
    let layer;
    allDigits.forEach((d,i) => {
        const curLayerId = Math.floor(i/layerLength)
        // console.log(curLayerId)
        if (curLayerId != layerId) {
            if (layer){
                layers.push(layer)
            }
            layer = {digits:[],countsMap:new Map<number,number>()}
            layerId = curLayerId
        }
        layer.digits.push(d)
        layer.countsMap.set(d, (layer.countsMap.get(d)??0)+1)
    })
    layers.push(layer)

    const resolvePixelVal = (x:number,y:number):number => {
        const idx = (width * y + x)
        const allPixels = layers.map(l => {
            console.log(l.digits, idx)
            return l.digits[idx]
        })
        console.log(allPixels, idx, x, y)
        let colour = 2
        for (let i = 0; i < allPixels.length; i++) {
            if ((allPixels[i] === 2 && colour === 2) || colour !== 2) {
                continue
            }
            colour = allPixels[i]
        }
        console.log()
        console.log(`${x},${y} => ${colour}`)
        console.log()
        return colour
    }

    const toPNG = async (fileName:string) => {
        const png = new PNG({width, height})
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (width * y + x) << 2
                const resolvedPixelVal = resolvePixelVal(x,y)
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

    return {layers,toPNG}
}