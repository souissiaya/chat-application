//the whole app has to use babel
const { moduleExpression } = require('@babel/types');

require ('@babel/register')({
      //contains set of plugins to convert ES6 features to ES5
      presets: ["@babel/preset-env"]
});

//starts executing the appli code
module.exports = require ('./app');     