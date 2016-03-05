module.exports = function(options, imports, register) {
  'use strict';
  var lasso = require('lasso');
  var staticMiddleware = require('lasso/middleware');
  var path = require('path');

  var log = imports.debug('stonecraft:lasso');
  log('start');

  lasso.Config = options.lasso;
  lasso.configure(lasso.Config);

  function create(localLassoConfig, dirName){
    var stampit = imports.stampit;
    if (localLassoConfig.outputDir === '__dirname') {
      localLassoConfig.outputDir = path.join(dirName, 'static');
    }
    // Avoid modifying the original config
    var stamp = stampit().props(lasso.Config);
    var newConfig = stamp(localLassoConfig);
    return lasso.create(newConfig);
  }

  function serveStatic(app, config){
    app.use(staticMiddleware.serveStatic(config));
  }

  function serve(app, localLassoConfig, dirName){
    var localLasso = create(localLassoConfig, dirName);
    serveStatic(app, {
      lasso: localLasso
    });
    return localLasso;
  }

  var lassoService = {
    create: create,
    serveStatic: serveStatic,
    serve: serve
  };

  log('register');
  register(null, {
    lasso: lassoService
  });

};
