$(window).load(function() {

	if ($('.content_scroll_item').length > 0 && $('.content_scroll_item').length < 8) {
		while ($('.content_scroll_item').length < 12) {
			$('.content_scroll_item').clone().appendTo('.content_scroll_items');
		}
	}

	var parent = $('.content_scroll_items');
	var max = parent[0].scrollHeight - parent[0].offsetHeight - 20;
	var scroll_position = 0;
	var factor = 5.55555;

	parent.on('scroll', function(event) {
	    var s = $(this).scrollTop(),
	        f = $('>:first', parent),l = $('>:last', parent);
	    if(s > max) {f.appendTo(parent); parent.scrollTop(s - f.height()); }
	    if(s < 5) {l.prependTo(parent); parent.scrollTop(s + l.height()); }
	}).scrollTop(5);

	$('.column_main_inner').on('scroll', function(event) {
	    var scroll = $(this).scrollTop();
	    if (scroll_position > scroll) {
	       parent.scrollTop(parent.scrollTop() - factor);
	       scroll_position = scroll;
	    } else {
	       parent.scrollTop(parent.scrollTop() + factor);
	       scroll_position = scroll;
	    }
	});
});