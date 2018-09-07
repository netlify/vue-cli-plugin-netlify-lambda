# vue-cli-plugin-netlify-lambda

> netlify-lambda plugin for vue-cli

Sets up [netlify-lambda](https://github.com/netlify/netlify-lambda) for vue-cli projects to build and serve AWS lambda functions.

## Installing in an Already Created Project

```
vue add netlify-lambda
```

## Usage

This ads a `netlify.toml` and a `src/lambda` folder with an example `hello.js` lambda function.

Any js file added in `src/lambda` will be built as a lambda. It will be compiled with webpack and babel and any imports will be bundled (no native dependencies, though).

When deployed to Netlify, the AWS lambda's are reachable under `/.netlify/functions/:name` - ie, the `hello.js` Lambda will be available under `/.netlify/functions/hello`.

The plugin also sets up a proxy and runs the Lambdas locally, to simplify local development.
