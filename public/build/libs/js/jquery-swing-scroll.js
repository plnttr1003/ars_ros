$.fn.swingScroll = function(options) {
	var defaults = {
		context: this,
		columns: null,
		engine: 'wheel',
		factor: 1
	};

	var opts = $.extend({}, defaults, options);
	var opts_engine = typeof opts.engine == 'function' ? opts.engine.call() : opts.engine;
	var opts_overflow = opts_engine == 'wheel' ? 'hidden' : 'scroll';

	var $columns = opts.columns ? $(this).children(opts.columns) : $(this).children();
			$columns.each(function() {
				var column_inner = $('<div/>', {'class': 'column_inner'});
				$(this).css('overflow', opts_overflow).children().wrapAll(column_inner);
			});

	$(this).css('overflow', 'hidden');

	var debounce = function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	var normalizeMouseWheel = function(event) {
		var o = event.originalEvent,
				d = o.detail, w = o.wheelDelta,
				n = 225, n1 = n-1, f;

		d = d ? w && (f = w/d) ? d/f : -d/1.35 : w/120;
		d = d < 1 ? d < -1 ? (-Math.pow(d, 2) - n1) / n : d : (Math.pow(d, 2) + n1) / n;

		return opts.factor * 10 * Math.min(Math.max(d / 2, -1), 1);
	};

	var scrollColumns = function(event) {
		var $this = $(this);
		var $columnsCheck = $columns.not(this);

		var current_scroll_top = $this.scrollTop();
		var current_height = $this.height();
		var current_inner_height = $this.children('.column_inner').height();

		if (opts_engine == 'wheel') {
			$columns.off('scroll.col');
			current_scroll_top = current_scroll_top - normalizeMouseWheel(event);
			$this.scrollTop(current_scroll_top);
		} else {
			$columnsCheck.off('scroll.col');
		}

		var scroll_percentage = current_scroll_top / (current_inner_height - current_height) * 100;

		$columnsCheck.each(function() {
			var $this = $(this);
			var check_height = $this.height();
			var check_inner_height = $this.children('.column_inner').height();
			$this.scrollTop(scroll_percentage * (check_inner_height - check_height) / 100);
		});
	};


	if (opts_engine == 'wheel') {
		$columns.on('mousewheel onmousewheel DOMMouseScroll', scrollColumns);
	} else {
		$columns
			.on('scroll.col', scrollColumns)
			.on('scroll', debounce(function() {
				$(this).on('scroll.col', scrollColumns);
			}, 250, true));
	}

	return this;
};