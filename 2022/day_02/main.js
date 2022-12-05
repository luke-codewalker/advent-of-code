import { open } from 'node:fs/promises';

/**
 * Rock     A, X
 * Paper    B, Y
 * Scissors C, Z
 */


const lookup1 = {};
lookup1['A'] = {}
lookup1['B'] = {}
lookup1['C'] = {}
lookup1['A']['X'] = 3 + 1
lookup1['A']['Y'] = 6 + 2
lookup1['A']['Z'] = 0 + 3
lookup1['B']['X'] = 0 + 1
lookup1['B']['Y'] = 3 + 2
lookup1['B']['Z'] = 6 + 3
lookup1['C']['X'] = 6 + 1
lookup1['C']['Y'] = 0 + 2
lookup1['C']['Z'] = 3 + 3

const lookup2 = {};
lookup2['A'] = {}
lookup2['B'] = {}
lookup2['C'] = {}
lookup2['A']['X'] = 0 + 3
lookup2['A']['Y'] = 3 + 1
lookup2['A']['Z'] = 6 + 2
lookup2['B']['X'] = 0 + 1
lookup2['B']['Y'] = 3 + 2
lookup2['B']['Z'] = 6 + 3
lookup2['C']['X'] = 0 + 2
lookup2['C']['Y'] = 3 + 3
lookup2['C']['Z'] = 6 + 1


const file = await open('./input.txt');
let score1 = 0;
let score2 = 0;
for await (const line of file.readLines()) {
    const [me, other] = line.split(' ')
    score1 += lookup1[me][other]
     score2 += lookup2[me][other]
}
console.log('part 1 total score is:', score1)
console.log('part 2 total score is:', score2)