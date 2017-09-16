var Article = require('../model/article');

/* Get articles by page number. */

exports.get = function(req, res, next) {
	var currentPage = parseInt(req.query.page) || 0;
	var articlesPerPage = parseInt(req.query.count) || 25;

	Article
	.find({})
	.limit(articlesPerPage)
	.skip(currentPage * articlesPerPage)
	.sort({createdAt: -1})
	.exec(function(err, data){
		if(err){
			console.error(err.message);

			return res.json({success: false})
		}

		res.json({success: true, data: data});
	});
};

/* Delete article by id. */

exports.delete = function(req, res, next) {
	var id = req.params.id;

	Article
	.findByIdAndRemove(id)
	.exec(function(err, data){
		if(err){
			console.error(err.message);

			return res.json({success: false})
		}

		res.json({success: true, data: data});
	});
};