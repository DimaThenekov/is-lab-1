// eslint.config.js
const js = require('@eslint/js');
const  securityPlugin =  require ( 'eslint-plugin-security' ) ;
const  globals =  require ( 'globals' ) ;
const  jest =  require ( 'eslint-plugin-jest' ) ;

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
		...jest.environments.globals.globals
      }
    },
    plugins: {
      jest: jest,
      security: securityPlugin
    },
    rules: {
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-unused-vars": "warn",
      //"no-console": "warn",
      ...securityPlugin.configs.recommended.rules
    }
  }
];