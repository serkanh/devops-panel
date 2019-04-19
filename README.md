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

4. Once installed add following snippet to package.json

````
 "babel": {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react"
    ],
    "plugins": [
      "transform-class-properties"
    ]
  },
````

Final package.json should look like the following:
````
{
  "name": "devops-panel",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "babel": {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react"
    ],
    "plugins": [
      "transform-class-properties"
    ]
  },
  "scripts": {
    "start": "webpack-dev-server --open",
    "build": "NODE_ENV='production' webpack",
    "build-for-windows": "SET NODE_ENV='production' && webpack",
    "firebase-init": "firebase login && firebase init",
    "deploy": "npm run build && firebase deploy"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/polyfill": "^7.0.0",
    "axios": "^0.18.0",
    "prop-types": "^15.6.2",
    "query-string": "^6.1.0",
    "react": "^16.4.2",
    "react-dom": "^16.4.2",
    "react-router-dom": "^4.3.1"
  },
  "devDependencies": {
    "@babel/core": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^8.0.0",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "css-loader": "^1.0.0",
    "firebase-tools": "^4.2.1",
    "html-webpack-plugin": "^3.2.0",
    "style-loader": "^0.23.0",
    "webpack": "^4.30.0",
    "webpack-cli": "^3.1.0",
    "webpack-dev-server": "^3.1.6"
  }
}
````

5. Finally create webpack.config.js file with the following snippet:
````
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
    ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    })
  ],
  devServer: {
    historyApiFallback: true,
  },
};
````