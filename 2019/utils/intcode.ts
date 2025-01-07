import { sleep } from "./utils"

export const IntCode = (p?:number[]) => {
    let input:number[] = []
    let output:number[] = []
    let program:number[] = []
    let outputListeners:((o:number) => void)[] = []
    let execPtr:number = 0
    let name:string = ''
    let paused:boolean = false

    const setName = (s:string) => {
        name = s
    }

    const registerOutputHandler = (f: (o:number) => void) => {
        outputListeners.push(f)
    }

    const togglePause = () => {
        paused = !paused
    }

    const setInput = (i:number[]) => {
        // console.log(name, 'Setting Input to: ', i)
        input = [...i]
    }

    const addInput = (i:number) => {
        // console.log(name, 'Adding to Input: ', i)
        input.push(i)
    }

    const getOutput = ():number[] => {
        return [...output]
    }

    const awaitOutput = async():Promise<number[]> => {
        // console.log('WAIT FOR OUTPUT')
        while (!output || output.length <= 0) {
            // console.log(name, 'Waiting: ', output)
            await sleep(10)
            // console.log(name, 'Waited: ', output)
        }
        const actualOutput = [...output]
        output = []
        return actualOutput
    }

    const awaitInput = async():Promise<number> => {
        while (!input || input.length <= 0) {
            // console.log(name, 'Waiting: ', input)
            await sleep(10)
            // console.log(name, 'Waited: ', input)
        }
        // console.log(name, 'Waited for:', input)
        return input.shift()!
    }

    const setProgram = (p:number[]) => {
        program = [...p]
    }
    
    const didHalt = () => {
        return program[execPtr] === 99
    }

    const process = async ():Promise<number[]> => {
        output = []
        let lastExecPtr = -1
        let resultantProgram = [...program]
        while (resultantProgram[execPtr] !== 99 && lastExecPtr !== execPtr) {
            while (paused){await sleep(1000)}
            const progPtr = await processOpCode(resultantProgram, execPtr)
            // console.log(name, progPtr)
            resultantProgram = progPtr[0]
            lastExecPtr = execPtr
            execPtr = progPtr[1]
        }
        if (resultantProgram[execPtr] === 99) {
            // console.log(name, 'HALTING!')
        }
        program = [...resultantProgram]
        return [...resultantProgram]
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
    
    const processOpCode = async (p:number[],ptr:number):Promise<[number[],number]> => {
        // console.log(name, `process: ${p[ptr]} (${ptr})`)
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
                const nextInput = await awaitInput()
                // console.log(name, `Input to : ${param1Pos} (${nextInput})`)
                currentProg[param1Pos] = nextInput
                ptrAfter = ptr + 2
                break
            }
            case 4: {
                let param1Pos = getParameterPos(currentProg, ptr+1, getRelativeParamMode(parameterModes, 0))
                // console.log(name, 'Outputting: ', currentProg[param1Pos])
                output.push(currentProg[param1Pos])
                outputListeners.forEach(f => f(currentProg[param1Pos]))
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
        // console.log(name, ptrAfter)
        return [currentProg, ptrAfter]
    }

    return {setName, registerOutputHandler, setInput, addInput, setProgram, process, getOutput, didHalt, awaitOutput, togglePause}
}