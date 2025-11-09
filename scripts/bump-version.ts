import { exec } from "child_process";
import fs from "fs";

type JSONWithVersion = {
  version: string;
};

const bumpVersion = (newVersion: string, release: string = "patch"): string => {
  const [major, minor, patch] = newVersion.split(".").map(Number);
  if (release === "major") return `${major + 1}.0.0`;
  if (release === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`; // default = patch
};

const updateVersion = (file: string, newVersion: string) => {
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as JSONWithVersion;
  data.version = newVersion;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${file} → ${newVersion}`);
};

const pkg = JSON.parse(
  fs.readFileSync("package.json", "utf8")
) as JSONWithVersion;
const newVersion = bumpVersion(pkg.version, process.argv[2] || "patch");

const updateReadmeVersion = (path: string, newVersion: string) => {
  const content = fs.readFileSync(path, "utf8");

  const lines = content.split("\n");
  const newBadgeLine = `[![Version](https://img.shields.io/badge/version-${newVersion}-blue.svg)](https://github.com/mateuszklusek/youtube-settings-controller/releases/tag/v${newVersion})`;

  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes("youtube-settings-controller/releases/tag")) {
      lines[i] = newBadgeLine;
      break;
    }
  }
  const updatedContent = lines.join("\n");
  fs.writeFileSync(path, updatedContent);
  console.log(`Updated ${path} → ${newVersion}`);
};

// --------------------------------- main ------------------------------------- //

updateVersion("package.json", newVersion);
updateVersion("manifest.json", newVersion);
updateReadmeVersion("README.md", newVersion);

console.log("Committing changes...");

const gitCommandList = [
  "git add .",
  `git commit -m 'Bump version to ${newVersion}'`,
  `git tag v${newVersion}`,
];

exec(gitCommandList.join(" && "), (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});
