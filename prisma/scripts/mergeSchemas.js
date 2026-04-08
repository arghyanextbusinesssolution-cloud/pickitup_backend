const fs = require("fs");
const path = require("path");

const base = fs.readFileSync(
  path.join(__dirname, "../base.prisma"),
  "utf8"
);

const modelsDir = path.join(__dirname, "../models");

const files = fs
  .readdirSync(modelsDir)
  .filter(f => f.endsWith(".prisma"));

let models = "";

for (const file of files) {
  models += "\n" +
    fs.readFileSync(
      path.join(modelsDir, file),
      "utf8"
    );
}

fs.writeFileSync(
  path.join(__dirname, "../schema.prisma"),
  base + models
);

console.log("Schema merged.");
