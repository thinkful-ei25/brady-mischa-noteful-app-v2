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
    err.status = 400;
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

router.put('/:id', (req, res, next) => {
  const { name } = req.body;
  // const updateObj = {id : req.params.id, name : req.body.name};
  if(!name) {
    const err = new Error ('No tag name, no go!');
    err.status = 404;
    return next(err);
  }
  knex('tags')
    .update({name : name})
    // .update(updateObj)
    .where('id', req.params.id)
    .returning(['id', 'name'])
    .then(([result]) => {
      if(result) {
        res.json(result);
      } else next();
    })
    .catch(err => next(err));
});


router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('tags')
    .where('id', id)
    .del()
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

module.exports = router;
