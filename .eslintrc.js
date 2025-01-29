module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "commonjs",
  },
  plugins: ["node", "import"],
  rules: {
    "no-console": "off",
    "no-unused-vars": "warn",
    "node/no-unsupported-features/es-syntax": "off",
    "import/no-unresolved": 2,
    "node/no-missing-require": 2,
    "node/no-extraneous-require": 2,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
