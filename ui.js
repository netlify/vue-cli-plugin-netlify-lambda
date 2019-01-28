const fs = require('fs');
const path = require('path');

function getConfigData(data) {
  return (data.vue && data.vue.pluginOptions && data.vue.pluginOptions.netlify) || {};
}

module.exports = api => api.describeConfig({
  id: 'com.netlify.netlify-lambda',
  name: 'Netlify configuration',
  description: 'Configure Netlify Functions',
  link: 'https://github.com/netlify/vue-cli-plugin-netlify-lambda',
  files: {
    vue: {
      js: ['vue.config.js'],
    },
  },
  onRead({ data, cwd }) {
    return {
      prompts: [
        {
          name: 'webpackConfig',
          type: 'input',
          default: null,
          value: getConfigData(data).webpackConfig,
          validate: input => fs.existsSync(path.join(cwd, input)),
          message: 'Webpack config module',
          description: 'Additional webpack configuration',
        },
      ],
    };
  },
  async onWrite({ api: writeApi, prompts }) {
    const result = {};
    for (const prompt of prompts) {
      result[`pluginOptions.netlify.${prompt.id}`] = await writeApi.getAnswer(prompt.id);
    }
    writeApi.setData('vue', result);
  },
});
