module.exports = (app) => {
  app.use('/index.html', (req, res) => {
    return res.render('index', {
      title: 'Flight Search APP'
    });
  });
};
