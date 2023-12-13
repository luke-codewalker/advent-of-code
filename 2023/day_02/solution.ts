// Advent of Code solution for 02.12.2023
const puzzleInput = await Deno.readTextFile(Deno.cwd() + "/2023/day_02/data/input.txt");
const testData = await Deno.readTextFile(Deno.cwd() + "/2023/day_02/data/test.txt");

class CubeSample {
    static fromSampleString(sample: string) {
        const red = Number.parseInt(sample.match(/(\d+) red/)?.[1] ?? '0')
        const green = Number.parseInt(sample.match(/(\d+) green/)?.[1] ?? '0')
        const blue = Number.parseInt(sample.match(/(\d+) blue/)?.[1] ?? '0')
        return new CubeSample(red, green, blue);
    }
    constructor(public red: number, public green: number, public blue: number) {}

    meetsConstraint(constraint: CubeSample): boolean {
        return this.red <= constraint.red && this.green <= constraint.green && this.blue <= constraint.blue;
    }
}

class Game {
    static fromGameString(gameString: string) {
        const gameId = Number.parseInt(gameString.match(/(\d+)/)![1])

        const game = new Game(gameId);
        const sampleStrings = gameString.replace(/Game (\d+):/, '').split(';')
        game.samples = sampleStrings.map(sampleString => CubeSample.fromSampleString(sampleString))
        return game;
    }

    public samples: CubeSample[]  = []
    constructor(public id: number) {
    }

    meetsConstraint(constraint: CubeSample): boolean {
        for (const sample of this.samples) {
            if(!sample.meetsConstraint(constraint)) {
                return false
            }
        }
        return true
    }

    // basically thinking of rgb as 3D and now need to find the smallest cube inside the samples (?)
    getSmallestCubeSet(): CubeSample {
        const cubeSet = new CubeSample(0, 0, 0);
        for (const sample of this.samples) {
            cubeSet.red = sample.red > cubeSet.red ? sample.red : cubeSet.red
            cubeSet.green = sample.green > cubeSet.green ? sample.green : cubeSet.green
            cubeSet.blue = sample.blue > cubeSet.blue ? sample.blue : cubeSet.blue
        }

        return cubeSet
    }
}

const games = puzzleInput.trim().split('\n').map(gameString => Game.fromGameString(gameString));

// Part 1
const constraint = new CubeSample(12, 13, 14);
const sumOfPossibleGameIds = 
    games
        .filter(game => game.meetsConstraint(constraint))
        .map(game => game.id)
        .reduce((sum, id) => sum + id)

console.log(`Part 1: ${sumOfPossibleGameIds}`)

// Part 2
const sumOfGamePowers = games
    .map(game => game.getSmallestCubeSet())
    .map(cubes => cubes.red * cubes.green * cubes.blue)
    .reduce((sum, power) => sum + power);

console.log(`Part 1: ${sumOfGamePowers}`);
