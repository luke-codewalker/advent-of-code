import { open } from 'node:fs/promises';
import { Action, example, Move, Noop, Open, ValveID } from './actions.js';
const INPUT_FILE = `${process.cwd()}/data/test.txt`;

const file = await open(INPUT_FILE);

type Valve = {
    id: ValveID,
    flowRate: number,
    open: boolean,
    connections: ValveID[]
}

const parseValveDescription = (description: string): Valve => {
    const id = description.match(/Valve (\w+)\s/)?.[1]! as ValveID;
    const flowRate = parseInt(description.match(/rate=(\d+)/)?.[1]!);
    const connections = description.match(/to valve[s]? (.+)/)?.[1].split(',')!.map(s => s.trim()) as ValveID[];

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
    if (actions.length !== 31) {
        console.warn('actions need to have length 31')
        return -Infinity
    }

    let dischargePerMinute = 0;
    const totalDischarge =  actions.reduce((sum: number, action) => {
        sum += dischargePerMinute
        if (action instanceof Open) {
            const valve = valves.find(v => v.id === action.target)!;

            if (!valve.open) {
                dischargePerMinute += valve.flowRate;
                valve.open = true
            }
        }
        return sum
    }, 0)
    valves.forEach(v => v.open = false)
    return totalDischarge;
}

const pickRandomFromArray = <T>(array: T[]): T => {
    const index = Math.floor(Math.random() * array.length);
    return array[index]
}

const generateActions = (valves: Valve[], start: ValveID, length: number): Action[] => {
    let currentValve = valves.find(v => v.id === start)!;

    const openValves = new Set<ValveID>();
    const actions: Action[] = []
    actions.push(new Noop(currentValve.id))
    for (let i = 0; i < length; i++) {
        const chance = Math.random();
        // if (chance < 0.01) { // 1% chance chosen for a start
        //     actions.push(new Noop(currentValve.id))
        // } else {
            if (currentValve.flowRate > 0 && !openValves.has(currentValve.id)) {
                // still roll dice and move on without opening with 50% chance
                if (chance < 0.5) {
                    actions.push(new Open(currentValve.id))
                    openValves.add(currentValve.id)
                } else {
                    const newValveId = pickRandomFromArray(currentValve.connections);
                    actions.push(new Move(newValveId))
                    currentValve = valves.find(v => {
                        return v.id === newValveId
                    })!;
                }
            } else {
                // if there is no use in opening the valve just move on
                const newValveId = pickRandomFromArray(currentValve.connections);
                actions.push(new Move(newValveId))
                currentValve = valves.find(v => {
                    return v.id === newValveId
                })!;
            }
        // }
    }
    
    return actions
}

console.log(evaluateDischarge(example))

let topFitness = 0;
let population: Action[][] = [];
let unchangedCounter = 0
const POP_SIZE = 10_000
console.time('evolution')
while (unchangedCounter < 50) {
    for (let i = 0; i < POP_SIZE; i++) {
        population.push(generateActions(valves, 'AA', 30));
    }

    population.sort((a, b) => evaluateDischarge(b) - evaluateDischarge(a))
    const currentTopFitness = evaluateDischarge(population[0])
    
    if (currentTopFitness > topFitness) {
        topFitness = currentTopFitness;
    } else {
        unchangedCounter++
    }

    const topPerformer = population.slice(0, 200);
    population = []
    // repopulate with top ten action sequences
    for (let i = 0; i < POP_SIZE; i++) {
        // pick a random sequence form top ten
        const parentSequence = pickRandomFromArray(topPerformer);

        // apply some mutation to that sequence (no crossover for now because seems complicated because of connection rules)
        const spliceIndex = Math.floor(Math.random() * parentSequence.length);
        const oldPart = parentSequence.slice(0, spliceIndex)

        const newPart = generateActions(valves, spliceIndex > 0 ? parentSequence[spliceIndex - 1].target : 'AA', parentSequence.length - spliceIndex - 1)
        
        const newSequence = [...oldPart, ...newPart]
        population.push(newSequence);
    }
}

console.log(topFitness, population[0]);
console.timeEnd('evolution')
