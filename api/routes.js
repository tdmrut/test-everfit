'use strict';
module.exports = (app) => {
  var metricsCtrl = require('./controllers/MetricsController');

  // todoList Routes
  app.route('/metrics')
    .get(metricsCtrl.get)
    .post(metricsCtrl.store);

};