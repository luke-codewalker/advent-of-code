import { open } from 'node:fs/promises';
const INPUT_FILE = `${process.cwd()}/data/test.txt`;

const file = await open(INPUT_FILE);

const numbers: number[] = []
for await (const line of file.readLines()) {
    numbers.push(parseInt(line))
}

const moveElement = (array: number[], from: number, to: number): number[] => {
    const number = array.splice(from, 1)[0];
    array.splice(to, 0, number);
    return array;
}

const findNewIndex = (index: number, number: number, arrayLength: number): number => {
    const newIndex = (index + number) % arrayLength;    
    if (newIndex < 0) { 
        return newIndex + arrayLength;
    } else {
        return newIndex;
    }
}



let part1Numbers = numbers.slice();
for (let i = 0; i < part1Numbers.length; i++) {
    const number = numbers[i];
    const newIndex = findNewIndex(part1Numbers.indexOf(number), number, numbers.length);
    console.log(number, 'moves between', part1Numbers[newIndex], 'and', part1Numbers[newIndex + 1], 'from', part1Numbers.indexOf(number), 'to', newIndex);
    
    part1Numbers = moveElement(part1Numbers, part1Numbers.indexOf(number), newIndex);
    console.log(part1Numbers.join(','));
    
}

console.log(part1Numbers);
