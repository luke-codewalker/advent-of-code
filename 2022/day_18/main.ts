const DEV_MODE = false;
const INPUT_FILE = `data/${DEV_MODE ? "test" : "input"}.txt`;
const text = await Deno.readTextFile(INPUT_FILE);

type Vector3 = { x: number; y: number; z: number };

const cubeSet = new Set<string>();
for (const line of text.split("\n")) {
  cubeSet.add(line);
}

const generateSideCoveringNeighbours = (coord: string): string[] => {
  const [x, y, z] = coord.split(",").map((s) => parseInt(s)) as [
    number,
    number,
    number,
  ];
  return [
    `${x + 1},${y},${z}`,
    `${x - 1},${y},${z}`,
    `${x},${y + 1},${z}`,
    `${x},${y - 1},${z}`,
    `${x},${y},${z + 1}`,
    `${x},${y},${z - 1}`,
  ];
};

const countUncoveredSides = (coord: string, map: Set<string>): number => {
  return generateSideCoveringNeighbours(coord).reduce(
    (sides, neighbour) => map.has(neighbour) ? sides - 1 : sides,
    6,
  );
};

const getBoundingParameters = (
  cubeSet: Set<string>,
): { origin: Vector3; dimensions: Vector3 } => {
  const min: Vector3 = { x: Infinity, y: Infinity, z: Infinity };
  const max: Vector3 = { x: -Infinity, y: -Infinity, z: -Infinity };

  for (const cube of cubeSet.values()) {
    const [x, y, z] = cube.split(",").map((s) => parseInt(s));

    if (x < min.x) {
      min.x = x;
    }

    if (y < min.y) {
      min.y = y;
    }

    if (z < min.z) {
      min.z = z;
    }

    if (x > max.x) {
      max.x = x;
    }

    if (y > max.y) {
      max.y = y;
    }

    if (z > max.z) {
      max.z = z;
    }
  }

  return {
    origin: min,
    dimensions: {
      x: max.x - min.x + 1,
      y: max.y - min.y + 1,
      z: max.z - min.z + 1,
    },
  };
};

const fillBoundingBox = (origin: Vector3, dimensions: Vector3): Set<string> => {
  const allCubes = new Set<string>();
  for (let x = origin.x - 1; x <= origin.x + dimensions.x; x++) {
    for (let y = origin.y - 1; y <= origin.y + dimensions.y; y++) {
      for (let z = origin.z - 1; z <= origin.z + dimensions.z; z++) {
        allCubes.add(`${x},${y},${z}`);
      }
    }
  }

  return allCubes;
};

const getOutsideCubes = (
  start: Vector3,
  allCubes: Set<string>,
  rockCubes: Set<string>,
): Set<string> => {
  const startKey = `${start.x},${start.y},${start.z}`;
  if (!allCubes.has(startKey)) {
    throw new Error("start cube needs to be in all cubes set");
  }

  const stack = [startKey];
  const outsideCubes = new Set<string>([startKey]);
  while (stack.length > 0) {
    const cube = stack.pop()!;
    const neighbours = generateSideCoveringNeighbours(cube).filter((c) =>
      allCubes.has(c) && !rockCubes.has(c)
    );
    neighbours.forEach((n) => {
      if (!outsideCubes.has(n)) {
        outsideCubes.add(n);
        stack.push(n);
      }
    });
  }

  return outsideCubes;
};

const calculateSurfaceArea = (dimensions: Vector3): number => {
  return dimensions.x * dimensions.y * 2 + dimensions.x * dimensions.z * 2 +
    dimensions.y * dimensions.z * 2;
};

//// collapse one dimension each and look at sum of visible (=unique) squares -> nice idea, but only works for purely convex cubes
// const makeCollapsedSets = (
//   map: Set<string>,
// ): [Set<string>, Set<string>, Set<string>] => {
//   return Array.from(map.values()).reduce(([xSet, ySet, zSet], coord) => {
//     const [x, y, z] = coord.split(",");

//     xSet.add(`${y},${z}`);
//     ySet.add(`${x},${z}`);
//     zSet.add(`${x},${y}`);

//     return [xSet, ySet, zSet];
//   }, [new Set<string>(), new Set<string>(), new Set<string>()]);
// };

// Part 1

console.time("Part 1");
let uncoveredSides = 0;
for (const cube of cubeSet.values()) {
  uncoveredSides += countUncoveredSides(cube, cubeSet);
}

console.log(`Part 1: ${uncoveredSides} uncovered sides`);
console.timeEnd("Part 1");

// Part 2
console.time("Part 2");
const boundingBox = getBoundingParameters(cubeSet);
const filledBoundingBox = fillBoundingBox(
  boundingBox.origin,
  boundingBox.dimensions,
);
const outsideCubes = getOutsideCubes(
  boundingBox.origin,
  filledBoundingBox,
  cubeSet,
);
const outsideCubesDims = getBoundingParameters(outsideCubes);
let allSides = 0;
for (const cube of outsideCubes.values()) {
  allSides += countUncoveredSides(cube, outsideCubes);
}
const uncoveredOuterSides = allSides -
  calculateSurfaceArea(outsideCubesDims.dimensions);

console.log(`Part 2: ${uncoveredOuterSides} uncovered outer sides`);
console.timeEnd("Part 2");
