module.exports = {
    root: true,
    extends: '@react-native-community',
    plugins: ['import'],
    settings: {
        'import/resolver': {
            node: {
                paths: ['src'],
                alias: {
                    "@/*": './*',
                    "~/*": './src/*',
                    "_assets/*": './src/assets/*',
                    "_components/*": './src/components/*',
                    "_nav/*": './src/nav/*',
                    "_db/*": './src/db/*',
                    "_hooks/*": './src/hooks/*',
                    "_styles/*": './src/styles/*',
                },
            },
        },
    },
};