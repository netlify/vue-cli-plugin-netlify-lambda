const fs = require('fs')

module.exports = (api, options, rootOptions) => {
  api.render("./template")

  fs.appendFileSync(api.resolve(".gitignore"), "\n# Compiled Lambda functions\n/lambda/\n")
}