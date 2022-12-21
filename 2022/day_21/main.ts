const DEV_MODE = false;
const INPUT_FILE = `data/${DEV_MODE ? "test" : "input"}.txt`;
const text = await Deno.readTextFile(INPUT_FILE);

const data = new Map<string, number | [string, string, string]>();
text.trim().split("\n").forEach((description) => {
  const [name, numberOrJob] = description.split(":");
  const possibleNumber = parseInt(numberOrJob.trim());

  if (!Number.isNaN(possibleNumber)) {
    data.set(name, possibleNumber);
  } else {
    data.set(name, numberOrJob.trim().split(" ") as [string, string, string]);
  }
});

const calculateMonkeyValue = (
  data: Map<string, number | [string, string, string]>,
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
    // update entry to avoid performing operation multiple times
    data.set(name, result);
    return result;
  }
};

console.time("Part 1");
console.log("Part 1:", calculateMonkeyValue(data, "root"));
console.timeEnd("Part 1");
