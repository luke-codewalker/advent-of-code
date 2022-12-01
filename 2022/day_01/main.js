import { open } from 'node:fs/promises';

const file = await open('./input.txt');

const inventory = [0];
let inventoryIndex = 0;
for await (const line of file.readLines()) {
  if(line.length > 0) {
    inventory[inventoryIndex] += parseInt(line);
  } else {
    inventory[++inventoryIndex] = 0;
  }
}

// sort in descending order
const sortedInventory = inventory.sort((a,b) => b - a);

console.log(`The elf with the most calories carries ${sortedInventory[0]}`)
console.log(`The top three elves carry ${sortedInventory.slice(0, 3).reduce((sum, c) => sum + c , 0)} in total`)