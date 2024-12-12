const autoReactIntlPlugin = require('../plugins/babel/auto-intl-plugin.js');

const messages = new Set();
const preBuildConfig = {
  presets: ['@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    [
      autoReactIntlPlugin,
      {
        messages: messages,
      },
    ],
  ],
};

module.exports = {
  factory: ({ isESM, prebuild }) => {
    return prebuild
      ? preBuildConfig
      : {
          presets: [
            '@babel/preset-react',
            [
              '@babel/preset-env',
              {
                modules: isESM ? false : 'commonjs',
                targets: {
                  browsers: [
                    '> 0.5%',
                    'last 2 versions',
                    'Firefox ESR',
                    'not dead',
                    'not IE 11',
                  ],
                },
              },
            ],
          ],
        };
  },
  messages: messages,
};
