import { open } from 'node:fs/promises';

const file = await open('./input.txt');

// magic numbers: convert the returned UTF-16 code unit to our own range of numbers for priority
const getPriority = (char) => char === char.toUpperCase() ? char.charCodeAt(0) - 65 + 27 :  char.charCodeAt(0) - 96 

// find all chars that are in both stirngs (passed in as array)
const findCommonCharsBetweenStrings = (stringArray1, stringArray2) => {
    return stringArray1.reduce((types, char) => {
        if(stringArray2.includes(char) && !types.includes(char)) {
            types.push(char);
        }
        return types;
    }, [])
}

// find the one (invariant!) char that is common between all strings
const findCommonChar = (stringsArray) => {
    const sortedArray = stringsArray.sort((a,b) => a.length - b.length);

    let commonTypes = findCommonCharsBetweenStrings(sortedArray[0].split(''), sortedArray[1].split(''))
    for (let i = 2; i < sortedArray.length; i++) {
        commonTypes = findCommonCharsBetweenStrings(commonTypes, sortedArray[i].split(''))
    }

    return commonTypes[0];
}

let commonTypeSum = 0;
let badgeSum = 0;
let currentGroup = [];
for await (const line of file.readLines()) {
    const halfWayIndex = Math.floor(line.length / 2)
    const firstHalf = line.substring(0, halfWayIndex);
    const secondHalf = line.substring(halfWayIndex);
    const commonType = findCommonChar([firstHalf, secondHalf])
    commonTypeSum += getPriority(commonType)

    currentGroup.push(line);
    if(currentGroup.length > 0 && currentGroup.length % 3 === 0) {
        badgeSum += getPriority(findCommonChar(currentGroup));
        currentGroup = []
    }
}

console.log('Part 1: The sum of priorities of common item types is:', commonTypeSum)
console.log('Part 2: The sum of priorities of badges is:', badgeSum)




