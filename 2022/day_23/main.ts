const DEV_MODE = false;
const INPUT_FILE = `data/${DEV_MODE ? "test" : "input"}.txt`;
const text = await Deno.readTextFile(INPUT_FILE);

type Elf = { x: number; y: number };
type Direction = "N" | "E" | "W" | "S";
const elves: Elf[] = [];
const lines = text.split("\n");
const directions: [Direction, Direction, Direction, Direction] = [
  "N",
  "S",
  "W",
  "E",
];

for (let y = 0; y < lines.length; y++) {
  const line = lines[y].split("");
  for (let x = 0; x < line.length; x++) {
    const char = line[x];
    if (char === "#") {
      elves.push({ x: x + 1, y: y + 1 });
    }
  }
}

const getNeighbours = (
  otherElves: Elf[],
  elf: Elf,
): Elf[] => {
  const neighboursPos = [
    { x: elf.x - 1, y: elf.y - 1 },
    { x: elf.x, y: elf.y - 1 },
    { x: elf.x + 1, y: elf.y - 1 },
    { x: elf.x - 1, y: elf.y },
    { x: elf.x + 1, y: elf.y },
    { x: elf.x - 1, y: elf.y + 1 },
    { x: elf.x, y: elf.y + 1 },
    { x: elf.x + 1, y: elf.y + 1 },
  ];

  return otherElves.filter((otherElf) => {
    return !!neighboursPos.find((pos) => {
      return pos.x === otherElf.x && pos.y === otherElf.y;
    });
  });
};

const getNeighboursInDirection = (
  neighbours: Elf[],
  elf: Elf,
  direction: Direction,
): Elf[] => {
  return neighbours.filter((neighbour) => {
    switch (direction) {
      case "N":
        return neighbour.y === elf.y - 1;

      case "S":
        return neighbour.y === elf.y + 1;

      case "E":
        return neighbour.x === elf.x + 1;

      case "W":
        return neighbour.x === elf.x - 1;
    }
  });
};

const calculateNewPos = (
  otherElves: Elf[],
  elf: Elf,
  directions: Direction[],
): Elf => {
  const neighbours = getNeighbours(otherElves, elf);

  if (neighbours.length === 0) {
    return elf;
  }

  for (const direction of directions) {
    const neighboursInDirection = getNeighboursInDirection(
      neighbours,
      elf,
      direction,
    );

    if (neighboursInDirection.length === 0) {
      return {
        x: elf.x + (direction === "E" ? 1 : direction === "W" ? -1 : 0),
        y: elf.y + (direction === "S" ? 1 : direction === "N" ? -1 : 0),
      };
    }
  }

  return elf;
};

const round = (elves: Elf[], directions: Direction[]): [Elf[], Direction[]] => {
  let proposals: { id: number; pos: Elf }[] = [];
  for (let i = 0; i < elves.length; i++) {
    const elf = elves[i];
    const otherElves = elves.slice();
    otherElves.splice(i, 1);
    const newPos = calculateNewPos(elves, elf, directions);
    proposals.push({ id: i, pos: newPos });
  }

  // filter out proposals for the same spot
  proposals = proposals.filter((elf, index, proposals) => {
    const others: { id: number; pos: Elf }[] = proposals.filter((_, idx) =>
      index !== idx
    );
    return !others.find((otherElf) =>
      otherElf.pos.x === elf.pos.x && otherElf.pos.y === elf.pos.y
    );
  });

  const newElves = elves.slice();
  proposals.forEach((proposal) => {
    newElves[proposal.id] = proposal.pos;
  });

  const newDirections = [...directions.slice(1), directions[0]];

  return [newElves, newDirections];
};

const render = (elves: Elf[]): void => {
  let minX = 0, maxX = 0, minY = 0, maxY = 0;

  elves.forEach((elf) => {
    if (elf.x < minX) {
      minX = elf.x;
    }

    if (elf.x > maxX) {
      maxX = elf.x;
    }

    if (elf.y < minY) {
      minY = elf.y;
    }

    if (elf.y > maxY) {
      maxY = elf.y;
    }
  });

  console.clear();
  for (let y = minY; y <= maxY + 1; y++) {
    let row = "";
    for (let x = minX; x <= maxX + 1; x++) {
      if (elves.find((elf) => elf.x === x && elf.y === y)) {
        row += "#";
      } else {
        row += ".";
      }
    }
    console.log(row);
  }
};

const elvesNeedToMove = (elves: Elf[]): boolean => {
  const neighbours = elves.reduce(
    (sum, elf) => sum + getNeighbours(elves, elf).length,
    0,
  );
  return neighbours > 0;
};

const calculateEmptyTiles = (elves: Elf[]): number => {
  let minX = 0, maxX = 0, minY = 0, maxY = 0;

  elves.forEach((elf) => {
    if (elf.x < minX) {
      minX = elf.x;
    }

    if (elf.x > maxX) {
      maxX = elf.x;
    }

    if (elf.y < minY) {
      minY = elf.y;
    }

    if (elf.y > maxY) {
      maxY = elf.y;
    }
  });

  return ((maxX + 1) - minX) * ((maxY + 1) - minY) - elves.length;
};

console.time("part1");
let part1Elves = elves.slice();
let part1directions = directions.slice();

for (let i = 0; i < 10; i++) {
  [part1Elves, part1directions] = round(part1Elves, part1directions);
}

render(part1Elves);
console.log(calculateEmptyTiles(part1Elves));
console.timeEnd("part1");

console.time("part2");
let part2Elves = elves.slice();
let part2directions = directions.slice();
let roundsNecessary = 1;
console.log("Starting part 2");

while (elvesNeedToMove(part2Elves)) {
  roundsNecessary++;
  [part2Elves, part2directions] = round(part2Elves, part2directions);
  if (roundsNecessary % 20 === 0) {
    console.log(`Currently on round ${roundsNecessary}`);
  }
}
console.log(roundsNecessary);
console.timeEnd("part2");
