const {Router} = require('express');
const serve = require('serve-static');
const router = new Router;

function vendor(name) {
  return serve(`node_modules/${name}`);
}

const profile = require('./profile');
router.use('/profile', profile);
router.use('/static', [
  vendor('admin-lte'),
  vendor('tinymce')
]);

router.get('/', (req, res) => {
  res.render('cab/index');
});

router.get('/add', (req, res) => res.render('cab/add'));
router.get('/table', (req, res) => res.render('cab/table'));

module.exports = router;
