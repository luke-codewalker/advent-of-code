import { open } from 'node:fs/promises';

const file = await open(`${process.cwd()}/data/test.txt`);

for await (const line of file.readLines()) {

}
