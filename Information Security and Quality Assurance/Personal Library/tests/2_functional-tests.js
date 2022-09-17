/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body);
  //       assert.property(res.body[0], 'commentcount');
  //       assert.property(res.body[0], 'title');
  //       assert.property(res.body[0], '_id');
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        let book = {
          title: "POST Request Test With Book Title"
        };
        chai.request(server)
          .post('/api/books')
          .send(book)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'commentcount');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send()
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            // ! Need to work on this
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        let book = {
          title: "GET Request Test To Get ALL Book"
        };
        chai.request(server)
          .post('/api/books')
          .send(book)
          .end(function (err, res) {
            chai.request(server)
              .get('/api/books')
              .end(function (err, response) {
                assert.equal(response.status, 200);
                assert.isArray(response.body);
                (response.body).forEach(book => {
                  assert.isObject(book);
                  assert.property(book, 'commentcount');
                  assert.property(book, 'title');
                  assert.property(book, '_id');
                });
              });
            done();
          });
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        const id = "5f995eb57e296f9b9b2a305d";
        chai.request(server)
          .get('/api/books/' + id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'no book exists');
          });
        done();
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {

        let book = {
          title: "GET Request Test To Get Book With Given ID"
        };
        chai.request(server)
          .post('/api/books')
          .send(book)
          .end(function (err, res) {
            chai.request(server)
              .get('/api/books/' + res.body._id)
              .end(function (err, response) {
                assert.equal(response.status, 200);
                assert.isObject(response.body);
                assert.property(response.body, 'commentcount');
                assert.property(response.body, 'title');
                assert.property(response.body, '_id');
              });
          });
        done();
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        let book = {
          title: "POST Request Test To POST New Book Commnet"
        };
        chai.request(server)
          .post('/api/books')
          .send(book)
          .end(function (err, res) {
            chai.request(server)
              .post('/api/books/' + res.body._id)
              .send({
                comment: "Comment for POST Request Test"
              })
              .end(function (err, response) {
                assert.equal(response.status, 200);
                assert.isObject(response.body);
                assert.property(response.body, 'commentcount');
                assert.equal(response.body.commentcount, 1);
                assert.property(response.body, 'title');
                assert.property(response.body, '_id');
              });
          });
        done();
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        let book = {
          title: "POST Request Test To POST New Book Comment"
        };
        chai.request(server)
          .post('/api/books')
          .send(book)
          .end(function (err, res) {
            chai.request(server)
              .post('/api/books/' + res.body._id)
              .send()
              .end(function (err, response) {
                assert.equal(response.status, 200);
                assert.isString(response.text);
                assert.equal(response.text, 'missing required field comment');
              });
          });
        done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        const id = "5f995eb57e296f9b9b2a305d";
        chai.request(server)
          .post('/api/books/' + id)
          .send({
            comment: "Comment for POST Request Test"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'no book exists');
          });
        done();
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        let book = {
          title: "Delete Request Test To Book"
        };
        chai.request(server)
          .post('/api/books')
          .send(book)
          .end(function (err, res) {
            chai.request(server)
              .delete('/api/books/' + res.body._id)
              .send({
                _id: res.body._id
              })
              .end(function (err, response) {
                assert.equal(response.status, 200);
                assert.isString(response.text);
                assert.equal(response.text, 'delete successful');
              });
          });
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        const id = "5f995eb57e296f9b9b2a305d";
        chai.request(server)
          .delete('/api/books/' + id)
          .send({
            _id: id
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'no book exists');
          });
        done();
      });

    });

  });

});