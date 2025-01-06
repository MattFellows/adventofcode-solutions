import fs from 'fs'

const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())

const setup = lines.filter(l => l.indexOf(':') > -1)
const instructions = lines.filter(l => l.indexOf('->') > -1)

interface Instruction {
    input1:Wire
    input2:Wire
    output:Wire
    operation:(w1:Wire,w2:Wire) => number
    operationName:string
}

interface Wire {
    name:string
    value?:number
    valueFrom?:Instruction
}

const And = (w1:Wire,w2:Wire):number => {
    // console.log(`${w1.value} And ${w2.value}`)
    if (w1.value === 1 && w2.value === 1) {
        return 1
    }
    return 0
}

const Or = (w1:Wire,w2:Wire):number => {
    // console.log(`${w1.value} Or ${w2.value}`)
    if (w1.value === 1 || w2.value === 1) {
        return 1
    }
    return 0
}

const Xor = (w1:Wire,w2:Wire):number => {
    // console.log(`${w1.value} Xor ${w2.value}`)
    if (w1.value === 1 && w2.value === 0) {
        return 1
    }
    if (w1.value === 0 && w2.value === 1) {
        return 1
    }
    return 0
}


const parseInstruction = (i:string,currentWires:Map<string,Wire>):Instruction => {
    const newWires:Wire[] = []
    // tnw OR pbm -> gnj
    const destinationWireName = i.split('->')[1].trim()
    const instruction = i.split('->')[0].trim().split(' ')
    const inputWire1Name = instruction[0]
    const instructionOp = instruction[1]
    const inputWire2Name = instruction[2]
    let destinationWire:Wire, inputWire1:Wire, inputWire2:Wire
    if (currentWires.has(destinationWireName)) {
        destinationWire = currentWires.get(destinationWireName)!
    } else {
        destinationWire = { name: destinationWireName }
        currentWires.set(destinationWireName, destinationWire)
    }
    if (currentWires.has(inputWire1Name)) {
        inputWire1 = currentWires.get(inputWire1Name)!
    } else {
        inputWire1 = { name: inputWire1Name }
        currentWires.set(inputWire1Name, inputWire1)
    }
    if (currentWires.has(inputWire2Name)) {
        inputWire2 = currentWires.get(inputWire2Name)!
    } else {
        inputWire2 = { name: inputWire2Name }
        currentWires.set(inputWire2Name, inputWire2)
    }
    destinationWire.valueFrom = { input1: inputWire1, input2: inputWire2, output: destinationWire, operation: instructionOp === 'OR' ? Or : instructionOp === 'AND' ? And : Xor, operationName: instructionOp }
    return destinationWire.valueFrom
}

const setupWires = setup.map(s => {
    const wire:Wire = { name: s.split(':')[0].trim() }
    wire.value = Number(s.split(':')[1].trim())
    return wire
})

const allWires:Map<string,Wire> = new Map();
setupWires.forEach(w => {
    // console.log(`Adding ${w.name}`)
    allWires.set(w.name.trim(), w)
})

const allInstructions:Instruction[] = instructions.map(i => {
    return parseInstruction(i, allWires)
})

const resolveValue = (w:Wire, allWires:Map<string,Wire>):Wire => {
    // console.log(`${w.name} from ${w.valueFrom?.input1.name} ${w.valueFrom?.operationName} ${w.valueFrom?.input2.name}`)
    if (w.value !== undefined) {
        // console.log(`Resolved: ${w.value}`)
        return w
    }
    if (!w.valueFrom) {
        throw new Error(`Unable to resolve value for wire: ${w.name}`)
    }
    if (!w.valueFrom.input1.value) {
        w.valueFrom.input1 = resolveValue(w.valueFrom.input1, allWires)
        // console.log(`Recursive Resolved ${w.valueFrom.input1.name}: ${w.valueFrom.input1.value}`)
    }
    if (!w.valueFrom.input2.value) {
        w.valueFrom.input2 = resolveValue(w.valueFrom.input2, allWires)
        // console.log(`Recursive Resolved ${w.valueFrom.input2.name}: ${w.valueFrom.input2.value}`)
    }
    w.value = w.valueFrom.operation(w.valueFrom.input1, w.valueFrom.input2)
    // console.log(`Locally Resolved ${w.name}: ${w.value}`)
    return w
}

const unresolvedZWires = [...allWires.keys()].filter(k => k.startsWith('z')).sort()

// resolveValue(allWires.get('z00')!, allWires)

const resolvedZWires = unresolvedZWires.map(k => resolveValue(allWires.get(k)!, allWires))
console.log(resolvedZWires)
console.log(parseInt(resolvedZWires.map(w => `${w.value}`).reverse().join(''), 2))