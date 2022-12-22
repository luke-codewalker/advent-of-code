const DEV_MODE = true;
const INPUT_FILE = `data/${DEV_MODE ? "test" : "input"}.txt`;
const text = await Deno.readTextFile(INPUT_FILE);

const lines = text.split("\n");

type Direction = "R" | "L" | "U" | "D";
const compass: Direction[] = ["R", "D", "L", "U"];

let currentDirection: Direction = "R";

const changeDirection = (currentDir: Direction, turn: "R" | "L"): Direction => {
  const currentIndex = compass.indexOf(currentDir);
  const newIndex = turn === "R" ? currentIndex + 1 : currentIndex - 1;
  return compass[
    (newIndex % compass.length) + (newIndex < 0 ? compass.length : 0)
  ];
};

const map: string[][] = [];
let instructions: ("L" | "R" | number)[] = [];
let isForMap = true;

for (const line of lines) {
  if (!isForMap) {
    instructions = line.match(/(\d+|\D+)/g)!.map((x) =>
      Number.isNaN(parseInt(x)) ? x as ("L" | "R") : parseInt(x)
    );
  }

  if (line === "") {
    isForMap = false;
  }

  if (isForMap) {
    map.push(line.split("").map((x) => (x === "#" || x === ".") ? x : "X"));
  }
}

const getFirstTileIndexInRow = (map: string[][], row: number): number => {
  return map[row].findIndex((char) => char === "." || char === "#");
};

const getFirstTileIndexInColumn = (map: string[][], col: number): number => {
  let row = 0;
  while (map[row][col] !== "." && map[row][col] !== "#") {
    row++;
  }
  return row;
};

const getLastTileIndexInColumn = (map: string[][], col: number): number => {
  let row = 0;
  let endReached = false;
  let tilesVisited = false;
  while (!endReached) {
    endReached = (tilesVisited && !map[row + 1]?.[col]) ||
      (map[row][col] !== "X" && map[row + 1][col] === "X");
    tilesVisited = !!map[row][col] &&
      (map[row][col] === "#" || map[row][col] === ".");
    row++;
  }
  return row - 1;
};

console.time("part_1_time");
let currentRow = 0;
let currentCol = getFirstTileIndexInRow(map, currentRow);
const path: { x: number; y: number }[] = [];
for (const instruction of instructions) {
  if (typeof instruction !== "number") {
    currentDirection = changeDirection(currentDirection, instruction);
  } else {
    for (let i = 0; i < instruction; i++) {
      let nextChar = "";
      let newCol = currentCol;
      let newRow = currentRow;
      if (currentDirection === "R") {
        newCol = Math.max(
          (currentCol + 1) % map[currentRow].length,
          getFirstTileIndexInRow(map, currentRow),
        );

        nextChar = map[currentRow][newCol];
      } else if (currentDirection === "L") {
        newCol = (currentCol - 1) % map[currentRow].length;
        if (newCol < getFirstTileIndexInRow(map, currentRow)) {
          newCol = map[currentCol].length - 1;
        }
        nextChar = map[currentRow][newCol];
      } else if (currentDirection === "U") {
        newRow = currentRow - 1;
        if (newRow < getFirstTileIndexInColumn(map, currentCol)) {
          newRow = getLastTileIndexInColumn(map, currentCol);
        }
        nextChar = map[newRow][currentCol];
      } else if (currentDirection === "D") {
        newRow = currentRow + 1;
        if (newRow > getLastTileIndexInColumn(map, currentCol)) {
          newRow = getFirstTileIndexInColumn(map, currentCol);
        }
        nextChar = map[newRow][currentCol];
      }

      if (nextChar !== "#") {
        currentCol = newCol;
        currentRow = newRow;
      }
      path.push({ x: currentCol, y: currentRow });
    }
  }
}

// console.clear();
for (let i = 0; i < map.length; i++) {
  let rowString = "";
  for (let j = 0; j < map[i].length; j++) {
    if (path.find((pos) => pos.x === j && pos.y === i)) {
      rowString += "O";
    } else {
      rowString += map[i][j];
    }
  }
  console.log(rowString);
}

const getDirectionValue = (dir: Direction): number => {
  switch (dir) {
    case "R":
      return 0;
    case "D":
      return 1;
    case "L":
      return 2;
    case "U":
      return 3;
  }
};

console.log(
  "Part 1:",
  "row",
  currentRow + 1,
  "col",
  currentCol + 1,
  "->",
  1_000 * (currentRow + 1) + 4 * (currentCol + 1) +
    getDirectionValue(currentDirection),
);
console.timeEnd("part_1_time");
