const DEV_MODE = false;
const INPUT_FILE = `data/${DEV_MODE ? "test" : "input"}.txt`;
const text = await Deno.readTextFile(INPUT_FILE);

const snafuStringToDecimal = (string: string): number => {
  const chars = string.split("");

  let num = 0;
  for (let i = 0; i < chars.length; i++) {
    let char = chars[i];
    char = char === "-" ? "-1" : char === "=" ? "-2" : char;
    const factor = 5 ** (chars.length - 1 - i);
    num += factor * parseInt(char);
  }

  return num;
};

// const decimalToBase = (base: number) => (decimal: number): string => {
//   const digits = [];
//   let num = decimal;
//   while (num > 0) {
//     digits.unshift(num % base);
//     num = Math.floor(num / base);
//   }

//   return digits.join("");
// };

const decimalToSnafuString = (decimal: number): string => {
  const digits = [];
  let num = decimal;
  while (num > 0) {
    digits.unshift((num + 2) % 5);
    num = Math.floor((num + 2) / 5);
  }

  return digits.map((d) => {
    switch (`${d}`) {
      case "0":
        return "=";
      case "1":
        return "-";
      case "2":
        return "0";
      case "3":
        return "1";
      case "4":
        return "2";
    }
  }).join("");
};

const lines = text.split("\n");
const numbers: number[] = [];
for (const line of lines) {
  numbers.push(snafuStringToDecimal(line));
}

console.log(decimalToSnafuString(numbers.reduce((sum, x) => sum + x)));
