'use strict';

var mongoose = require('mongoose');
var async = require('async');

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

/*Get all available articles recursively by page and query.*/

(function getArticles(page){

  	qs.page = page;

  	/*Request for articles list from API.*/

  	util.getRequest(config.api.url + 'search_by_date', {qs: qs}, function(res){

  		if(!res.hits.length)
			return finishProcess();

		console.log(res.hits.length, 'articles from API, page -> ' + page);

		Article.insertManyFromAPI(res.hits, function(){

  			/*Check and stop process if it's the last page.*/

			if(res.hits.length < articlesPerPage)
				return finishProcess();

			/*Increase page number and call function again to get next 100 articles.*/

			getArticles(++page);
		});
	});

})(0);


function listen (page) {
  	console.log('Connected to MongoDB ');
}

function connect () {
  
  return mongoose.connect(config.db.url + config.db.databaseName, config.db.options);
}

function finishProcess (){
	mongoose.connection.close();

	process.exit();
}