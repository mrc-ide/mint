const Plotly = require('plotly.js/lib/core');

// Load in the trace types for scatter and bar
Plotly.register([
    require('plotly.js/lib/scatter'),
    require('plotly.js/lib/bar')
]);

module.exports = Plotly;
