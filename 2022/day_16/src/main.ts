import { open } from 'node:fs/promises';
import { Action, example, Move, Noop, Open, ValveID } from './actions.js';
const INPUT_FILE = `${process.cwd()}/data/test.txt`;

const file = await open(INPUT_FILE);

type Valve = {
    id: ValveID,
    flowRate: number,
    open: boolean,
    connections: string[]
}

const parseValveDescription = (description: string): Valve => {
    const id = description.match(/Valve (\w+)\s/)?.[1]! as ValveID;
    const flowRate = parseInt(description.match(/rate=(\d+)/)?.[1]!);
    const connections = description.match(/to valve[s]? (.+)/)?.[1].split(',')!;

    return {
        open: false,
        id, flowRate, connections
    }
}

const valves: Valve[] = []
for await (const line of file.readLines()) {
    valves.push(parseValveDescription(line))
}

const evaluateDischarge = (actions: Action[]): number => {
    if (actions.length !== 30) {
        console.warn('actions need to have length 30')
        return -Infinity
    }

    let dischargePerMinute = 0;
    return actions.reduce((sum: number, action) => {
        sum += dischargePerMinute
        if (action instanceof Open) {
            const valve = valves.find(v => v.id === action.target)!;
            console.log(valve);

            if (!valve.open) {
                dischargePerMinute += valve.flowRate;
                valve.open = true
            }
        }
        return sum
    }, 0)
}

// console.log(valves);
let random: Action[] = []
let currentValve = valves.find(v => v.id === 'AA')
for (let i = 0; i < 30; i++) {
    const chance = Math.random();

    if (chance <= 0.33) {
        random.push(new Noop())
    } else if (chance > 0.33 && chance <= 0.66) {
        const newValveId = ''
        random.push(new Move('BB'))
    } else {
        random.push(new Open('BB'))
    }
}

console.log(evaluateDischarge(example));
valves.forEach(v => v.open = false)
console.log(evaluateDischarge(random));
