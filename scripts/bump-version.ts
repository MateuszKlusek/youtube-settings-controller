import { exec } from "child_process";
import fs from "fs";

type JSONWithVersion = {
  version: string;
};

function bumpVersion(version: string, release: string = "patch"): string {
  const [major, minor, patch] = version.split(".").map(Number);
  if (release === "major") return `${major + 1}.0.0`;
  if (release === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`; // default = patch
}

function updateVersion(file, newVersion) {
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as JSONWithVersion;
  data.version = newVersion;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${file} → ${newVersion}`);
}

const pkg = JSON.parse(
  fs.readFileSync("package.json", "utf8")
) as JSONWithVersion;
const newVersion = bumpVersion(pkg.version, process.argv[2] || "patch");

updateVersion("package.json", newVersion);
updateVersion("manifest.json", newVersion);

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
