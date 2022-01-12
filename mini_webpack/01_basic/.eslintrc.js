module.exports = {
    // 需要一个parser解析器 帮我们把源代码 转成抽象语法树
    parser: "@babel/eslint-parser",
    extends: 'airbnb',

    // 指定解析器选项
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2015,
        requireConfigFile: false,
    },

    // 指定脚本的运行环境
    env: {
        browser: true,
    },
    // 启用的规则及其各自的错误级别
    rules: {
        indent: "off", // 缩进风格
        quotes: "off", // 引号类型
        "no-console": "off", // 禁止使用console
        "no-unused-vars": "off",
        "no-undef": "off",
        "prefer-rest-params": "off",
    },
};
