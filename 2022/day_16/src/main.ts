import { open } from 'node:fs/promises';
const INPUT_FILE = `${process.cwd()}/data/test.txt`;

const file = await open(INPUT_FILE);
type Valve = {
    name: string,
    flowRate: number,
    open: boolean,
    connections: string[]
}

class PipeSystem {
    valves: Valve[] = []

    addValve(description: string) {
        const name = description.match(/Valve (\w+)\s/)?.[1]!;
        const flowRate = parseInt(description.match(/rate=(\d+)/)?.[1]!);
        const connections = description.match(/to valve[s]? (.+)/)?.[1].split(',')!;

        this.valves.push({
            open: false,
            name, flowRate, connections
        })
    }
}

const pipes = new PipeSystem()
for await (const line of file.readLines()) {
    pipes.addValve(line)
}


