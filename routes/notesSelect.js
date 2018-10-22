// const express = require('express');
const knex = require('../knex');


const notesSelect = function(noteId) {
  return knex.select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'note_id', 'notes.id')
    .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
    .where('notes.id', noteId);   
};

module.exports = notesSelect;
