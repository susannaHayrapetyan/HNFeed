var express = require('express');
var router = express.Router();
var articlesCtrl = require('../controllers/articles');

/* GET articles listing. */

router.get('/', articlesCtrl.get);

/* DELETE article by id. */

router.delete('/:id', articlesCtrl.delete);

module.exports = router;