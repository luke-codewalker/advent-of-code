import { open } from 'node:fs/promises';

type Position = { x: number, y: number };
type Direction = 'vertical' | 'horizontal'
const parsePointString = (string: string): Position => {
    const parts = string.split(',')
    return {
        x: parseInt(parts[0]),
        y: parseInt(parts[1])
    }
}


class Cave {
    #sandOrigin: Position = { x: 500, y: 0 };
    #activeSand: Position = { x: 500, y: 0 };
    rocks: Set<string> = new Set();
    sand: Set<string> = new Set();
    topLeft: Position = { x: 500, y: 0 }
    bottomRight: Position = { x: 500, y: 0 }
    sandFallingIntoAbyss = false;

    addRockPath(pathDescription: string) {
        const points = pathDescription.split(' -> ')
        for (let i = 0; i < points.length - 1; i++) {
            const start = parsePointString(points[i]);
            const end = parsePointString(points[i + 1]);

            this.saveExtremes(start, end);

            const direction: Direction = start.x === end.x ? 'vertical' : 'horizontal';
            const length = direction === 'horizontal' ? end.x - start.x : end.y - start.y;

            for (let i = 0; i <= Math.abs(length); i++) {
                const diff = Math.round(length * (i / Math.abs(length)))
                const newPos = direction === 'horizontal' ? { x: start.x + diff, y: start.y } : { x: start.x, y: start.y + diff }
                this.rocks.add(`${newPos.x},${newPos.y}`)
            }
        }
    }

    saveExtremes(start: Position, end: Position) {
        const maxX = Math.max(start.x, end.x)
        const minX = Math.min(start.x, end.x)
        const maxY = Math.max(start.y, end.y)
        const minY = Math.min(start.y, end.y)

        if (maxX > this.bottomRight.x) {
            this.bottomRight.x = maxX;
        }

        if (minX < this.topLeft.x) {
            this.topLeft.x = minX;
        }

        if (maxY > this.bottomRight.y) {
            this.bottomRight.y = maxY;
        }

        if (minY < this.topLeft.y) {
            this.topLeft.y = minY;
        }
    }

    collidesWithRock(pos: Position): boolean {
        return this.rocks.has(`${pos.x},${pos.y}`)
    }

    collidesWithSand(pos: Position): boolean {
        return this.sand.has(`${pos.x},${pos.y}`)
    }


    update() {
        const diffs: Position[] = [{ x: 0, y: 1 }, { x: -1, y: 1 }, { x: 1, y: 1 }]

        for (let i = 0; i < diffs.length; i++) {
            const diff = diffs[i];
            const posBelowActiveSand = { x: this.#activeSand.x + diff.x, y: this.#activeSand.y + diff.y }

            if (posBelowActiveSand.y > this.bottomRight.y) {
                this.sandFallingIntoAbyss = true
                return
            }

            if (!this.collidesWithRock(posBelowActiveSand) && !this.collidesWithSand(posBelowActiveSand)) {
                this.#activeSand = posBelowActiveSand
                return
            }
        }

        this.sand.add(`${this.#activeSand.x},${this.#activeSand.y}`)
        this.#activeSand = this.#sandOrigin
    }

    render() {
        console.clear()
        let display = '';
        for (let row = this.topLeft.y - 1; row <= this.bottomRight.y + 1; row++) {
            for (let col = this.topLeft.x - 1; col <= this.bottomRight.x + 1; col++) {
                let pixel = '.'
                if (this.collidesWithRock({ x: col, y: row })) {
                    pixel = '#'
                }
                if (this.collidesWithSand({ x: col, y: row })) {
                    pixel = 'o'
                }
                if ((this.#activeSand.x === col && this.#activeSand.y === row)) {
                    pixel = 'x'
                }
                if (this.#sandOrigin.x === col && this.#sandOrigin.y === row) {
                    pixel = '+'
                }
                display += pixel
            }
            display += '\n';
        }

        console.log(display)
    }
}

const cave = new Cave()
const file = await open(`${process.cwd()}/data/input.txt`);
for await (const line of file.readLines()) {
    cave.addRockPath(line)
}

// Part 1 visualization for test data
// const draw = () => {
//     cave.update()
//     cave.render()
//     if (!cave.sandFallingIntoAbyss) {
//         setTimeout(draw, 16)
//     }
// }
// draw()

while (!cave.sandFallingIntoAbyss) {
    cave.update()
}
console.log(cave.sand.size);
