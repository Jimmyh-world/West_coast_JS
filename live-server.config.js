// live-server.config.js
module.exports = {
  port: 8080,
  root: './',
  open: true,
  file: 'index.html',
  wait: 1000,
  mount: [['/node_modules', './node_modules']],
  middleware: [
    function (req, res, next) {
      // Fix MIME type issues
      if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      }
      // Add proper CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      next();
    },
  ],
};
