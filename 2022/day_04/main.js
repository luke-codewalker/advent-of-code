import { open } from 'node:fs/promises';

class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    static fromString(string) {
        const [start, end] = string.split('-');
        return new Range(parseInt(start), parseInt(end))
    }

    fullyContains(otherRange) {
        return this.start <= otherRange.start && this.end >= otherRange.end;
    }

    overlaps(otherRange) {
        return otherRange.start >= this.start && otherRange.start <= this.end || otherRange.end >= this.start && otherRange.end <= this.end;
    }
}

const file = await open('./input.txt');

let fullCount = 0;
let overlapCount = 0;
for await (const line of file.readLines()) {
    const pair = line.split(',').map(string => Range.fromString(string));
    if (pair[0].fullyContains(pair[1]) || pair[1].fullyContains(pair[0])) {
        fullCount += 1;
    }

    if (pair[0].overlaps(pair[1]) || pair[1].overlaps(pair[0])) {
        overlapCount += 1;
    }

}
console.log(`There are ${fullCount} fully overlapping pairs`);
console.log(`There are ${overlapCount} (partially) overlapping pairs`);