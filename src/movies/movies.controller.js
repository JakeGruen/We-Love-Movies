const service = require('./movies.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function movieExists(req, res, next) {
  const movieId = Number(req.params.movieId);
  const foundMovie = await service.read(movieId);
  if (foundMovie) {
    res.locals.movie = foundMovie;
    return next();
  }
  next({
    status: 404,
    message: `Movie with id ${movieId} does not exist!`,
  });
}

async function theatersByMovie(req, res) {
  res.json({ data: await service.theatersByMovie(req.params.movieId) });
}

async function reviewsByMovie(req, res, next) {
  res.json({ data: await service.reviewsByMovie(req.params.movieId) });
}

async function create(req, res) {
  const newMovie = req.body.data;
  res.status(201).json({ data: await service.createMovie(newMovie) });
}

function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function list(req, res) {
  res.json({ data: await service.list(req.query.is_showing) });
}

module.exports = {
  create: [asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  theatersList: asyncErrorBoundary(theatersByMovie),
  reviewsList: asyncErrorBoundary(reviewsByMovie),
};