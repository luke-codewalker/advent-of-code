const sessionCookie = await Deno.readTextFile(".session_cookie");
const year = 2022;
const day = 24;
const res = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
  headers: {
    "Cookie": `session=${sessionCookie}`,
  },
});

if (res.status !== 200) {
  console.log(
    "request failed. maybe you need to provide your session cookie in .session_cookie?",
    res,
  );
  Deno.exit();
}

const text = await res.text();
await Deno.mkdir(`./${year}/day_${day}/data`, { recursive: true });
await Deno.writeTextFile(`./${year}/day_${day}/data/input.txt`, text);
