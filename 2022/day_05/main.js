import { open } from 'node:fs/promises';

class CargoBay {
    constructor(stacks) {
        this.stacks = stacks;
    }

    addStackFromString(string) {
        this.stacks.push(string.split(''))
    }

    moveCrates(quantity, from, to) {
        for (let i = 0; i < quantity; i++) {
            this.stacks[to - 1].push(this.stacks[from - 1].pop())
        }
    }

    moveCrates9001(quantity, from, to) {
        this.stacks[to - 1].push(...this.stacks[from - 1].splice(-quantity))
    }

    getTopCratesAsString() {
        return this.stacks.map(stack => stack.slice(-1)).join('')
    }
}

const cargoBay = new CargoBay([]);
const crates = await open('./crates.txt');
for await (const line of crates.readLines()) {
    cargoBay.addStackFromString(line)
}
console.log(cargoBay);

const instructions = await open('./instructions.txt');
for await (const line of instructions.readLines()) {
    // cargoBay.moveCrates(...line.match(/(\d+)/g).map(x => parseInt(x)))
    cargoBay.moveCrates9001(...line.match(/(\d+)/g).map(x => parseInt(x)))
}
console.log(cargoBay);
console.log(cargoBay.getTopCratesAsString());