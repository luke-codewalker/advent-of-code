import { open } from 'node:fs/promises';
const INPUT_FILE = `${process.cwd()}/data/input.txt`;

const file = await open(INPUT_FILE);

for await (const line of file.readLines()) {

}

