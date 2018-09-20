const serve = require("netlify-lambda/lib/serve");
const build = require("netlify-lambda/lib/build");

const server = serve.listen(9000)
const [, , webpackConfig] = process.argv;
build.watch("src/lambda", webpackConfig, function(err, stats) {
  if (err) {
    console.error(err);
    return;
  }

  stats.compilation.chunks.forEach(function(chunk) {
    server.clearCache(chunk.name);
  });

  console.log(stats.toString({ color: true }));
});