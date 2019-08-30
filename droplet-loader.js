var dropletLoader = function(source) {
  return `require("droplet-plugin/public-path");${source}`;
};
// TODO: figure out exports
exports.default = dropletLoader;
