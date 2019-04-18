### Backend
1. `expaws HA` on a seperate terminal session
2. `serverless offline --start`

### Frontend


#Setup webpack from scratch:
1. Install webpack and webpack cli
yarn add webpack --dev
yarn add webpack-cli --dev

2. Add the following snippet to `package.json`
````
"scripts": {
  "build": "webpack --mode production"
}
````

3. Install babel for transpiling:
````
yarn add @babel/core babel-loader @babel/preset-env @babel/preset-react --dev
````

4. Once installed create a `.babelrc` file in project root.

````
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
````

5. Finally create webpack.config.js file with the following snippet:
````
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
````