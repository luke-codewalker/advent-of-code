const DEV_MODE = true;
const INPUT_FILE = `data/${DEV_MODE ? "test" : "input"}.txt`;
const text = await Deno.readTextFile(INPUT_FILE);

const lines = text.split("\n");

const map = [];
let instructions: (string | number)[] = [];
let isForMap = true;

for (const line of lines) {
  if (!isForMap) {
    instructions = line.match(/(\d+|\D+)/g)!.map((x) =>
      Number.isNaN(parseInt(x)) ? x : parseInt(x)
    );
  }

  if (line === "") {
    isForMap = false;
  }

  if (isForMap) {
    map.push(line.split(""));
  }
}
