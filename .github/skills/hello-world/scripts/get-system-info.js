const os = require("os");

console.log({
  type: os.type(),
  platform: os.platform(),
  release: os.release(),
  arch: os.arch(),
  version: os.version(),
});
