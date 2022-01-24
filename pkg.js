const { exec } = require("pkg");
const fs = require("fs");
const path = require("path");
(async () => {
  await exec(["dist/index.js", "--target", "node16-linux,node16-win,node16-mac", "--output", "dist/bin/pco"]);
  fs.mkdirSync("dist/linux", { recursive: true });
  fs.mkdirSync("dist/mac", { recursive: true });
  fs.mkdirSync("dist/win", { recursive: true });

  fs.copyFileSync(`dist/bin/pco-linux`, `dist/linux/pco`);
  fs.copyFileSync(`dist/bin/pco-macos`, `dist/mac/pco`);
  fs.copyFileSync(`dist/bin/pco-win.exe`, `dist/win/pco.exe`);
})();
