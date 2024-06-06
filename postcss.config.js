module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-nesting': {},
        'cssnano': {
            preset: 'default'
        },
        'tailwindcss/nesting': {},
        tailwindcss: {},
        autoprefixer: {},
        'postcss-preset-env': {
            features: { 'nesting-rules': true },
        },
    },
}