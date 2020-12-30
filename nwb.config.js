const path = require('path');
var vuePlugin = {
  'framework:vue': ['factory', function (/* config.files */ files) {
    files.unshift({ pattern: __dirname + '/node_modules/vue/dist/vue.global.prod.js', included: true, served: true, watched: false });
    files.unshift({ pattern: __dirname + '/node_modules/@vue/compiler-dom/dist/compiler-dom.global.js', included: true, served: true, watched: false });
  }]
};

module.exports = {
  type: 'web-module',
  webpack: {
    extra: {
      output: {
        globalObject: 'this',
      },
    },
  },
  npm: {
    cjs: false,
    esModules: false,
    umd: {
      global: 'VueKonva',
      externals: {
        vue: 'Vue',
        konva: 'Konva',
      },
    },
  },
  // may be useful for debugging tests
  karma: {
    browsers: ['Chrome'],
    frameworks: ['mocha', 'vue'],
    plugins: [vuePlugin],
  },
};
