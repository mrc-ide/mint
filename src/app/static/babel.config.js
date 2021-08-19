module.exports = {
  "env": {
    "development": {
      "presets": [
        [
          "@babel/present-env",
          {
            "modules": false
          }
        ]
      ]
    },
    "test": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": {
              "node": "current"
            }
          }
        ]
      ]
    }
  }
}