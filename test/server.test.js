'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Sanity check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});


describe('Static Server', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('Noteful API', function () {
  const seedData = require('../db/seedData');

  beforeEach(function () {
    return seedData('./db/noteful.sql');
  });

  after(function () {
    return knex.destroy(); // destroy the connection
  });

  const noteKeys =  ['id','title','content','folderName','folder_id','tags'];
  describe('GET /api/notes', function () {

    it('should return the default of 10 Notes ', function () {
      return chai.request(app)
        .get('/api/notes')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
        });
    });

    it('should return correct search results for a valid searchTerm', function () {
      return chai.request(app)
        .get('/api/notes?searchTerm=about%20cats')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(4);
          expect(res.body[0]).to.be.an('object');
        });
    });

  });
  describe('404 handler', function () {
    it('should respond with 404 when given a bad path', function () {
      return chai.request(app)
        .get('/api/notes/BAD/URL')
        .then((res) =>{
          expect(res).to.have.status(404);
        });
    });
  });
  describe('GET /api/notes', function () {
    it('should return an array of objects where each item contains id, title, and content', function () {
      return chai.request(app)
        .get('/api/notes/')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          res.body.forEach((note) => {
            expect(note).to.be.a('object');
            expect(note).to.have.all.keys(noteKeys);
          });
        });
    });  
    it('should return an empty array for an incorrect searchTerm', function () {
      return chai.request(app)
        .get('/api/notes/?searchTerm=SOMETHINGRANDOM')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf(0);
        });
    });
  });
  describe('GET /api/notes/:id', function () {
    it('should return correct note when given an id', function () {
      return chai.request(app)
        .get('/api/notes/1000')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys(noteKeys);
          expect(res.body.id).to.equal(1000);
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      return chai.request(app)
        .get('/api/notes/123456')
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res).to.be.json;
        });
    });
  });

  describe('POST /api/notes', function () {
    it('should create and return a new item when provided valid data', function () {
      const newObj = {
        title: 'test obj',
        content: 'some content',
        folderId: 103,
        tags: ['2','3','4']
      };
      return chai.request(app)
        .post('/api/notes/')
        .send(newObj)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys(noteKeys);
          
        });

    });

    it('should have a default title when no title is included', function () {
      const newObj = { };
      return chai.request(app)
        .post('/api/notes/')
        .send(newObj)
        .then((res) => {
          expect(res.body).to.have.keys(noteKeys);
          expect(res.body.title).to.equal('placeholder title');
        });
    });
  });

  describe('PUT /api/notes/:id', function () {
    const updateObj = {
      title: 'update Obj',
      content: 'some updated content',
      folder_id: 102,
      tags: ['3','4']
    };
    it('should update the note', function () {
      
      return chai.request(app)
        .put('/api/notes/1009')
        .send(updateObj)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys(noteKeys);
          expect(res.body.id).to.equal(1009);
          console.log(res.body);
          Object.keys(updateObj).forEach((key) => {
            key !== 'tags' ? expect(res.body[key]).to.equal(updateObj[key]) : expect(res.body[key][0]).to.have.deep.keys('id','name');
          });
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      return chai.request(app)
        .put('/api/notes/12032')
        .send(updateObj)
        .then((res) => {
          console.log(res.body);
          expect(res).to.have.status(404);
        });
    });

    // it('should return an error when missing "title" field', function () {

    // });

  });

  describe('DELETE  /api/notes/:id', function () {

    it('should delete an item by id', function () {
      return chai.request(app)
        .delete('/api/notes/1003')
        .then((res) => {
          expect(res).to.have.status(204);
        });
    });

  });
});








