module.exports = (app) => {
  app.use('/', (req, res) => {
    return res.render('index', {
      title: 'Flight Search APP'
    });
  });
};
