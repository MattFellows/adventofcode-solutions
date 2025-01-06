export const process = (program:number[]):number[] => {
    let execPtr = 0
    let resultantProgram = [...program]
    while (resultantProgram[execPtr] != 99) {
        resultantProgram = processOpCode(resultantProgram, execPtr)
        execPtr += 4
    }
    return resultantProgram
}

export const processOpCode = (p:number[],ptr:number):number[] => {
    const program = [...p]
    switch (program[ptr]) {
        case 1:
            // console.log(`${program[program[ptr+1]]} + ${program[program[ptr+2]]} => ${program[program[ptr+3]]}`)
            program[program[ptr+3]] = program[program[ptr+1]] + program[program[ptr+2]]
            break
        case 2:
            program[program[ptr+3]] = program[program[ptr+1]] * program[program[ptr+2]]
            break
    }
    return program
}