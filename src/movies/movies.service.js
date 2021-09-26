const knex = require('../db/connection');
const mapProperties = require('../utils/map-properties');

addCritics = mapProperties({
  critic_id: 'critic.critic_id',
  preferred_name: 'critic.preferred_name',
  surname: 'critic.surname',
  organization_name: 'critic.organization_name',
  created_at: 'critic.created_at',
  updated_at: 'critic.updated_at',
});

function read(movieId) {
  return knex('movies').select('*').where({ movie_id: movieId }).first();
}

function list(isShowing) {
  return knex('movies as m')
    .select('m.*')
    .modify((queryBuilder) => {
      if (isShowing) {
        queryBuilder
          .join('movies_theaters', 'm.movie_id', 'movies_theaters.movie_id')
          .where({ 'movies_theaters.is_showing': true })
          .groupBy('m.movie_id');
      }
    });
}

function theatersByMovie(movieId) {
  return knex('theaters')
    .select(
      'theaters.theater_id',
      'theaters.name',
      'theaters.address_line_1',
      'theaters.address_line_2',
      'theaters.city',
      'theaters.state',
      'theaters.zip',
      'movies_theaters.created_at',
      'movies_theaters.updated_at',
      'movies_theaters.is_showing',
      'movies.movie_id'
    )
    .join(
      'movies_theaters',
      'theaters.theater_id',
      'movies_theaters.theater_id'
    )
    .join('movies', 'movies_theaters.movie_id', 'movies.movie_id')
    .where({ 'movies_theaters.is_showing': true })
    .where({ 'movies.movie_id': movieId });
}

function reviewsByMovie(movieId) {
  return knex('movies')
    .select(
      'reviews.review_id',
      'reviews.content',
      'reviews.score',
      'movies.movie_id',
      'critics.critic_id',
      'critics.preferred_name',
      'critics.surname',
      'critics.organization_name',
      'critics.created_at',
      'critics.updated_at'
    )
    .join('reviews', 'reviews.movie_id', 'movies.movie_id')
    .join('critics', 'reviews.critic_id', 'critics.critic_id')
    .where({ 'movies.movie_id': movieId })
    .then((data) => data.map((i) => addCritics(i)));
}

function createMovie(newMovie) {
  return knex('movies')
    .insert(newMovie)
    .returning('*')
    .then((created) => created[0]);
}

module.exports = {
  createMovie,
  read,
  list,
  theatersByMovie,
  reviewsByMovie,
};