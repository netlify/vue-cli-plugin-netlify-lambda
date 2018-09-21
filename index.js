const { fork } = require('child_process')
const path = require('path')
const lambdaBuild = require('netlify-lambda/lib/build')
const lambdaServe = require("netlify-lambda/lib/serve");

const buildFunction = () => {
  return lambdaBuild
    .run("src/lambda")
    .then(stats => {
      console.log(stats.toString({ color: true }))
    })
    .catch(err => {
      console.log(err)
      process.exit(1)
    })
}
const serveFunction = () => {
  return lambdaServe
    .listen('9000')
}

module.exports = (api, projectOptions) => {
  api.registerCommand(
    `netlify-lambda:build`,
    {
      description: "build a netlify function",
      usage: "vue-cli-service netlify-lambda"
    },
    buildFunction
  )
  api.registerCommand(
    `netlify-lambda:serve`,
    {
      description: "build a netlify function",
      usage: "vue-cli-service netlify-lambda"
    },
    serveFunction
  )
}
