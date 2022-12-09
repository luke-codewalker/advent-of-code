import { open } from 'node:fs/promises';
const input = await open('./input.txt');

const instructions = []
for await (const line of input.readLines()) {
    let [direction, amount] = line.split(' ')
    amount = parseInt(amount)
    instructions.push({ direction, amount })
}

const moveHead = (direction, head) => {
    let { x, y } = head;
    switch (direction) {
        case 'R':
            x++
            break;

        case 'L':
            x--
            break;

        case 'U':
            y++
            break;

        case 'D':
            y--
            break;
    }
    return { x, y }
}

const headPath = [{ x: 0, y: 0 }]
const tailPath = [{ x: 0, y: 0 }]

const dist = (pos1, pos2) => {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
}


for (const instruction of instructions) {
    const { direction, amount } = instruction;
    for (let i = 0; i < amount; i++) {
        const head = headPath.slice(-1)[0]
        const newHead = moveHead(direction, head)
        headPath.push(newHead)
        const tail = tailPath.slice(-1)[0]
        if (headPath.length > tailPath.length && dist(newHead, tail) >= 2) {
            tailPath.push(headPath.slice(-2)[0])
        }
    }
}

// Part 1
const uniquePositions = new Set(tailPath.map(pos => `${pos.x},${pos.y}`))
console.log(`There are ${uniquePositions.size} positions the tail visited at least once`);
