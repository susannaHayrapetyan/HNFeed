'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	author: { 
		type : String, 
		default : '', 
		trim : true
	},
	title: { 
		type : String, 
		required : true, 
		trim : true 
	},
	url: { 
		type : String, 
		default : '', 
		trim : true
	},
	createdAt: { 
		type : Date, 
		default : null 
	},
	isRemoved: { 
		type : Boolean, 
		default : false 
	}
});

/*Index is for getting sorted articles fast and efficient.*/

ArticleSchema.index({ createdAt: -1 });

/*It needs the index which will be responsible for uniqueness of articles, to avoid from duplicates. */

ArticleSchema.index({author: 1, createdAt: 1, title: 1}, {unique: true});

/**
* Validate and save multiple articles received from API.
*
* @param {Array} articles
* @param {Function} next
*/

ArticleSchema.statics.insertManyFromAPI = function (articles, next) {
	var i, insertedData = [];

	for(i in articles){
		if(!articles[i].story_title && !articles[i].title)
			continue;

		insertedData.push({
			author: articles[i].author,
			title: articles[i].story_title || articles[i].title,
			url: articles[i].story_url || articles[i].url,
			createdAt: new Date(articles[i].created_at)
		})
	}

	this
	.model('Article')
	.insertMany(insertedData, {ordered: false})
	.then(function(data) {

		next();
    })
	.catch(function(err) {
		if(err && err.code !== 11000)
			console.error(error.message);

		next();
    });
}

module.exports = mongoose.model('Article', ArticleSchema, 'articles');