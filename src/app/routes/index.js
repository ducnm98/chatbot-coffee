module.exports = app => {
  app.use('/customers', require('./customers'))
  app.use('/bills', require('./bills'))
  app.use('/products', require('./products'))
  app.use('/categories', require('./categories'))
  app.use('/', require('./homepage'))
}
