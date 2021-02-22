module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": '.',
            "~": './src',
            "_assets": './src/assets',
            "_components": './src/components',
            "_nav": './src/nav',
            "_db": './src/db',
          }
        }
      ],
    ],
  };
};
