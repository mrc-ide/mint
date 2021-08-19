module.exports = {
    "testEnvironment": "jsdom",
    "setupFiles": ["./src/tests/setup.ts", "jest-canvas-mock"],
    "testURL": "http://localhost:8080",
    "globals": {
        "ts-jest": {
            tsconfig: 'tsconfig.json',
            "diagnostics": {
                "warnOnly": false
            }
        }
    },
    "moduleFileExtensions": [
        "js",
        "json",
        "vue",
        "ts"
    ],
    "transform": {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.ts?$": "ts-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
     },
    "transformIgnorePatterns": [
        "/node_modules/(?!mathjs).+\\.js"
    ],
    "coverageDirectory": "./coverage/",
    "collectCoverage": true,
    "coveragePathIgnorePatterns": [
        "/node_modules/",
        "./tests/mocks.ts",
        "./tests/testHelpers.ts",
        "./tests/.*/helpers.ts",
        "./app/components/figures/graphs/plotly/.*"
    ]
};
