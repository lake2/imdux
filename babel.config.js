const presets = [
    [
        "@babel/preset-env",
        {
            "targets": {
                "chrome": "30",
                "ie": "10",
            }
        }
    ],
    "@babel/preset-typescript"
];

const plugins = [
    "@babel/plugin-transform-runtime",
];

module.exports = { presets, plugins };
