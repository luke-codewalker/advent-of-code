// Advent of Code solution for 04.12.2023
const puzzleInput = await Deno.readTextFile(
  Deno.cwd() + "/2023/day_04/data/input.txt",
);
const testData = await Deno.readTextFile(
  Deno.cwd() + "/2023/day_04/data/test.txt",
);

type WinningNumbers = [number, number, number, number, number];
type Numbers = [number, number, number, number, number, number, number, number];

const lines = puzzleInput.trim().split("\n");

const cards: [WinningNumbers, Numbers][] = lines
  .map((line) => {
    const numberStrings = line.split(":")[1].trim().split("|");
    const winningNumbers = numberStrings[0].trim().split(/\s+/).map((s) =>
      parseInt(s)
    ) as WinningNumbers;
    const numbers = numberStrings[1].trim().split(/\s+/).map((s) =>
      parseInt(s)
    ) as Numbers;

    return [winningNumbers, numbers];
  });

// Part 1:
const winningNumbers: number[][] = cards.map(([winNumbers, numbers]) => {
  return numbers.filter((n) => winNumbers.includes(n));
});

const points = winningNumbers.map((numbers) =>
  numbers.length > 0 ? 2 ** (numbers.length - 1) : 0
).reduce((sum, n) => sum + n);

console.log(points);

// Part 2:
const additionalCards = new Array(cards.length).fill(0);
const finalCards = winningNumbers.map((numbers) => {
  const wins = numbers.length;
  const cardInstances = 1 + additionalCards.shift();

  for (let i = 0; i < wins; i++) {
    additionalCards[i] += cardInstances;
  }

  return cardInstances;
}).reduce((sum, n) => sum + n);

console.log(finalCards);
