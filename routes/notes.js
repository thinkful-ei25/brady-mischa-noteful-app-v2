// 'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

const hydrate = require('../utils/hydrate');
const notesSelectQuery = require('./notesSelect');
/* ========== GET/READ ALL NOTES ========== */
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.folderId;
  const tagId = req.query.tagId;

  knex.select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'note_id', 'notes.id')
    .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folder_id', folderId);
      }
    })
    .modify(function (queryBuilder) {
      if (tagId) {
        queryBuilder.where('tags.id', tagId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      const hydrated = hydrate(results);
      res.json(hydrated);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ SINGLE NOTES ========== */
router.get('/:id', (req, res, next) => {
  const noteId = req.params.id;
  notesSelectQuery(noteId)
    .then(result => {
      if (result.length > 0) {
        const hydrated = hydrate(result);
        res.json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, folder_id } = req.body;
  
  const tagsId = req.body.tags;

  const newItem = {
    title: title,
    content: content,
    folder_id: (folder_id) ? folder_id : null
  };
  
  !title ? newItem.title = 'placeholder title' : null;

  let noteId;
  // Insert new note, instead of returning all the fields, just return the new `id`
  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      noteId = id;
      //create array of object to be inserted into notes_tags
      if (tagsId){
        const newTags = tagsId.map(tagId => ({note_id: noteId, tag_id: tagId,}));
        return knex
          .insert(newTags)
          .into('notes_tags');
      }
    })
    .then(() => notesSelectQuery(noteId))
    .then(result => {
      if (result) {
        const hydrated = hydrate(result);
        res.location(`${req.originalUrl}/${noteId}`).status(201).json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { title, content, folder_id } = req.body;

  const updateItem = {
    title: title,
    content: content,
    folder_id: (folder_id) ? folder_id : null
  };
  //provide default title
  if(!title){
    updateItem.title = `it's note ${noteId}`;
  }

  knex('notes')
    .update(updateItem)
    .where('id',noteId)
    .returning('*')
    .then(() => {

      return knex('notes_tags')
        .where('note_id', noteId)
        .del();
    })
    .then(() => {
      if (req.body.tags) {
        const updateTags = req.body.tags.map((tag) => ({ note_id: noteId, tag_id: tag}));
        return knex
          .insert(updateTags).into('notes_tags')
          .catch(() => next()); //is this right??? 
      }
    })
    .then(() => {
      return notesSelectQuery(noteId);
    })
    .then((result) => {
      if (result) {
        const hydrated = hydrate(result);
        res.location(`${req.originalUrl}/${noteId}`).status(201).json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  knex.del()
    .where('id', req.params.id)
    .from('notes')
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
