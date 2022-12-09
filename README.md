[![npm][npm]][npm-url]
[![node][node]][node-url]
[![GitHub issues](https://img.shields.io/github/issues/zzlw/html-webpack-cdn.svg)](https://github.com/zzlw/html-webpack-cdn/issues)
[![GitHub forks](https://img.shields.io/github/forks/zzlw/html-webpack-cdn.svg)](https://github.com/zzlw/html-webpack-cdn/network)
[![GitHub stars](https://img.shields.io/github/stars/zzlw/html-webpack-cdn.svg)](https://github.com/zzlw/html-webpack-cdn/stargazers)
[![GitHub license](https://img.shields.io/github/license/zzlw/html-webpack-cdn.svg)](https://github.com/zzlw/html-webpack-cdn/blob/main/LICENSE)

<div align="center">
  <div>
    <img width="100" height="100" title="Webpack Plugin" src="http://michael-ciniawsky.github.io/postcss-load-plugins/logo.svg">
  </div>
  <h1>html-webpack-cdn</h1>
  <p>无需配置 webpack externals 自动向 html-webpack-plugins 模板注入 unpkg cdn</p>
</div>

<h2 align="center">Install</h2>

<h3>Webpack 5</h3>

```bash
  npm i --save-dev html-webpack-cdn
```

```bash
  yarn add --dev html-webpack-cdn
```

```js
// 无需配置 webpack externals
// modules 为空则不会生效
const WebpackHtmlCdnPlugin = require("html-webpack-cdn");

const cdnEnv = process.env.NODE_ENV === 'development' ? 'development' : 'production.min';

new HtmlWebpackCdnPlugin({
  modules: [
    { name: 'react', _var: 'React', path: `umd/react.${cdnEnv}.js` },
    { name: 'react-dom', _var: 'ReactDOM', path: `umd/react-dom.${cdnEnv}.js` },
  ],
})
```

```html
<!-- html 中效果 -->
<script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
```

[npm]: https://img.shields.io/npm/v/html-webpack-cdn.svg
[npm-url]: https://npmjs.com/package/html-webpack-cdn

[node]: https://img.shields.io/node/v/html-webpack-cdn.svg
[node-url]: https://nodejs.org
