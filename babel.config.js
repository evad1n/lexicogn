module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@/*": './*',
            "~/*": './src/*',
            "_assets/*": './src/assets/*',
            "_components/*": './src/components/*',
          }
        }
      ],
    ],
  };
};
