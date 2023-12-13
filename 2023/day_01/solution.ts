// Advent of Code solution for 01.12.2023
const puzzleInput = await Deno.readTextFile(Deno.cwd() + "/2023/day_01/data/input.txt");
const testData = await Deno.readTextFile(Deno.cwd() + "/2023/day_01/data/test.txt");

// Part 1
const lines = puzzleInput.trim().split('\n');

// const numbers = lines.map((line, index) => {
//     console.log(index, line, line.match(/\d/), line.match(/.*(\d)/))
//     const firstDigit = line.match(/\d/)![0];
//     const lastDigit = line.match(/.*(\d)/)![1];
//     return Number.parseInt(firstDigit + lastDigit);
// })

// const sum = numbers.reduce((sum, num) => sum + num);

// console.log(`First part: ${sum}`);


// Part 2
const numberWords = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
}

const numbers2 = lines.map((line, index) => {
    const digitRegex = `(\\d|one|two|three|four|five|six|seven|eight|nine)`
    console.log(index, line, line.match(new RegExp(digitRegex)), line.match(new RegExp(`.*${digitRegex}`)))
    const firstDigit = line.match(new RegExp(digitRegex))![1];
    const lastDigit = line.match(new RegExp(`.*${digitRegex}`))![1];

    const firstNumber = Number.isNaN(Number.parseInt(firstDigit)) ? numberWords[firstDigit as keyof typeof numberWords ] : Number.parseInt(firstDigit);
    const lastNumber = Number.isNaN(Number.parseInt(lastDigit)) ? numberWords[lastDigit as keyof typeof numberWords ] : Number.parseInt(lastDigit);

    return firstNumber * 10 + lastNumber;
})

const sum2 = numbers2.reduce((sum, num) => sum + num);

console.log(`Second part: ${sum2}`);