$(document).ready(function() {
	var count = $('.child').size();
	var eng = true;
	var event = false;
	var project = false;
	var news = false;


// ------------------------
// *** Toggles Block ***
// ------------------------


	function checkEnglish () {
		if (eng === true)
			$('.en').prop('disabled', true);
		else
			$('.en').prop('disabled', false).show();
	}

	function toggleEnglish () {
		if (eng = !eng) {
			eng = true;
			$('.en').prop('disabled', eng).hide();
			$('.ru').css('float','none');
		}
		else {
			eng = false;
			$('.en').prop('disabled', eng).show();
			$('.ru').css('float','left');
		}
	}



// ------------------------
// *** Constructors Block ***
// ------------------------


	function snakeForward () {
		var $snake = $(this).parent('.snake_outer').children('.snake');
		$snake.first().clone()
			.find('option').prop('selected', false).end()
			.insertAfter($snake.last());
	}

	function snakeBack () {
		var $snake = $(this).closest('.snake_outer').children('.snake');
		if ($snake.size() == 1) return null;
		$(this).parent('.snake').remove();
	}


	$('.toggle_eng').on('click', toggleEnglish);
	$(document).on('click', '.back', snakeBack);
	$('.forward').on('click', snakeForward);


	// $('form').submit(function(event) {
	// 	var areas = $('textarea');
	// 	areas.each(function() {
	// 		var newValue = $(this).val().replace(/\n/g, "<br />");
	// 		$(this).val(newValue);
	// 	});
	// 	$('form').submit();
	// });

	$(document).on('paste','[contenteditable]',function(e) {
	    e.preventDefault();
	    var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
	    window.document.execCommand('insertText', false, text);
	});


	var $editor = $('.editor').wysiwyg({
			classes: 'editor',
			toolbar: 'top-selection',
			buttons: {
			insertlink: {
					title: 'Insert link',
					image: '\uf08e',
			},
			header: {
					title: 'Header',
					image: '\uf1dc',
					popup: function( $popup, $button ) {
									var list_headers = {
													// Name : Font
													'Header 0' : '<div>',
													'Header 1' : '<h1>',
													'Header 2' : '<h2>',
													'Header 3' : '<h3>',
											};
									var $list = $('<div/>').addClass('wysiwyg-plugin-list')
																				 .attr('unselectable','on');
									$.each( list_headers, function( name, format ) {
											var $link = $('<a/>').attr('href','#')
																					 .css( 'font-family', format )
																					 .html( name )
																					 .click(function(event) {
																							$editor.wysiwyg('shell').format(format).closePopup();
																							// prevent link-href-#
																							event.stopPropagation();
																							event.preventDefault();
																							return false;
																					});
											$list.append( $link );
									});
									$popup.append( $list );
								 }
					},
				 bold: {
							title: 'Bold (Ctrl+B)',
							image: '\uf032',
							hotkey: 'b'
					},
					italic: {
							title: 'Italic (Ctrl+I)',
							image: '\uf033',
							hotkey: 'i'
					},
					underline: {
							title: 'Underline (Ctrl+U)',
							image: '\uf0cd',
							hotkey: 'u'
					},
					removeformat: {
							title: 'Remove format',
							image: '\uf12d'
					},
			},
			submit: {
					title: 'Submit',
					image: '\uf00c'
			},
			// placeholder: 'Type your text here...',
			placeholderUrl: 'www.example.com',
	});



});