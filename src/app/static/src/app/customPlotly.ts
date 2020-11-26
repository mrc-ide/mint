const Plotly = require('plotly.js/lib/core');

// here we register only those plots that we need, to minimize bundle size
Plotly.register([
    require('plotly.js/lib/scatter'),
    require('plotly.js/lib/bar')
]);

module.exports = Plotly;
