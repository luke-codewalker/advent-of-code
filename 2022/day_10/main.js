import { open } from 'node:fs/promises';

const input = await open('./input.txt');
const instructions = []
for await (const line of input.readLines()) {
    instructions.push(line)
}

// Part 1
let xRegister = 1;
let cycles = 0;
const signalStrengths = []

for await (const instruction of instructions) {
    let xToAdd = 0
    let cyclesToAdd = 0
    if (instruction === 'noop') {
        cyclesToAdd = 1
    } else {
        const amount = parseInt(instruction.split(' ')[1])
        cyclesToAdd = 2
        xToAdd = amount
    }

    for (let i = 0; i < cyclesToAdd; i++) {
        cycles++

        if (cycles % 40 === 20) {
            signalStrengths.push(cycles * xRegister)
        }
    }

    xRegister += xToAdd
}

console.log('Sum of collected signal strenghts:', signalStrengths.reduce((sum, x) => sum + x));


// Part 2
xRegister = 1;
cycles = 0;
const crt = []
let crtRow = ''

for await (const instruction of instructions) {
    let xToAdd = 0
    let cyclesToAdd = 0
    if (instruction === 'noop') {
        cyclesToAdd = 1
    } else {
        const amount = parseInt(instruction.split(' ')[1])
        cyclesToAdd = 2
        xToAdd = amount
    }

    for (let i = 0; i < cyclesToAdd; i++) {
        const crtPos = cycles % 40
        if (crtPos >= xRegister - 1 && crtPos <= xRegister + 1) {
            crtRow += '#'
        } else {
            crtRow += ' '
        }


        cycles++

        if (cycles % 40 === 0) {
            crt.push(crtRow)
            crtRow = ''
        }
    }

    xRegister += xToAdd
}
console.log(`CRT says:\n${crt.join('\n')}`);