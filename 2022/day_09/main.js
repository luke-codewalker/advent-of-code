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

let rope = [
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
]

const dist = (pos1, pos2) => {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
}


const findClosestNeighbour = (head, tail) => {
    const neighbours = [
        { x: head.x - 1, y: head.y },
        { x: head.x + 1, y: head.y },
        { x: head.x, y: head.y - 1 },
        { x: head.x, y: head.y + 1 }
    ]
    const closestNeighbour = neighbours.reduce((currentClosest, neighbour) => {
        const oldDistance = dist(currentClosest, tail)
        const distance = dist(neighbour, tail)
        if (distance < oldDistance) {
            currentClosest = neighbour
        }

        return currentClosest
    })

    return closestNeighbour
}


const findAnyNeighbour = (head, tail) => {
    const neighbours = [
        { x: head.x - 1, y: head.y },
        { x: head.x + 1, y: head.y },
        { x: head.x + 1, y: head.y + 1 },
        { x: head.x - 1, y: head.y - 1 },
        { x: head.x + 1, y: head.y - 1 },
        { x: head.x - 1, y: head.y + 1 },
        { x: head.x, y: head.y - 1 },
        { x: head.x, y: head.y + 1 }
    ]
    const closestNeighbour = neighbours.reduce((currentClosest, neighbour) => {
        const oldDistance = dist(currentClosest, tail)
        const distance = dist(neighbour, tail)
        if (distance < oldDistance) {
            currentClosest = neighbour
        }

        return currentClosest
    })

    return closestNeighbour
}

// Part 1
for (const instruction of instructions) {
    const { direction, amount } = instruction;
    for (let i = 0; i < amount; i++) {
        const headPath = rope[0]
        const head = headPath.slice(-1)[0]
        const newHead = moveHead(direction, head)
        headPath.push(newHead)
        const tailPath = rope[1]
        const tail = tailPath.slice(-1)[0]
        const distance = dist(head, tail)
        if (headPath.length > tailPath.length && distance >= 2 && distance < 2.5) {
            tailPath.push(findClosestNeighbour(head, tail))
        } else if (distance >= 2.5) {
            tailPath.push(findAnyNeighbour(head, tail))
        }
    }
}

const tailPath = rope[1]
let uniquePositions = new Set(tailPath.map(pos => `${pos.x},${pos.y}`))
console.log(`1: There are ${uniquePositions.size} positions the tail visited at least once`);


// Part 2
rope = [
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
    [{ x: 0, y: 0 }],
]

for (const instruction of instructions) {
    const { direction, amount } = instruction;
    for (let i = 0; i < amount; i++) {
        const headPath = rope[0]
        const head = headPath.slice(-1)[0]
        const newHead = moveHead(direction, head)
        headPath.push(newHead)


        for (let i = 1; i < rope.length; i++) {
            const headPath = rope[i - 1]
            const tailPath = rope[i]

            const head = headPath.slice(-1)[0]
            const tail = tailPath.slice(-1)[0]

            const distance = dist(head, tail)
            if (headPath.length > tailPath.length && distance >= 2 && distance < 2.5) {
                tailPath.push(findClosestNeighbour(head, tail))
            } else if (distance >= 2.5) {
                tailPath.push(findAnyNeighbour(head, tail))
            }
        }

    }
}

const newTailPath = rope[rope.length - 1]
uniquePositions = new Set(newTailPath.map(pos => `${pos.x},${pos.y}`))
console.log(`2: There are ${uniquePositions.size} positions the tail visited at least once`);
