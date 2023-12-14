// Advent of Code solution for 03.12.2023
const puzzleInput = await Deno.readTextFile(
  Deno.cwd() + "/2023/day_03/data/input.txt",
);
const testData = await Deno.readTextFile(
  Deno.cwd() + "/2023/day_03/data/test.txt",
);

const lines = puzzleInput.trim().split("\n");

type PartNumber = {
  value: number;
  digits: number;
  x: number;
  y: number;
};

type Symbol = {
  value: string;
  x: number;
  y: number;
};

class Schematic {
  public numbers: PartNumber[] = [];
  public symbols: Symbol[] = [];

  constructor() {}

  getNeighbouringSymbolsForNumber(number: PartNumber): Symbol[] {
    return this.symbols.filter((symbol) => {
      return symbol.x <= (number.x + number.digits) &&
        symbol.x >= (number.x - 1) &&
        symbol.y <= (number.y + 1) &&
        symbol.y >= (number.y - 1);
    });
  }

  getValidPartNumbers(): PartNumber[] {
    return this.numbers.filter((number) =>
      this.getNeighbouringSymbolsForNumber(number).length > 0
    );
  }

  getNeighbouringNumbersForSymbol(symbol: Symbol): PartNumber[] {
    return this.numbers.filter((number) => {
      return number.x <= symbol.x + 1 &&
        number.x + number.digits >= symbol.x &&
        number.y <= symbol.y + 1 &&
        number.y >= symbol.y - 1;
    });
  }
}

// Part 1
const schematic = lines.reduce((schematic, line, index) => {
  const numberMatches = line.matchAll(/\d+/g) ?? [];
  for (const match of numberMatches) {
    schematic.numbers.push({
      value: Number.parseInt(match[0]),
      digits: match[0].length,
      x: match.index!,
      y: index,
    });
  }

  const symbolMatches = line.matchAll(/[^\d.]/g) ?? [];
  for (const match of symbolMatches) {
    schematic.symbols.push({
      value: match[0],
      x: match.index!,
      y: index,
    });
  }

  return schematic;
}, new Schematic());

const sumOfValidPartNumbers = schematic.getValidPartNumbers().reduce(
  (sum, num) => sum + num.value,
  0,
);

const rendering =
  `<html><body><div style="font-family:monospace;font-size: 12px;">
   ${
    lines.map((line, index) => {
      return `<div>${
        [...line].map((_, charIndex) =>
          `<div style="position: absolute; top:${index * 12}px; left:${
            charIndex * 12 * 0.6
          }px; border: 1px solid rgba(0,0,0,0.125); width:${
            12 * 0.6
          }px; height:12px"></div>`
        ).join("")
      }</div>`;
    }).join("")
  }
    ${
    schematic.numbers.map((number) =>
      `<div 
        style="position: absolute; left:${number.x * 12 * 0.6}px; top:${
        number.y * 12
      }px;${
        schematic.getNeighbouringSymbolsForNumber(number).length > 0
          ? "color: green;"
          : "color: red;"
      }">
        ${number.value}
        </div>`
    ).join("")
  }
    ${
    schematic.symbols.map((symbol) =>
      `<div 
        style="position: absolute; left:${symbol.x * 12 * 0.6}px; top:${
        symbol.y * 12
      }px;
      ${
        symbol.value === "*" &&
          schematic.getNeighbouringNumbersForSymbol(symbol).length === 2
          ? "color: orange;"
          : ""
      }
      ">
        ${symbol.value}
        </div>`
    ).join("")
  }
</div></body></html>`;

const encoder = new TextEncoder();
const data = encoder.encode(rendering);
Deno.writeFileSync("rendering.html", data);

console.log(`Part 1: ${sumOfValidPartNumbers}`);

// Part 2
const sumOfGearRatios = schematic.symbols
  .filter((symbol) => symbol.value === "*")
  .map((symbol) =>
    schematic.getNeighbouringNumbersForSymbol(symbol)
  )
  .filter(numbers => numbers.length === 2)
  .map(([gear1, gear2]) => {
    return gear1.value * gear2.value
  })
  .reduce((sum, num) => sum + num);

  console.log(`Part 2: ${sumOfGearRatios}`);
