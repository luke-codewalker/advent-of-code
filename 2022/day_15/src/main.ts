import { open } from 'node:fs/promises';
const INPUT_FILE = `${process.cwd()}/data/test.txt`;

const file = await open(INPUT_FILE);
type Position = { x: number, y: number }
type SensorData = { position: Position, closestBeacon: Position }

const extractCoordinates = (string: string): Position => {
    const match = string.match(/x=(-?\d+), y=(-?\d+)/);
    return { x: parseInt(match?.[1] ?? ''), y: parseInt(match?.[2] ?? '') }
}
const parseLine = (line: string): SensorData => {
    const [sensorPart, beaconPart] = line.split(':');
    return { position: extractCoordinates(sensorPart), closestBeacon: extractCoordinates(beaconPart) }
}

const sensors: SensorData[] = []
for await (const line of file.readLines()) {
    sensors.push(parseLine(line))
}


