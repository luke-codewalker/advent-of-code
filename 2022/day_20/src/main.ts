import { open } from 'node:fs/promises';
const INPUT_FILE = `${process.cwd()}/data/input.txt`;

const file = await open(INPUT_FILE);

const numbers: number[] = []

for await (const line of file.readLines()) {
    numbers.push(parseInt(line))
}

const reference: number[][] = [
    [2, 1, -3, 3, -2, 0, 4],
    [1, -3, 2, 3, -2, 0, 4],
    [1, 2, 3, -2, -3, 0, 4],
    [1, 2, -2, -3, 0, 3, 4],
    [1, 2, -3, 0, 3, 4, -2],
    [1, 2, -3, 0, 3, 4, -2],
    [1, 2, -3, 4, 0, 3, -2]]

const mix = (numbers: number[], mixedNumbers: number[], repetitions = 1): number[] => {
    for (let _ = 0; _ < repetitions; _++) {

        for (let i = 0; i < numbers.length; i++) {

            const number = numbers[i];
            const index = mixedNumbers.indexOf(number);

            mixedNumbers.splice(index, 1);
            // console.log(mixedSignal.join(','));

            let newIndex = (index + Math.floor(number))
            if (newIndex < 0) {
                newIndex = newIndex % mixedNumbers.length + mixedNumbers.length
            } else {
                newIndex = newIndex % mixedNumbers.length
            }

            // console.log(number, 'moves between', mixedNumbers[newIndex], 'and', mixedNumbers[(newIndex + 1) % mixedNumbers.length], index, newIndex);



            mixedNumbers.splice(newIndex, 0, number);
            // console.log(mixedNumbers.join(','));

            // console.log(Math.floor(number), 'moved', mixedNumbers.map(Math.floor).join(','), mixedNumbers.reduce((bool, val, idx) => bool && (val === norm[i][idx]), true));
        }
    }

    return mixedNumbers
}


const part1Numbers = numbers.map(x => x === 0 ? x : x + Math.random());
const mixedSignal1 = mix(part1Numbers, part1Numbers.slice())
const zeroIndex = mixedSignal1.indexOf(0)
console.log(Math.floor(mixedSignal1[(zeroIndex + 1_000) % mixedSignal1.length]), Math.floor(mixedSignal1[(zeroIndex + 2_000) % mixedSignal1.length]), Math.floor(mixedSignal1[(zeroIndex + 3_000) % mixedSignal1.length]));
console.log(Math.floor(mixedSignal1[(zeroIndex + 1_000) % mixedSignal1.length]) + Math.floor(mixedSignal1[(zeroIndex + 2_000) % mixedSignal1.length]) + Math.floor(mixedSignal1[(zeroIndex + 3_000) % mixedSignal1.length]));


// Part 2
const key = 811589153;
let part2Numbers = numbers.slice();
part2Numbers = part2Numbers.map(n => n === 0 ? n : n + Math.random())
part2Numbers = part2Numbers.map(n => n * key)
const mixedSignal2 = mix(part2Numbers, part2Numbers.slice(), 10)
console.log(mixedSignal2);

const zeroIndex2 = mixedSignal2.indexOf(0)
console.log('###', zeroIndex2, mixedSignal2.length);

console.log(Math.floor(mixedSignal2[(zeroIndex2 + 1_000) % mixedSignal2.length]), Math.floor(mixedSignal2[(zeroIndex2 + 2_000) % mixedSignal2.length]), Math.floor(mixedSignal2[(zeroIndex2 + 3_000) % mixedSignal2.length]));
console.log(Math.floor(mixedSignal2[(zeroIndex2 + 1_000) % mixedSignal2.length]) + Math.floor(mixedSignal2[(zeroIndex2 + 2_000) % mixedSignal2.length]) + Math.floor(mixedSignal2[(zeroIndex2 + 3_000) % mixedSignal2.length]));

