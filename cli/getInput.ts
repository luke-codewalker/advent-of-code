import { Eta } from "https://deno.land/x/eta@v3.0.3/src/index.ts";
import { parse } from "https://deno.land/std@0.207.0/flags/mod.ts";

const loadSessionCookie = async (): Promise<string> => {
  try {
    const sessionCookie = await Deno.readTextFile(".session_cookie");
    if (sessionCookie.length === 0) {
      throw new Error("No content in .session_cookie. Please supply session cookie in .session_cookie file");
    }
    return sessionCookie
  } catch (error) {
    throw new Error(error + " Please supply session cookie in .session_cookie file");
  }
};

const today = new Date();
const flags = parse(Deno.args, {
  string: ["day", "year"],
  default: { year: `${today.getFullYear()}`, day: `${today.getDate()}` },
});

const parseArgs = (
  args: { day: string; year: string },
): { day: number; year: number } => {
  const day = Number.parseInt(args.day);
  const year = Number.parseInt(args.year);
  if (Number.isNaN(day) || Number.isNaN(year)) {
    throw new Error("supply proper day and year");
  }

  return { day, year };
};

const viewpath = Deno.cwd() + "/cli/templates/";
const eta = new Eta({ views: viewpath, cache: true });

const { year, day } = parseArgs(flags);

const sessionCookie = await loadSessionCookie();

console.log(`Fetching data for day ${day} of ${year}`);

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
