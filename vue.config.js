const path = require('path');//addas

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  configureWebpack: {
    entry: './src/main.ts',
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                compilerOptions: {
                  preserveWhitespace: false
                }
              }
            },
            {
              loader: path.resolve(
                __dirname,
                './example/build/md-loader/index.js'
              )
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".js", ".vue", ".json", ".ts", ".tsx"]
    }
  }
};
