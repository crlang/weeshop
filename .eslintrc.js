module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jquery": true,
    "node": true
  },
  "globals": {
    "require": true,
    "__dirname": true,
    "module": true,
    "weui": true,
    "wx": true,
    "getApp": true,
    "Page": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "indent": ["error", 2],
    "strict": "off",
    "no-unused-vars": "warn",
    "no-console": "warn",
    "comma-dangle": ["off", "always"],
    "eqeqeq": "warn",
    "linebreak-style": ["error", "unix"],
    "quotes": ["off", "double"],
    "semi": ["error", "always"]
  }
};