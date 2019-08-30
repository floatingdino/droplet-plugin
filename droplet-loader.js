export default function(source) {
  return `import "droplet-plugin/public-path";
${source}`;
}
