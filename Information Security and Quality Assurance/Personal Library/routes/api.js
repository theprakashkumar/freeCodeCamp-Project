/*
 *
 *
 *       Complete the API routing below
 *       
 *       
 */

'use strict';

const { response } = require('express');
const books = require('../models/books');
const Book = require('../models/books');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      Book.find({}, (err, foundBook) => {
        if(err) return console.log('Error While Getting All Book in GET Request  of /api/books/', err)
        return res.json(foundBook);
      });
    })

    .post(function (req, res) {
      let body = req.body;
      if (!body.title) return res.send('missing required field title');
      Book.create({
        title: body.title
      }, (err, newBook) => {
        if (err) return console.log('Error While Creatng Book in POST Request  of /api/books/', err);
        return res.json(newBook);
      });
    })

    .delete(function (req, res) {
      Book.deleteMany({}, (err, deletedModel) => {
        if(err) return console.log(('Error While Deleting All Book in DELETE Request of /api/books/', err))
        return res.send('complete delete successful');
      });
    })



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      Book.findById(bookid, (err, foundBook) => {
        // if there is any error or not book found
        if(err || foundBook===null){
        console.log('Error While Finding All Book in GET Request of /api/books/:id', err); 
        return res.send('no book exists');
        }
        res.json(foundBook);
      })
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      Book.findById(bookid, (err, foundBook) => {
        if(err || !foundBook){
          console.log('Error While Finding Book to Post Comment in POST Request of /api/books/:id', err); 
          return res.send('no book exists');
        }
        // Push comment to exiting book and then increase the comment count
        if(!comment){
          return res.send('missing required field comment');
        }else{
          foundBook.comments.push(comment);
          foundBook.commentcount++;
        }
        // save book to database
        foundBook.save((err, savedBook) => {
          if(err) return console.log('Error While Saving Book After Pushing Comment POST Request of /api/books/:id', err); 
          return res.json(savedBook);
        });

      })
      
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      // if bookid does not exist then send error
      if(!bookid){
        return res.send('no book exists');
      }

      Book.findByIdAndDelete(bookid, (err, deletedBook) => {
        if(err || !deletedBook){
          console.log('Error While Saving Book After Pushind Comment POST Request of /api/books/:id', err); 
          return res.send('no book exists');
        }
        res.send('delete successful');
      })
    });

};