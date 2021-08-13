const HtmlWebpackPlugin = require("html-webpack-plugin");

// 获取 包 版本号
const getModulesVersion = () => {
  let mvs = {};
  let regexp = /^npm_package_.{0,3}dependencies_/gi;
  for (let m in process.env) {
    // 从node内置参数中读取，也可直接import 项目文件进来
    if (regexp.test(m)) {
      // 匹配模块
      // 获取到模块版本号
      mvs[m.replace(regexp, "").replace(/_/g, "-")] = process.env[m].replace(
        /(~|\^)/g,
        ""
      );
    }
  }
  return mvs;
};

const package_version = getModulesVersion();

let cdnSource = [];

// 默认 cdn 供应商
const UNPKG = "UNPKG";

const cdnSourcePaths = {
  [UNPKG]: `https://unpkg.com`,
};

const isEmpty = (rest = {}) => Object.values(rest).includes(undefined);

const getSourcePath = ({ packageName, version, path, cdnType }) => {
  if (cdnType === UNPKG) {
    return `${cdnSourcePaths[UNPKG]}/${packageName}@${version}/${path}`;
  }
};

// 默认配置
const defaultConfig = {
  cdnType: UNPKG,
};

class HtmlWebpackCdnPlugin {
  constructor({ modules = [], ...config } = {}) {
    this.modules = modules;
    this.config = { ...defaultConfig, ...config };
  }
  apply(compiler) {
    const webpackExternals = (compiler.options.externals =
      compiler.options.externals || {});

    // 没有 externals return
    if (JSON.stringify(webpackExternals) == "{}" && !this.modules.length)
      return;

    if (
      Object.prototype.toString.call(webpackExternals) === "[object Object]"
    ) {
      this.modules.forEach((item) => {
        const { name, _var, path } = item;
        if (isEmpty({ name, _var, path })) {
          console.error(
            "\x1B[31m%s\x1B[0m",
            `未匹配 CDN ${name}, 请检查参数 HtmlWebpackCdnPlugin modules`
          );
          return;
        }
        webpackExternals[item.name] = item._var;
      });
    }

    compiler.hooks.compilation.tap(
      "HtmlWebpackCdnPlugin",
      (compilation, compilationParams) => {
        Object.keys(webpackExternals).forEach(async (packageName) => {
          // 已装载过 cdn
          if (cdnSource.some((item) => item.name === packageName)) return;
          // 获取包的版本号
          const version = package_version[packageName];
          // modules cdn
          const path = this.modules.find(
            (item) => item.name === packageName
          )?.path;
          const initPath = getSourcePath({
            packageName,
            version,
            path,
            ...this.config,
          });
          cdnSource.push({
            name: packageName,
            path: initPath,
          });
        });
        HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
          "HtmlWebpackCdnPlugin",
          (data, cb) => {
            cdnSource.forEach((item) => {
              data.bodyTags.unshift({
                tagName: "script",
                voidTag: false,
                attributes: { defer: false, src: item.path },
              });
            });
            cb(null, data);
          }
        );
      }
    );
  }
}
module.exports = HtmlWebpackCdnPlugin;
