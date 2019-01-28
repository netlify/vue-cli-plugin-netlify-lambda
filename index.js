const { fork } = require('child_process')
const path = require('path')
const lambdaBuild = require('netlify-lambda/lib/build')

module.exports = (api, projectOptions) => {
  const {build, serve} = api.service.commands;
  const buildFn = build.fn;
  const serveFn = serve.fn;
  const webpackConfig = projectOptions.pluginOptions && projectOptions.pluginOptions.netlify && projectOptions.pluginOptions.netlify.webpackConfig;

  build.fn = async (...args) => {
    try {
      const [res, stats] = await Promise.all([
        buildFn(...args),
        lambdaBuild.run('src/lambda', webpackConfig),
      ]);
      console.log(stats.toString({ color: true }));
      return res;
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  serve.fn = (...args) => {
    const devServer = api.service.projectOptions.devServer = api.service.projectOptions.devServer || {}
    if (!devServer.proxy) {
      devServer.proxy = {}
    }
    devServer.proxy['/.netlify/functions'] = {
      "target": "http://localhost:9000",
      "pathRewrite": {
        "^/\\.netlify/functions": ""
      }
    }

    fork(require.resolve('netlify-lambda'), ['serve', 'src/lambda', ...(webpackConfig ? ['-c', webpackConfig] : [])]);
    return serveFn(...args)
  }
}