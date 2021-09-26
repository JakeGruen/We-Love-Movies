
const router = require('express').Router();
const controller = require('./reviews.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');
router
  .route('/:reviewId')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.destroy)
  .all(methodNotAllowed);

module.exports = router;