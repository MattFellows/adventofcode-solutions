let input, output

export const setInput = (i:number) => {
    input = i
}

export const getOutput = ():number => {
    return output
}

export const process = (program:number[]):number[] => {
    let execPtr = 0
    let resultantProgram = [...program]
    while (resultantProgram[execPtr] != 99) {
        const progPtr = processOpCode(resultantProgram, execPtr)
        console.log(progPtr)
        resultantProgram = progPtr[0]
        execPtr = progPtr[1]
    }
    return resultantProgram
}

export const getParameterPos = (p:number[],ptr:number,paramMode:number):number => {
    if (!paramMode || paramMode === 0) {
        return p[ptr]
    } else {
        return ptr
    }
}

export const getRelativeParamMode = (parameterModes:string,ptr:number):number => {
    return Number(parameterModes.split('').reverse()?.[ptr]||0)
}

export const processOpCode = (p:number[],ptr:number):[number[],number] => {
    console.log(`process: ${p[ptr]} (${ptr})`)
    const program = [...p]
    let ptrAfter = ptr
    let instruction = `${program[ptr]}`
    let opCode = parseInt(instruction.slice(-2).trim(), 10)
    let parameterModes = instruction.slice(0, instruction.length -2)
    switch (opCode) {
        case 1: {
            let param1Pos = getParameterPos(program, ptr+1, getRelativeParamMode(parameterModes, 0))
            let param2Pos = getParameterPos(program, ptr+2, getRelativeParamMode(parameterModes, 1))
            let param3Pos = getParameterPos(program, ptr+3, getRelativeParamMode(parameterModes, 2))

            program[param3Pos] = program[param1Pos] + program[param2Pos]
            ptrAfter = ptr + 4
            break
        }
        case 2: {
            let param1Pos = getParameterPos(program, ptr+1, getRelativeParamMode(parameterModes, 0))
            let param2Pos = getParameterPos(program, ptr+2, getRelativeParamMode(parameterModes, 1))
            let param3Pos = getParameterPos(program, ptr+3, getRelativeParamMode(parameterModes, 2))

            program[param3Pos] = program[param1Pos] * program[param2Pos]
            ptrAfter = ptr + 4
            break
        }
        case 3: {
            let param1Pos = getParameterPos(program, ptr+1, getRelativeParamMode(parameterModes, 0))
            console.log(`Input to : ${param1Pos}`)
            program[param1Pos] = input
            ptrAfter = ptr + 2
            break
        }
        case 4: {
            let param1Pos = getParameterPos(program, ptr+1, getRelativeParamMode(parameterModes, 0))

            output = program[param1Pos]
            ptrAfter = ptr + 2
            break
        }
        case 5: {
            let param1Pos = getParameterPos(program, ptr+1, getRelativeParamMode(parameterModes, 0))
            let param2Pos = getParameterPos(program, ptr+2, getRelativeParamMode(parameterModes, 1))
            console.log(`jump-if-true ${program[param1Pos]} (${program[param2Pos]})`)
            if (program[param1Pos] !== 0) {
                ptrAfter = program[param2Pos]
            } else {
                ptrAfter = ptr + 3
            }
            break
        }
        case 6: {
            let param1Pos = getParameterPos(program, ptr+1, getRelativeParamMode(parameterModes, 0))
            let param2Pos = getParameterPos(program, ptr+2, getRelativeParamMode(parameterModes, 1))
            console.log(`jump-if-false ${param1Pos} = ${program[param1Pos]} (${program[param2Pos]})`)
            if (program[param1Pos] === 0) {
                ptrAfter = program[param2Pos]
            } else {
                ptrAfter = ptr + 3
            }
            break
        }
        case 7: {
            let param1Pos = getParameterPos(program, ptr+1, getRelativeParamMode(parameterModes, 0))
            let param2Pos = getParameterPos(program, ptr+2, getRelativeParamMode(parameterModes, 1))
            let param3Pos = getParameterPos(program, ptr+3, getRelativeParamMode(parameterModes, 2))

            program[param3Pos] = program[param1Pos] < program[param2Pos] ? 1 : 0
            ptrAfter = ptr + 4
            break
        }
        case 8: {
            let param1Pos = getParameterPos(program, ptr+1, getRelativeParamMode(parameterModes, 0))
            let param2Pos = getParameterPos(program, ptr+2, getRelativeParamMode(parameterModes, 1))
            let param3Pos = getParameterPos(program, ptr+3, getRelativeParamMode(parameterModes, 2))

            program[param3Pos] = program[param1Pos] === program[param2Pos] ? 1 : 0
            ptrAfter = ptr + 4
            break
        }
    }
    console.log(ptrAfter)
    return [program, ptrAfter]
}