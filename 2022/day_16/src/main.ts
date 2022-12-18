import { open } from 'node:fs/promises';
const INPUT_FILE = `${process.cwd()}/data/test.txt`;

const file = await open(INPUT_FILE);
type Valve = {
    name: string,
    flowRate: number,
    open: boolean,
    connections: string[]
}

const parseValveDescription = (description: string): Valve => {
    const name = description.match(/Valve (\w+)\s/)?.[1]!;
    const flowRate = parseInt(description.match(/rate=(\d+)/)?.[1]!);
    const connections = description.match(/to valve[s]? (.+)/)?.[1].split(',')!;

    return {
        open: false,
        name, flowRate, connections
    }
}

const pipes: Valve[] = []
for await (const line of file.readLines()) {
    pipes.push(parseValveDescription(line))
}


