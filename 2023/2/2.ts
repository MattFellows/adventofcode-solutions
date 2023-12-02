import fs from 'fs';
import path from 'path';

interface Colour {
  red: number
  green: number
  blue: number
}

const NUM_RED_CUBES = 12
const NUM_GREEN_CUBES = 13
const NUM_BLUE_CUBES = 14

const bufferFile = (relPath:string):Buffer => {
    return fs.readFileSync(path.join(__dirname, relPath)); 
}

const extractColours = (line:string):Colour[] => {
  return line
    .substring(line.indexOf(":") + 1)
    .split(";")
    .map(part => part.trim())
    .map(part => {
      const colours = part.split(",").map(colour => colour.trim());
      //console.log(colours)
      let red = 0;
      let green = 0;
      let blue = 0;
      colours.forEach(colour => {
        if (colour.indexOf('red') > -1) {
          //console.log(colour + ":" + colour.substring(0, colour.indexOf('red')))
          red += parseInt(colour.substring(0, colour.indexOf('red')), 10);
        }
        if (colour.indexOf('green') > -1) {
          //console.log(colour + ":" + colour.substring(0, colour.indexOf('green')))
          green += parseInt(colour.substring(0, colour.indexOf('green')), 10);
        }
        if (colour.indexOf('blue') > -1) {
          //console.log(colour + ":" + colour.substring(0, colour.indexOf('blue')))
          blue += parseInt(colour.substring(0, colour.indexOf('blue')), 10);
        }
      });
      //console.log({red, green, blue})
      return { red, green, blue };
    });
}

const processPartTwo = (lines:Buffer):number => {
  const result = lines.toString().split("\n").map(line => {
    const gameId = line.substring(4, line.indexOf(":"))
    let maxRed = 0;
    let maxGreen = 0;
    let maxBlue = 0;
    const parts = extractColours(line)
      .forEach(colourPart => {
        if (colourPart.red > maxRed) {
          maxRed = colourPart.red
        }
        if (colourPart.green > maxGreen) {
          maxGreen = colourPart.green
        }
        if (colourPart.blue > maxBlue) {
          maxBlue = colourPart.blue
        }
      })

      if (maxRed <= NUM_RED_CUBES && maxBlue <= NUM_BLUE_CUBES && maxGreen <= NUM_GREEN_CUBES) {
        //console.log(`TRUE: ${line}`)
        return parseInt(gameId, 10)
      }

      //console.log(`FALSE: ${line}`)
      //console.log(`Red: ${maxRed} < ${NUM_RED_CUBES}, Green: ${maxBlue} < ${NUM_BLUE_CUBES}, Blue: ${maxGreen} < ${NUM_GREEN_CUBES},`)
      return 0


  })

  return result.reduce((sum, cur) => sum + cur)

}

const processPartOne = (lines:Buffer):number => {
  const result = lines.toString().split("\n").map(line => {
    const gameId = line.substring(4, line.indexOf(":"))
    let maxRed = 0;
    let maxGreen = 0;
    let maxBlue = 0;
    const parts = extractColours(line)
      .forEach(colourPart => {
        if (colourPart.red > maxRed) {
          maxRed = colourPart.red
        }
        if (colourPart.green > maxGreen) {
          maxGreen = colourPart.green
        }
        if (colourPart.blue > maxBlue) {
          maxBlue = colourPart.blue
        }
      })

      //console.log(`${line}: Red: ${maxRed} Green: ${maxGreen} Blue: ${maxBlue} Total: ${(maxRed||1) * (maxGreen||1) * (maxBlue||1)}`)
      return (maxRed||1) * (maxGreen||1) * (maxBlue||1)
  })

  return result.reduce((sum, cur) => sum + cur)

}

const BUFFER = bufferFile('./input.txt');
console.log(processPartOne(BUFFER))
console.log(processPartTwo(BUFFER))


