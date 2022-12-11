import { open } from 'node:fs/promises';

const makeValue = (x) => () => x
const makeAdd = (x) => (y) => {
    return makeValue(x + y)
}
const makeMultiply = (x) => (y) => {
    return makeValue(x * y)
}
const makeDivide = (x) => (y) => {
    return makeValue(x / y)
}
const makeSubtract = (x) => (y) => {
    return makeValue(x - y)
}

class Monkey {
    constructor(monkeyDescriptionString) {
        const itemsString = monkeyDescriptionString.match(/Starting items: (\d+.*)/)[1] ?? '';
        this.items = itemsString.split(',').map(x => parseInt(x))

        const operationString = monkeyDescriptionString.match(/Operation: new = (.*)/)[1] ?? ''
        this.operation = operationString.split(' ').map(o => Number.isNaN(parseInt(o)) ? o : parseInt(o))

        const testString = monkeyDescriptionString.match(/Test: divisible by (\d+)/)[1] ?? ''
        this.testDivider = parseInt(testString)

        const trueMonkeyString = monkeyDescriptionString.match(/If true: throw to monkey (\d+)/)[1] ?? ''
        this.trueMonkeyIndex = parseInt(trueMonkeyString)

        const falseMonkeyString = monkeyDescriptionString.match(/If false: throw to monkey (\d+)/)[1] ?? ''
        this.falseMonkeyIndex = parseInt(falseMonkeyString)

        this.inspectionCount = 0
    }

    inspectItem(worryLevel, reliefAllowed) {
        this.inspectionCount++
        const newWorryLevel = this.operation.reduce((lastOperation, operator) => {
            if (operator === 'old') {
                if (typeof lastOperation(worryLevel) === 'number') {
                    return makeValue(lastOperation())
                } else {
                    return lastOperation(worryLevel)
                }
            }

            if (operator === '+') {
                return makeAdd(lastOperation())
            }

            if (operator === '-') {
                return makeSubtract(lastOperation())
            }

            if (operator === '*') {
                return makeMultiply(lastOperation())
            }

            if (operator === '/') {
                return makeDivide(lastOperation())
            }

            if (typeof operator === 'number') {
                return lastOperation(operator)
            }
        }, makeValue(worryLevel))

        // Part 1
        if (reliefAllowed) {
            return Math.floor(newWorryLevel() / 3);
        } else {
            // Part 2
            return newWorryLevel()
        }
    }

    test(lvl) {
        return lvl % this.testDivider === 0
    }
}

const input = await open('./test.txt');
let monkeyDescription = ''
const monkeys = []
for await (const line of input.readLines()) {
    if (line !== '') {
        monkeyDescription += line + '\n'
    } else {
        monkeys.push(new Monkey(monkeyDescription));
        monkeyDescription = ''
    }
}
monkeys.push(new Monkey(monkeyDescription));


const part1Monkeys = monkeys.slice()
for (let _ = 0; _ < 20; _++) {
    for (let x = 0; x < part1Monkeys.length; x++) {
        const monkey = part1Monkeys[x]
        const n = monkey.items.length
        for (let i = 0; i < n; i++) {
            const level = monkey.items.shift()
            const newLevel = monkey.inspectItem(level, true)

            if (monkey.test(newLevel)) {
                part1Monkeys[monkey.trueMonkeyIndex].items.push(newLevel)
            } else {
                part1Monkeys[monkey.falseMonkeyIndex].items.push(newLevel)
            }
        }
    }
}

part1Monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount)
console.log(`Amount of monkey businness: ${part1Monkeys[0].inspectionCount * part1Monkeys[1].inspectionCount}`)

// const part2Monkeys = monkeys.slice()
// for (let _ = 0; _ < 10_000; _++) {
//     for (let x = 0; x < part2Monkeys.length; x++) {
//         const monkey = part2Monkeys[x]
//         const n = monkey.items.length
//         for (let i = 0; i < n; i++) {
//             const level = monkey.items.shift()
//             const newLevel = monkey.inspectItem(level, false)

//             if (monkey.test(newLevel)) {
//                 part2Monkeys[monkey.trueMonkeyIndex].items.push(newLevel)
//             } else {
//                 part2Monkeys[monkey.falseMonkeyIndex].items.push(newLevel)
//             }
//         }
//     }
//     console.log('part 2, round', _);
// }

// part2Monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount)
// console.log(`Amount of monkey businness: ${part2Monkeys[0].inspectionCount * part2Monkeys[1].inspectionCount}`)