const { fork } = require('child_process')
const path = require('path')
const lambdaBuild = require('netlify-lambda/lib/build')

module.exports = (api, projectOptions) => {
  const {build, serve} = api.service.commands;
  const buildFn = build.fn;
  const serveFn = serve.fn;
  const webpackConfig = projectOptions.pluginOptions && projectOptions.pluginOptions.netlify && projectOptions.pluginOptions.netlify.webpackConfig;

  build.fn = (...args) => {
    return buildFn(...args).then((res) => {
      return lambdaBuild
        .run("src/lambda", webpackConfig)
        .then(function(stats) {
          console.log(stats.toString({ color: true }))
          return res
        })
        .catch(function(err) {
          console.error(err)
          process.exit(1)
        })
    })
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

    const forked = fork(path.join(__dirname, 'serve.js'), webpackConfig ? [webpackConfig] : null)
    return serveFn(...args)
  }
}