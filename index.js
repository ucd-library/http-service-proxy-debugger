const express = require('express');
const httpProxy = require('http-proxy');

if( !process.env.TARGET ) {
  console.error('No TARGET env variabled defined.');
  process.exit(-1);
}

const app = express();
const proxy = httpProxy.createProxyServer({})
proxy.on('error', err => console.log('HTTP SERVICE PROXY DEBUGGER ERROR:', err));

let openRequests = [];
class BodyWrapper {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.data = '';

    req.on('data', data => this.data += data.toString());
  }
}

function printRequest(req, res, body) {
  console.log(`=== HTTP SERVICE PROXY - REQUEST START ===
${res.statusCode} ${req.method} ${req.originalUrl}
${JSON.stringify(req.headers, '  ', '  ')}
${body || '[empty body]'}
**** RESPONSE ****
${JSON.stringify(res.headers, '  ', '  ')}
=== HTTP SERVICE PROXY - REQUEST END ===`)
}

proxy.on('proxyRes', function (proxyRes, req, res) {
  let index = openRequests.findIndex(bw => bw.req === req);
  if( index > -1 ) {
    let bw = openRequests.splice(index, 1)[0];
    printRequest(req, proxyRes, bw.data);
  } else {
    console.log('HTTP SERVICE PROXY DEBUGGER ERROR: unable to find service request body');
    printRequest(req, res);
  }
});

app.all(/.*/, (req, res) => {
  openRequests.push(new BodyWrapper(req, res));
  proxy.web(req, res, { target: process.env.TARGET});
});

app.listen(process.env.PORT || 3000, () => {
  console.log('HTTP service proxy debugger listening on port: '+(process.env.PORT || 3000));
  console.log('Target proxy: '+process.env.TARGET)
});