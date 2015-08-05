$(document).ready(function() {
	var technique_id = parseInt(window.location.hash.replace('#',''));

	$('.event_type_block a').on('click', function(){$('.event_type_block a').removeClass('active'); $(this).addClass('active'); $('.event').hide(); $('.' + $(this).attr('id') + '').show(); window.location.hash = $(this).index();});
	$('.event_type_block a').eq(technique_id).trigger('click');
});