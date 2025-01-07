export const IntCode = () => {
    let input:number[]
    let output:number[]
    let program:number[]

    const setInput = (i:number[]) => {
        input = i
    }

    const getOutput = ():number[] => {
        return output
    }

    const setProgram = (p:number[]) => {
        program = p
    }
    
    const process = ():number[] => {
        output = []
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
    
    const getParameterPos = (p:number[],ptr:number,paramMode:number):number => {
        if (!paramMode || paramMode === 0) {
            return p[ptr]
        } else {
            return ptr
        }
    }
    
    const getRelativeParamMode = (parameterModes:string,ptr:number):number => {
        return Number(parameterModes.split('').reverse()?.[ptr]||0)
    }
    
    const processOpCode = (p:number[],ptr:number):[number[],number] => {
        // console.log(`process: ${p[ptr]} (${ptr})`)
        const currentProg = [...p]
        let ptrAfter = ptr
        let instruction = `${currentProg[ptr]}`
        let opCode = parseInt(instruction.slice(-2).trim(), 10)
        let parameterModes = instruction.slice(0, instruction.length -2)
        switch (opCode) {
            case 1: {
                let param1Pos = getParameterPos(currentProg, ptr+1, getRelativeParamMode(parameterModes, 0))
                let param2Pos = getParameterPos(currentProg, ptr+2, getRelativeParamMode(parameterModes, 1))
                let param3Pos = getParameterPos(currentProg, ptr+3, getRelativeParamMode(parameterModes, 2))
    
                currentProg[param3Pos] = currentProg[param1Pos] + currentProg[param2Pos]
                ptrAfter = ptr + 4
                break
            }
            case 2: {
                let param1Pos = getParameterPos(currentProg, ptr+1, getRelativeParamMode(parameterModes, 0))
                let param2Pos = getParameterPos(currentProg, ptr+2, getRelativeParamMode(parameterModes, 1))
                let param3Pos = getParameterPos(currentProg, ptr+3, getRelativeParamMode(parameterModes, 2))
    
                currentProg[param3Pos] = currentProg[param1Pos] * currentProg[param2Pos]
                ptrAfter = ptr + 4
                break
            }
            case 3: {
                let param1Pos = getParameterPos(currentProg, ptr+1, getRelativeParamMode(parameterModes, 0))
                // console.log(`Input to : ${param1Pos}`)
                currentProg[param1Pos] = input.pop()!
                ptrAfter = ptr + 2
                break
            }
            case 4: {
                let param1Pos = getParameterPos(currentProg, ptr+1, getRelativeParamMode(parameterModes, 0))
                console.log('Outputting: ', currentProg[param1Pos])
                output.push(currentProg[param1Pos])
                ptrAfter = ptr + 2
                break
            }
            case 5: {
                let param1Pos = getParameterPos(currentProg, ptr+1, getRelativeParamMode(parameterModes, 0))
                let param2Pos = getParameterPos(currentProg, ptr+2, getRelativeParamMode(parameterModes, 1))
                // console.log(`jump-if-true ${program[param1Pos]} (${program[param2Pos]})`)
                if (currentProg[param1Pos] !== 0) {
                    ptrAfter = currentProg[param2Pos]
                } else {
                    ptrAfter = ptr + 3
                }
                break
            }
            case 6: {
                let param1Pos = getParameterPos(currentProg, ptr+1, getRelativeParamMode(parameterModes, 0))
                let param2Pos = getParameterPos(currentProg, ptr+2, getRelativeParamMode(parameterModes, 1))
                // console.log(`jump-if-false ${param1Pos} = ${program[param1Pos]} (${program[param2Pos]})`)
                if (currentProg[param1Pos] === 0) {
                    ptrAfter = currentProg[param2Pos]
                } else {
                    ptrAfter = ptr + 3
                }
                break
            }
            case 7: {
                let param1Pos = getParameterPos(currentProg, ptr+1, getRelativeParamMode(parameterModes, 0))
                let param2Pos = getParameterPos(currentProg, ptr+2, getRelativeParamMode(parameterModes, 1))
                let param3Pos = getParameterPos(currentProg, ptr+3, getRelativeParamMode(parameterModes, 2))
    
                currentProg[param3Pos] = currentProg[param1Pos] < currentProg[param2Pos] ? 1 : 0
                ptrAfter = ptr + 4
                break
            }
            case 8: {
                let param1Pos = getParameterPos(currentProg, ptr+1, getRelativeParamMode(parameterModes, 0))
                let param2Pos = getParameterPos(currentProg, ptr+2, getRelativeParamMode(parameterModes, 1))
                let param3Pos = getParameterPos(currentProg, ptr+3, getRelativeParamMode(parameterModes, 2))
    
                currentProg[param3Pos] = currentProg[param1Pos] === currentProg[param2Pos] ? 1 : 0
                ptrAfter = ptr + 4
                break
            }
        }
        // console.log(ptrAfter)
        return [currentProg, ptrAfter]
    }

    return {setInput, setProgram, getOutput, process}
}