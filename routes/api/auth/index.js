const {Router} = require('express');
const router = new Router;
const {auth, passport} = require('middlewares/auth');
//const needAuth = require(middlewares + 'needAuth');

router.use(auth);
router.get('/logout', (req, res) => {
  res.logout();
  res.redirect('/auth');
})

router.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/error'
}, (req, res) => {
  const authorized = !!req.user;
  res.render('/auth', {
    authorized
  });
}));

//router.post('/register', register);
module.exports = router;