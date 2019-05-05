const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const axios = require('axios');
const config = require('./webpack.config.js');
const compiler = webpack(config);
require('dotenv').config();
const secret = process.env.SECRET;
const app = express();

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Proxy for CORS
app.get('/api/:id', function (req, res) {
    return axios.request({
        url: `http://partnerapi.funda.nl/feeds/Aanbod.svc/json/detail/${secret}/koop/${req.params.id}`,
        method: 'get'
    })
    .then(resp => res.json(resp.data))
    .catch((err) => {
      res.end();
      return err.data
    });
})

// Catch all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
  console.log(`running on port ${port}`);
});
