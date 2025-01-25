const path = require('path'); // Use CommonJS require
const webpack = require('webpack');
const dotenv = require('dotenv');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


// Load environment variables from .env file
dotenv.config();


module.exports = {

  mode: 'development',  // Or 'production' when you're ready
  entry: './content/content.js',
  mode: 'development',
  devtool: 'source-map',  // Your content script entry
  output: {
    filename: 'content.bundle.js',  // Output bundled file
    path: path.resolve(__dirname, 'dist'),  // Path for the output bundle
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
        'process.env.SUPABASE_KEY': JSON.stringify(process.env.SUPABASE_KEY),
    }),
    new CleanWebpackPlugin(),
],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],  // Transpile to ES5
          },
        },
      },
    ],
  },
  devtool: 'source-map',  // Use source maps without eval (no 'unsafe-eval')
  optimization: {
    minimize: false,  // Optional: turn off minimization (especially in dev mode)
  },
};
