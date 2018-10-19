'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/', (req, res, next) => {
  knex('tags')
    .select()
    .then(results => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('tags')
    .select()
    .where('id', id)
    .then(result => {
      if (result) {
        res.json(result[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    const err = new Error('missing `tag` name');
    err.status(400);
    return next(err);
  }

  const newTag = { name };

  knex('tags')
    .insert(newTag)
    .returning(['id', 'name'])
    .then(([result]) => {
      if (result) {
        res
          .location(`${req.originalUrl}/${result.id}`)
          .status(201)
          .json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

module.exports = router;
