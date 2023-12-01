const sessionCookie = await Deno.readTextFile(".session_cookie");
import { Eta } from "https://deno.land/x/eta@v3.0.3/src/index.ts";
const viewpath = Deno.cwd() + "/cli/templates/";
const eta = new Eta({ views: viewpath, cache: true });

const year = 2023;
const day = 1;
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

const solutionFile = eta.render("./solution", {
  day: day.toString().padStart(2, "0"),
  year,
});

const text = await res.text();
await Deno.mkdir(`./${year}/day_${day.toString().padStart(2, "0")}/data`, {
  recursive: true,
});
await Deno.writeTextFile(
  `./${year}/day_${day.toString().padStart(2, "0")}/data/input.txt`,
  text,
);
await Deno.writeTextFile(
  `./${year}/day_${day.toString().padStart(2, "0")}/data/test.txt`,
  "### Replace with test data ###",
);
await Deno.writeTextFile(
  `./${year}/day_${day.toString().padStart(2, "0")}/solution.ts`,
  solutionFile,
);
