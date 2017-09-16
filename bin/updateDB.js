'use strict';

var mongoose = require('mongoose');
var async = require('async');
var cron = require('node-cron');

mongoose.Promise = require('bluebird');

var config = require('../config/config')
var util = require('../config/util')
var Article = require('../model/article');

var articlesPerPage = 100;
var qs = {
	query: 'nodejs',
	hitsPerPage: articlesPerPage
};

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

/*Update database every hour.*/

cron.schedule('*/60 * * * *', updateDB);

function updateDB(){

	async.waterfall([
		/*Get latest article from DB.*/

		function(cb){

			Article.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, article){
				var updateTimestamp, yesterday = new Date(); 
				
				if(err)
					return cb(err);

				yesterday.setDate(yesterday.getDate() - 1);

				if(!article || !article.createdAt)
					updateTimestamp = yesterday.getTime();
				else
					updateTimestamp = new Date(article.createdAt).getTime() || yesterday.getTime()

				qs.numericFilters ="created_at_i>" + (updateTimestamp / 1000);

				cb(null, qs);
			})
		},

		/*Get new articles which doesn't exists in our DB.*/
			
		function(qs, cb){

			util.getRequest(config.api.url + 'search_by_date', {qs: qs}, function(res){
				
				if(!res.hits || !res.hits.length)
					return console.log('Everything is up-to-date!');

				console.log(res.hits.length, ' new articles from API.');

				cb(null, res)
			});
		},

		/*Update new articles in DB*/
		function(res, cb){
			Article.insertManyFromAPI(res.hits, cb);
		},
	], function(err){
		if(err)
			return console.error(err);

		console.log("Database updated!");
	})

}

function listen (page) {
  	console.log('Connected to MongoDB ');
}

function connect () {
  
  return mongoose.connect(config.db.url + config.db.databaseName, config.db.options);
}