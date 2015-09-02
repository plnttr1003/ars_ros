$(document).ready(function() {
	$('.item_fancy').click(function(){
		alert('21');
		$('.item_fancy').fancybox({
			padding: 0,
			openEffect : 'none',
			closeEffect : 'none',
			closeClick : true
		});
});
})