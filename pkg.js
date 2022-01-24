const { exec } = require("pkg");
(async () => {
  await exec(["dist/index.js", "--target", "node16-linux,node16-win,node16-mac", "--output", "dist/bin/pco"]);
})();
