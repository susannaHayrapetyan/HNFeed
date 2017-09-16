
// Get first page of articles when document is ready.

$(function() {
	var currentPage = 0;
	var isDataLoading = false;
    
	getArticlesByPageAndCount();

	$(window).on('scroll', function(e) {
		
		// Scrolled to bottom.

		if($(window).scrollTop() + $(window).height() > $(document).height() - 250) {
			if(isDataLoading)
				return;

	        getArticlesByPageAndCount(++currentPage, 25)
	   }
	});

	$('.articles').on('click', function(e){
		var id = $(e.target.parentElement).attr('id');
		
		if(!id)
			return;

		$.ajax({
			url: 'articles/' + id,
			type: "delete",
			success: function(response) {
				if(response.success)
					$('#' + response.data._id).remove();
			},
			error: function(xhr) {
				console.log(arguments);
			}
		});

	})

	// Get more articles

	function getArticlesByPageAndCount(page, count){
		isDataLoading = true;

		$.ajax({
			url: 'articles',
			type: "get", 
			data: { 
				page: page || 0,
				count: count || 50
			},
			success: function(response) {
				if(!response.success || !response.data || !response.data.length)
					return $("ul.articles").append('<li class="list-group-item">No more articles available.</li>');

				isDataLoading = false;

				var list = response.data.map(function(a) { 
					
					return '<li class="list-group-item" id="' + a._id + '"><a href="' + (a.url || '#') + '" target="_blank" class="title">' + a.title + 
						'</a><span class="author">' + a.author + 
						'</span><span class="trash glyphicon glyphicon-trash invisible"></span>' + 
						'</span><span class="time">' + formatDate(a.createdAt) + '</li>';
				});

				$("ul.articles").append(list.join(''));
			},
			error: function(xhr) {
				return $("ul.articles").append('<li class="list-group-item">Cannot load data.</li>');
			}
		});
	}

    // Return formatted date string

	function formatDate(date){
		var now = new Date(),
		monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		date = new Date(date);

		// Invalid date.

		if(!date.getTime())
			return '';

		// Today

		if(
			now.getDate() === date.getDate() &&
			now.getMonth() === date.getMonth() &&
			now.getYear() === date.getYear()
		)
			return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + (date.getHours() >= 12 ? ' pm' : ' am')

		// Yesterday

		else if(
			now.getDate() === (date.getDate() + 1) &&
			now.getMonth() === date.getMonth() &&
			now.getYear() === date.getYear()
		)
			return 'Yesterday';

		// Current year

		else if(now.getYear() === date.getYear())

			return monthNames[date.getMonth()] + ' ' + date.getDate();

		// In other cases (previous years)

		else

			return monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

	}
})