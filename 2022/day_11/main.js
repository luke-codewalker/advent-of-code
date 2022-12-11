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
            return newWorryLevel() % this.testDivider
        }
    }

    test(lvl) {
        return lvl % this.testDivider === 0
    }
}

const input = await open('./test.txt');
let monkeyDescription = ''
const monkeysPart1 = []
const monkeysPart2 = []
for await (const line of input.readLines()) {
    if (line !== '') {
        monkeyDescription += line + '\n'
    } else {
        monkeysPart1.push(new Monkey(monkeyDescription));
        monkeysPart2.push(new Monkey(monkeyDescription));
        monkeyDescription = ''
    }
}
monkeysPart1.push(new Monkey(monkeyDescription));
monkeysPart2.push(new Monkey(monkeyDescription));

for (let _ = 0; _ < 20; _++) {
    for (let x = 0; x < monkeysPart1.length; x++) {
        const monkey = monkeysPart1[x]
        const n = monkey.items.length
        for (let i = 0; i < n; i++) {
            const level = monkey.items.shift()
            const newLevel = monkey.inspectItem(level, true)

            if (monkey.test(newLevel)) {
                monkeysPart1[monkey.trueMonkeyIndex].items.push(newLevel)
            } else {
                monkeysPart1[monkey.falseMonkeyIndex].items.push(newLevel)
            }
        }
    }
}

monkeysPart1.sort((a, b) => b.inspectionCount - a.inspectionCount)
console.log(`Amount of monkey businness: ${monkeysPart1[0].inspectionCount * monkeysPart1[1].inspectionCount}`)

for (let _ = 0; _ < 10_000; _++) {
    for (let x = 0; x < monkeysPart2.length; x++) {
        const monkey = monkeysPart2[x]
        const n = monkey.items.length
        for (let i = 0; i < n; i++) {
            const level = monkey.items.shift()
            const newLevel = monkey.inspectItem(level, false)

            if (monkey.test(newLevel)) {
                monkeysPart2[monkey.trueMonkeyIndex].items.push(newLevel)
            } else {
                monkeysPart2[monkey.falseMonkeyIndex].items.push(newLevel)
            }
        }
    }
}
console.log(monkeysPart2);
monkeysPart2.sort((a, b) => b.inspectionCount - a.inspectionCount)
console.log(`Amount of monkey businness: ${monkeysPart2[0].inspectionCount * monkeysPart2[1].inspectionCount}`)