module.exports = {
  port: 8080, // This matches your current setup
  root: './', // Serve from project root
  open: true, // Open browser automatically
  file: 'src/index.html', // Your entry point
  wait: 1000, // Wait for all changes
  mount: [['/node_modules', './node_modules']], // Mount node_modules
  logLevel: 2, // Show all logs
  middleware: [
    function (req, res, next) {
      // Ensure correct MIME type for JavaScript modules
      if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      next();
    },
  ],
};
