const {Router} = require('express');
const router = new Router;
const {log} = require('lib/util');

// APIs
const db = require('./db');
const auth = require('./auth');
const converter = require('./converter');
const task = require('./task');

// Endpoints
router.use('/db', db);
router.use('/auth', auth);
router.use('/converter', converter);
router.use('/task', task);

!production ? router.use('/test', require('./test')) : void 0;

/**
 * @api {get} / Hello, world!
 * @apiName HelloWorld
 * @apiGroup root
 *
 * @apiSuccess {String} message Hello, world!
 */
router.get('/', function(req, res) {
  return res.json({
    message: 'asga Hasglo, world 21'
  });
});

/**
 * @api {post} /:id Return's ID :-)
 * @apiName Echo ID
 * @apiGroup root
 *
 * @apiParam {Number} id echoe'd ID
 *
 * @apiSuccess {Number} id ID
 */
router.post('/:id', function(req, res) {
  const {id} = req.params;
  log(id);
  return res.json({id});
});

module.exports = router;
