const { execFileSync } = require("child_process");

function run(command, args) {
  execFileSync(command, args, { stdio: "inherit", shell: true });
}

run("npx", ["prisma", "generate"]);

if (process.env.DATABASE_URL) {
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.log("DATABASE_URL not set, skipping prisma migrate deploy");
}

run("npx", ["next", "build"]);
