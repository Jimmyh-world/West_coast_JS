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
      // Handle JavaScript files
      if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      }
      // Handle JSON files
      if (req.url.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      }
      // Handle HTML files
      if (req.url.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      }
      // Add CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      next();
    },
  ],
};
