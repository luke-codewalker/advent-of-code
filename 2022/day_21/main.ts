const DEV_MODE = false;
const INPUT_FILE = `data/${DEV_MODE ? "test" : "input"}.txt`;
const text = await Deno.readTextFile(INPUT_FILE);

type Operation = [string, string, string];
type MonkeyMap = Map<string, number | Operation>;

const data: MonkeyMap = new Map();
text.trim().split("\n").forEach((description) => {
  const [name, numberOrJob] = description.split(":");
  const possibleNumber = parseInt(numberOrJob.trim());

  if (!Number.isNaN(possibleNumber)) {
    data.set(name, possibleNumber);
  } else {
    data.set(name, numberOrJob.trim().split(" ") as Operation);
  }
});

const calculateMonkeyValue = (
  data: MonkeyMap,
  name = "root",
): number => {
  const numberOrJob = data.get(name)!;

  if (typeof numberOrJob === "number") {
    return numberOrJob;
  } else {
    const val1 = calculateMonkeyValue(data, numberOrJob[0]);
    const val2 = calculateMonkeyValue(data, numberOrJob[2]);
    const op = numberOrJob[1];
    let result = 0;
    switch (op) {
      case "+":
        result = val1 + val2;
        break;

      case "-":
        result = val1 - val2;
        break;
      case "*":
        result = val1 * val2;
        break;
      case "/":
        result = val1 / val2;
        break;
    }
    return result;
  }
};

const extractSubMap = (data: MonkeyMap, name: string): MonkeyMap => {
  const newMap: MonkeyMap = new Map();

  const extractData = (root: string) => {
    const val = data.get(root)!;
    newMap.set(root, val);
    if (typeof val !== "number") {
      const [left, _, right] = val;
      extractData(left);
      extractData(right);
    }
  };

  extractData(name);

  return newMap;
};

const findPath = (data: MonkeyMap, from: string, to: string): string[] => {
  const parents: string[] = [from];
  for (const [key, val] of data.entries()) {
    if (typeof val !== "number" && val.includes(from)) {
      parents.push(key);
      break;
    }
  }

  if (parents.slice(-1)[0] !== to) {
    return [
      ...parents.slice(0, -1),
      ...findPath(data, parents.slice(-1)[0], to),
    ];
  } else {
    return parents;
  }
};

const findHumnValue = (data: MonkeyMap): number => {
  const [left, _, right] = data.get("root") as Operation;
  const leftMap = extractSubMap(data, left);
  const rightMap = extractSubMap(data, right);

  const [humnMap, humnRoot] = leftMap.has("humn")
    ? [leftMap, left]
    : [rightMap, right];
  const [referenceMap, referenceRoot] = rightMap.has("humn")
    ? [leftMap, left]
    : [rightMap, right];

  const referenceVal = calculateMonkeyValue(referenceMap, referenceRoot);

  const humnPath = findPath(humnMap, "humn", humnRoot);

  let answer = referenceVal;
  let nextMonkey = humnPath.pop()!;
  while (nextMonkey !== "humn") {
    const [hL, hOp, hR] = humnMap.get(nextMonkey) as Operation;
    const num = humnPath.includes(hL)
      ? calculateMonkeyValue(humnMap, hR)
      : calculateMonkeyValue(humnMap, hL);

    // couldn't have solved it without the hint that you need to flip certain ops from
    // https://github.com/turtlecrab/Advent-of-Code-2022/blob/master/src/day21.ts and https://www.reddit.com/r/adventofcode/comments/zrtw6y/2022_day_21_part_2_another_example/
    const flip = humnPath.includes(hL) ? false : true;

    switch (hOp) {
      case "+":
        answer = answer - num;
        break;

      case "-":
        answer = flip ? num - answer : answer + num;
        break;

      case "/":
        answer = flip ? num / answer : answer * num;
        break;

      case "*":
        answer = answer / num;
        break;
    }
    nextMonkey = humnPath.pop()!;
  }

  return answer;
};

console.time("Part 1");
console.log("Part 1:", calculateMonkeyValue(data, "root"));
console.timeEnd("Part 1");

console.time("Part 2");
console.log("Part 2:", findHumnValue(data));
console.timeEnd("Part 2");
