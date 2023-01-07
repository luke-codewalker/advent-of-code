const DEV_MODE = false;
const INPUT_FILE = `data/${DEV_MODE ? "test" : "input"}.txt`;
const text = await Deno.readTextFile(INPUT_FILE);

type Facing = "R" | "D" | "L" | "U";
const facings: Facing[] = [
  "R",
  "D",
  "L",
  "U",
];

type Tile = "." | "#";
type Row = (Tile | " ")[];
type PeekResult = {
  x: number;
  y: number;
  tile: Tile;
};

class Board {
  rows: Row[] = [];

  addRow(row: Row) {
    this.rows.push(row);
  }

  peek(oldX: number, oldY: number, facing: Facing): PeekResult {
    // calculate new potential position
    const x = facing === "R" ? oldX + 1 : facing === "L" ? oldX - 1 : oldX;
    const y = facing === "D" ? oldY + 1 : facing === "U" ? oldY - 1 : oldY;

    // check tile at new position and return if still within board
    const tile = this.rows[y]?.[x] as Tile | undefined ?? " ";
    if (tile !== " ") {
      return { x, y, tile };
    }

    // peeking over edge of board, need to wrap around
    if (facing === "R") {
      const row = this.rows[y];
      const newX = row.lastIndexOf(" ") + 1;
      const tile = row[newX] as "." | "#";
      return { x: newX, y, tile };
    } else if (facing === "L") {
      const row = this.rows[y];
      const newX = row.length - 1;
      const tile = row[newX] as "." | "#";
      return { x: newX, y, tile };
    } else if (facing === "D") {
      const column = this.rows.map((row) => row[x] ?? " ").join("").trimEnd();
      const newY = column.lastIndexOf(" ") + 1;
      const tile = column[newY] as "." | "#";
      return { x, y: newY, tile };
    } else {
      const column = this.rows.map((row) => row[x] ?? " ").join("").trimEnd();
      const newY = column.length - 1;
      const tile = column[newY] as "." | "#";
      return { x, y: newY, tile };
    }
  }
}

const lines = text.split("\n");
const board = new Board();
let instructions: string[] = [];
let readingBoard = true;
for (const line of lines) {
  if (line === "") {
    readingBoard = false;
    continue;
  }

  if (readingBoard) {
    board.addRow(line as unknown as Row);
  } else {
    instructions = line.match(/(\w\d+)/g)!;
  }
}

const currentPos = {
  x: board.rows[0].lastIndexOf(" ") + 1,
  y: 0,
};
let facing: Facing = "R";
const path = new Map<string, Facing>();
for (const instruction of instructions) {
  const [_, dir, amountString] = instruction.match(/([A-Z])?(\d+)/)!;
  if (dir as "R" | "L") {
    if (dir === "R") {
      facing = facings[(facings.indexOf(facing) + 1) % facings.length];
    } else {
      let newIndex: number = (facings.indexOf(facing) - 1) % facings.length;
      if (newIndex < 0) {
        newIndex += facings.length;
      }
      facing = facings[newIndex];
    }
  }

  const amount = parseInt(amountString)!;

  for (let i = 0; i < amount; i++) {
    const newTile = board.peek(currentPos.x, currentPos.y, facing);
    if (newTile.tile === ".") {
      path.set(`${currentPos.x},${currentPos.y}`, facing);
      currentPos.x = newTile.x;
      currentPos.y = newTile.y;
    } else {
      break;
    }
  }
}

for (let y = 0; y < board.rows.length; y++) {
  const row = board.rows[y];
  let rowString = "";
  for (let x = 0; x < row.length; x++) {
    let tile: string = row[x];
    if (path.has(`${x},${y}`)) {
      const facing = path.get(`${x},${y}`);
      switch (facing) {
        case "D":
          tile = "v";
          break;
        case "U":
          tile = "^";
          break;
        case "L":
          tile = "<";
          break;
        case "R":
          tile = ">";
          break;
      }
    }
    rowString += tile;
  }

  console.log(rowString);
}

console.log(
  (4 * (currentPos.x + 1)) + (1000 * (currentPos.y + 1)) +
    facings.indexOf(facing),
);
