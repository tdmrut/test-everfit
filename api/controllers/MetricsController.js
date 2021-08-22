'use strict'

const db = require('./../db')
const convert = require('convert-units')

const table = 'metrics'

module.exports = {
  get: (req, res) => {
    const params = req.query
    const userId = params.user_id
    const unit = params.unit
    if (!userId) {
      return res.status(400).send({ error: true, message: 'Please provide user id' });
    }

    let mode = 1;
    if (params.mode) {
      switch (req.query.mode) {
        case 'last_1_month':
          mode = 1;
        case 'last_2_month':
          mode = 2;
        case 'last_6_month':
          mode = 6;
        case 'last_12_month':
          mode = 12;
      }
    }

    db.query(`SELECT * FROM ${table} WHERE user_id = ? 
      AND date >= last_day(now()) + interval 1 day - interval ? month`, [userId, mode], (err, response) => {
      if (err) throw err
      if (response.length && unit) {
        response.forEach(function (metric) {
          if (metric.unit !== unit) {
            metric.value = convert(metric.value).from(metric.unit).to(unit)
            metric.unit = unit
          }
        });
      }
      res.json({
        error: false,
        data: response
      })
    })
  },

  store: (req, res) => {
    let metric = req.body;
    if (!Object.keys(metric).length) {
      return res.status(400).send({ error: true, message: 'Please provide data metric' });
    }
    let sql = `INSERT INTO ${table} SET ?`
    db.query(sql, [metric], (err, results) => {
      if (err) throw err
      res.json({
        error: false,
        message: 'Created metric success!'
      })
    })
  }
}