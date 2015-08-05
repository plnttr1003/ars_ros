$(document).ready(function() {
	$('.form_images_upload').sortable({placeholder: 'column_placeholder', cancel: '.image_upload_description, .image_upload_delete'});

	$(document).on('click', '.image_upload_delete', function(event) {
		$(this).closest('.image_upload_block').remove();
	});

	$('.form_images_upload').filedrop({
		url: '/preview',
		paramname: 'image',
		// fallback_id: 'images_upload_fallback',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		allowedfileextensions: ['.jpg','.jpeg','.png','.gif'],
		maxfiles: 5,
		maxfilesize: 12,
		dragOver: function() {
			$(this).css('outline', '2px solid red');
		},
		dragLeave: function() {
			$(this).css('outline', '1px solid red');
		},
		uploadStarted: function(i, file, len) {

		},
		uploadFinished: function(i, file, response, time) {
			var image_upload_block = $('<div />', {'class': 'image_upload_block'});
			var image = $('<div />', {'class': 'image_upload_preview', 'style': 'background-image:url(' + response + ')'});
			var image_delete = $('<div />', {'class': 'image_upload_delete', 'text': 'Удалить'});
			var desc_ru = $('<textarea />', {'class': 'image_upload_description ru_img', 'name': 'images[description][ru][]', 'placeholder':'Описание'});
			var desc_en = $('<textarea />', {'class': 'image_upload_description en_img', 'name': 'images[description][en][]', 'disabled':'disabled', 'placeholder':'Description'});
			var form = $('<input />', {'class': 'image_upload_form', 'type': 'hidden', 'name': 'images[path][]', 'value': response});
			$('.form_images_upload').append(image_upload_block.append(image.append(image_delete), desc_ru, desc_en, form));
			alert(eng)
		},
		progressUpdated: function(i, file, progress) {

		},
		afterAll: function() {
			$('.form_images_upload').css('outline', '1px solid red');
		}
	});

});