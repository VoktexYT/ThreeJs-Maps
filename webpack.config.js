const path = require('path');

module.exports = {
  entry: './src.2D.RBFight/index.ts', // Entry point for your application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: './dist', // Serve files from the 'dist' folder
    open: true,       // Automatically open the browser
  },
  mode: 'development',
};
