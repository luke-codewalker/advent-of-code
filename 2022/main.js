import { open } from 'node:fs/promises';
const input = await open('./input.txt');

const forest = []
for await (const line of input.readLines()) {
    forest.push(line.split('').map(x => parseInt(x)))
}

const rows = forest.length
const columns = forest[0].length

let visibleTreeCount = 2 * rows + 2 * columns - 4

const isVisible = (forest, i, j) => {
    const tree = forest[i][j]
    let isVisible = true

    // check left
    for (let x = 0; x < j; x++) {
        if (forest[i][x] >= tree) {
            // console.log('found bigger tree to the left', i, j, '=', tree, i, x, '=', forest[i][x]);
            isVisible = false
            break
        }
    }
    if (isVisible) {
        return isVisible
    }
    isVisible = true
    // check right
    for (let x = j + 1; x < columns; x++) {
        if (forest[i][x] >= tree) {
            // console.log('found bigger tree to the right', i, j, '=', tree, i, x, '=', forest[i][x]);
            isVisible = false
            break
        }
    }
    if (isVisible) {
        return isVisible
    }
    isVisible = true
    // check top
    for (let x = 0; x < i; x++) {
        if (forest[x][j] >= tree) {
            // console.log('found bigger tree to the top', i, j, '=', tree, x, j, '=', forest[x][j]);
            isVisible = false
            break
        }
    }
    if (isVisible) {
        return isVisible
    }
    isVisible = true
    // check bottom
    for (let x = i + 1; x < rows; x++) {
        if (forest[x][j] >= tree) {
            // console.log('found bigger tree to the bottom', i, j, '=', tree, x, j, '=', forest[x][j]);
            isVisible = false
            break
        }
    }

    return isVisible
}


const calculateScore = (forest, i, j) => {
    const tree = forest[i][j]

    // check left
    let leftScore = 0
    for (let x = j - 1; x >= 0; x--) {
        leftScore++
        if (tree <= forest[i][x]) {
            break
        }
    }

    // check right
    let rightScore = 0
    for (let x = j + 1; x < columns; x++) {
        rightScore++
        if (tree <= forest[i][x]) {
            break
        }
    }

    // check top
    let topScore = 0
    for (let x = i - 1; x >= 0; x--) {
        topScore++
        if (tree <= forest[x][j]) {
            break
        }
    }

    // check bottom
    let bottomScore = 0
    for (let x = i + 1; x < rows; x++) {
        bottomScore++
        if (tree <= forest[x][j]) {
            break
        }
    }

    return leftScore * rightScore * topScore * bottomScore
}

// Part 1
for (let i = 1; i < rows - 1; i++) {
    for (let j = 1; j < columns - 1; j++) {
        const visible = isVisible(forest, i, j)
        // console.log(i, j, forest[i][j], visible);
        visibleTreeCount = visibleTreeCount + (visible ? 1 : 0)
    }
}

console.log(`There are ${visibleTreeCount} visible trees`);

// Part 2
let recordScore = 0
for (let i = 1; i < rows - 1; i++) {
    for (let j = 1; j < columns - 1; j++) {
        const score = calculateScore(forest, i, j)
        if(score > recordScore) {
            recordScore = score
        }
    }
}

console.log(`The best score is ${recordScore}`);