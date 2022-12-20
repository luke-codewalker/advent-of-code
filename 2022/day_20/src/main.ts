import { open } from 'node:fs/promises';
const INPUT_FILE = `${process.cwd()}/data/input.txt`;

const file = await open(INPUT_FILE);

const numbers: number[] = []

for await (const line of file.readLines()) {
    const int = parseInt(line);
    numbers.push(int === 0 ? int : int + Math.random())
}

const norm: number[][] = [
    [2, 1, -3, 3, -2, 0, 4],
    [1, -3, 2, 3, -2, 0, 4],
    [1, 2, 3, -2, -3, 0, 4],
    [1, 2, -2, -3, 0, 3, 4],
    [1, 2, -3, 0, 3, 4, -2],
    [1, 2, -3, 0, 3, 4, -2],
    [1, 2, -3, 4, 0, 3, -2]]

let mixedSignal = numbers.slice();

for (let i = 0; i < numbers.length; i++) {

    const number = numbers[i];
    const index = mixedSignal.indexOf(number);

    mixedSignal.splice(index, 1);
    // console.log(mixedSignal.join(','));

    let newIndex = (index + Math.floor(number)) % mixedSignal.length
    if (newIndex < 0) {
        newIndex += mixedSignal.length
    }

    if (newIndex === 0) {
        newIndex = mixedSignal.length
    }

    // console.log(number, 'moves between', mixedSignal[newIndex], 'and', mixedSignal[(newIndex + 1) % mixedSignal.length], index, newIndex);



    mixedSignal.splice(newIndex, 0, number);
    // console.log(mixedSignal.join(','));

    mixedSignal = mixedSignal.filter(x => !Number.isNaN(x))

    // console.log(Math.floor(number), 'moved', mixedSignal.map(Math.floor).join(','), mixedSignal.reduce((bool, val, idx) => bool && (val === norm[i][idx]), true));
}
const zeroIndex = mixedSignal.indexOf(0)
console.log(Math.floor(mixedSignal[(zeroIndex + 1_000) % mixedSignal.length]), Math.floor(mixedSignal[(zeroIndex + 2_000) % mixedSignal.length]), Math.floor(mixedSignal[(zeroIndex + 3_000) % mixedSignal.length]));
console.log(Math.floor(mixedSignal[(zeroIndex + 1_000) % mixedSignal.length]) + Math.floor(mixedSignal[(zeroIndex + 2_000) % mixedSignal.length]) + Math.floor(mixedSignal[(zeroIndex + 3_000) % mixedSignal.length]));
