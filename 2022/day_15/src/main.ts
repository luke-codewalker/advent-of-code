import { open } from 'node:fs/promises';
const INPUT_FILE = `${process.cwd()}/data/input.txt`;

const file = await open(INPUT_FILE);
type Position = { x: number, y: number }
type SensorPositionData = { position: Position, closestBeacon: Position }
type SensorData = SensorPositionData & { distance: number }

const extractCoordinates = (string: string): Position => {
    const match = string.match(/x=(-?\d+), y=(-?\d+)/);
    return { x: parseInt(match?.[1] ?? ''), y: parseInt(match?.[2] ?? '') }
}

const parseLine = (line: string): SensorPositionData => {
    const [sensorPart, beaconPart] = line.split(':');
    return { position: extractCoordinates(sensorPart), closestBeacon: extractCoordinates(beaconPart) }
}

const manhattanDistance = (pos1: Position, pos2: Position): number => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)
}

function* manhattanCircle(center: Position, radius: number) {
    let pos = { x: center.x, y: center.y - radius }

    while (pos.y < center.y) {
        yield pos;
        pos = { x: pos.x + 1, y: pos.y + 1 }
    }

    while (pos.x > center.x) {
        yield pos;
        pos = { x: pos.x - 1, y: pos.y + 1 }
    }

    while (pos.y > center.y) {
        yield pos;
        pos = { x: pos.x - 1, y: pos.y - 1 }
    }

    while (pos.x < center.x) {
        yield pos;
        pos = { x: pos.x + 1, y: pos.y - 1 }
    }
}

const findTopLeftPosition = (positions: Position[]): Position => {
    return positions.reduce((extreme, pos) => {
        extreme.x = Math.min(extreme.x, pos.x)
        extreme.y = Math.min(extreme.y, pos.y)
        return extreme;
    }, { x: 0, y: 0 })
}

const findBottomRightPosition = (positions: Position[]): Position => {
    return positions.reduce((extreme, pos) => {
        extreme.x = Math.max(extreme.x, pos.x)
        extreme.y = Math.max(extreme.y, pos.y)
        return extreme;
    }, { x: 0, y: 0 })
}


const sensors: SensorData[] = []
const map: { topLeft: Position, bottomRight: Position, maxDistance: number } = { topLeft: { x: 0, y: 0 }, bottomRight: { x: 0, y: 0 }, maxDistance: 0 };
for await (const line of file.readLines()) {
    const sensor = parseLine(line);
    const distance = manhattanDistance(sensor.position, sensor.closestBeacon);
    map.topLeft = findTopLeftPosition([map.topLeft, sensor.position, sensor.closestBeacon])
    map.bottomRight = findBottomRightPosition([map.bottomRight, sensor.position, sensor.closestBeacon])
    if (distance > map.maxDistance) {
        map.maxDistance = distance
    }
    sensors.push({ ...sensor, distance });
}


const renderMap = () => {
    let output = '';
    let circlePos: Position[] = []

    // demo for part 2
    for (const pos of manhattanCircle(sensors[5].position, sensors[5].distance)) {
        circlePos.push(pos)
    }


    for (let y = map.topLeft.y - map.maxDistance; y <= map.bottomRight.y + map.maxDistance; y++) {
        output += `${y}\t`

        for (let x = map.topLeft.x - map.maxDistance; x <= map.bottomRight.x + map.maxDistance; x++) {
            let pixel = '.'
            sensors.forEach(sensor => {
                const distToSensor = manhattanDistance(sensor.position, { x, y })
                const distToBeacon = manhattanDistance(sensor.closestBeacon, { x, y })

                if (distToBeacon === 0) {
                    pixel = 'B'
                } else if (distToSensor === 0) {
                    pixel = 'S'
                } else if (distToSensor <= sensor.distance && !pixel.match(/[BS]/)) {
                    pixel = '#'
                }

                if ((y === 0 || y === 20) && !pixel.match(/[BS]/)) {
                    pixel = '-'
                }

                if ((x === 0 || x === 20) && !pixel.match(/[BS]/)) {
                    pixel = '|'
                }

                if (circlePos.find(pos => pos.x === x && pos.y === y)) {
                    pixel = 'o'
                }
            })
            output += pixel
        }
        output += '\n'
    }

    console.clear()
    console.log(output)
}

// Part 1
console.time('Part 1')
let occupiedPositions = 0
const y = 10; // test
// const y = 20_00_000; // input
for (let x = map.topLeft.x - map.maxDistance; x <= map.bottomRight.x + map.maxDistance; x++) {
    const sensor = sensors.find(sensor => {
        const distToSensor = manhattanDistance({ x, y }, sensor.position)
        const distToBeacon = manhattanDistance({ x, y }, sensor.closestBeacon)

        return distToSensor <= sensor.distance && distToBeacon > 0 && distToSensor > 0

    })
    if (!!sensor) {
        occupiedPositions++
    }
}

// // only useful for test data!
// renderMap()

console.log(occupiedPositions);
console.timeEnd('Part 1')


// Part 2
console.time('Part 2')
// const limit = 20 // test
const limit = 4000000
const findSensor = () => {
    for (let i = 0; i < sensors.length; i++) {
        const sensor = sensors[i];

        for (const pos of manhattanCircle(sensor.position, sensor.distance + 1)) {
            if (pos.x < 0 || pos.y < 0 || pos.x > limit || pos.y > limit) {
                continue
            }

            const otherSensors = sensors.slice()
            otherSensors.splice(i, 1)

            const sensorsLeft = otherSensors.filter(other => manhattanDistance(other.position, pos) <= other.distance)
            if (sensorsLeft.length === 0) {
                return pos
            }
        }
    }
}

const position = findSensor()!;
console.log(position.x * 4000000 + position?.y);
console.timeEnd('Part 2')

