var dropletLoader = function(source) {
  return `require("droplet-plugin/public-path");${source}`;
};

exports.default = dropletLoader;
