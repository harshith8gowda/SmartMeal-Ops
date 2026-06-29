const { execFileSync } = require("child_process");

function run(command, args) {
  execFileSync(command, args, { stdio: "inherit", shell: true });
}

// Safe placeholder values used only when required env vars are missing.
// Real env vars (e.g., on Vercel) are never overwritten.
const placeholders = {
  DATABASE_URL: "postgresql://localhost:5432/mealmap",
  CLERK_SECRET_KEY: "sk_test_placeholder",
  CLERK_WEBHOOK_SECRET: "whsec_placeholder",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_placeholder",
  TOKEN_ENCRYPTION_KEY:
    "0000000000000000000000000000000000000000000000000000000000000000",
};

let databaseUrlIsPlaceholder = false;

for (const [key, value] of Object.entries(placeholders)) {
  if (!process.env[key]) {
    process.env[key] = value;
    console.log(`[build] ${key} missing, using placeholder for build`);
    if (key === "DATABASE_URL") {
      databaseUrlIsPlaceholder = true;
    }
  }
}

run("npx", ["prisma", "generate"]);

if (process.env.DATABASE_URL && !databaseUrlIsPlaceholder) {
  run("npx", ["prisma", "migrate", "deploy"]);
} else if (databaseUrlIsPlaceholder) {
  console.log(
    "[build] DATABASE_URL is a placeholder, skipping prisma migrate deploy"
  );
} else {
  console.log("[build] DATABASE_URL not set, skipping prisma migrate deploy");
}

run("npx", ["next", "build"]);
