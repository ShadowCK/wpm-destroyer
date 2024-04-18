import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import webpack from 'webpack';

const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = dirname(__filename);

export default (env, argv) => {
  const mode = argv.mode || 'development';
  return {
    entry: './src/main.js',
    mode,
    output: {
      path: resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.txt$/,
          type: 'asset/source', // 使用asset/source处理.txt文件
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        WEBPACK_MODE: JSON.stringify(mode === 'production' ? 'production' : 'development'),
      }),
    ],
  };
};
