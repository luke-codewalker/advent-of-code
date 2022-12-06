import { readFileSync } from 'node:fs';

const allDistinct = (charArray) => {
    let result = true;
    for (let i = 0; i < charArray.length; i++) {
        const otherChars = charArray.slice();
        otherChars.splice(i, 1);
        result = result && !otherChars.includes(charArray[i])
    }
    return result;
}

const chars = readFileSync('./input.txt', 'utf-8');
const buffer = [];
// const BUFFER_MAX_LENGTH = 4 // Part 1
const BUFFER_MAX_LENGTH = 14 // Part 2
let processedChars = 0;
for (const char of chars) {
    console.log(buffer, processedChars);
    processedChars++;
    buffer.push(char);
    if(buffer.length > BUFFER_MAX_LENGTH) {
        buffer.shift()
    }

    if(buffer.length >= BUFFER_MAX_LENGTH && allDistinct(buffer)) {
        break;
    }
}

console.log(buffer, processedChars);