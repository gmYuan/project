## 1.安装依赖
-[customize-cra](https://github.com/arackaf/customize-cra)

```js
yarn add @babel/core @babel/plugin-proposal-class-propertie @babel/plugin-proposal-decorators @babel/preset-env customize-cra
```

## 2.添加配置文件
config-overrides.js
```js
const {
  override,
  addDecoratorsLegacy
} = require("customize-cra");


module.exports = override(
  addDecoratorsLegacy()
);
```
## 3. 修改脚本
```js
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
  },
```