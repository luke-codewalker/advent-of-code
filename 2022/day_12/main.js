import { open } from 'node:fs/promises';

const map = []
const input = await open('./input.txt');
for await (const line of input.readLines()) {
    const row = line.split('').map(char => ({
        char,
        isStart: char === 'S',
        isTarget: char === 'E',
        visited: char === 'S' ? true : false,
        distance: char === 'S' ? 0 : Infinity,
        previousNode: undefined,
        neighbours: []
    }))
    map.push(row)
}

const alphabet = "SabcdefghijklmnopqrstuvwxyzE"
const calculateDistance = (a, b) => Math.abs(alphabet.indexOf(b) - alphabet.indexOf(a) + 1)

const queue = []
for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
        const node = map[x][y];
        const neighbours = [];
        [[-1, 0], [1, 0], [0, 1], [0, -1]].forEach(([i, j]) => {
            const neighbour = map[x + i]?.[y + j]
            if (neighbour && (alphabet.indexOf(neighbour.char) - alphabet.indexOf(node.char)) <= 1) {
                neighbours.push(neighbour)
            }
        })
        node.neighbours = neighbours;
        queue.push(node)
    }
}

const target = queue.find(n => n.isTarget)
while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance)

    const currentClosest = queue.shift()

    currentClosest.visited = true

    if (currentClosest === target) {
        break
    }

    for (const neighbour of currentClosest.neighbours) {
        if (!neighbour.visited) {
            const newDistance = currentClosest.distance + calculateDistance(currentClosest.char, neighbour.char)
            if (newDistance < neighbour.distance) {
                neighbour.distance = newDistance
                neighbour.previousNode = currentClosest
            }
        }
    }
}

let n = target
const path = []
while (n.previousNode) {
    path.unshift(n.char)
    n = n.previousNode
}
console.log(path, path.length);