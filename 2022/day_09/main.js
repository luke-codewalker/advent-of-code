import { open } from 'node:fs/promises';
const input = await open('./test.txt');

const instructions = []
for await (const line of input.readLines()) {
    let [direction, amount] = line.split(' ')
    amount = parseInt(amount)
    instructions.push({ direction, amount })
}


const move = (direction, head) => {
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



const follow = (head, tail) => {
    let { headX, headY } = head;
    let { tailX, tailY } = tail;


}

let head = { x: 0, y: 0 }
let tail = { x: 0, y: 0 }