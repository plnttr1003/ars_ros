$(document).ready(function() {
	function remove (event) {
		var id  = $(this).attr('id');

		if (confirm(event.data.description)) {
			$.post(event.data.path, {'id': id}).done(function() {
				location.reload();
			});
		}
	}

	$('.rm_user').on('click', {path:'/auth/users/remove', description: 'Удалить пользователя?'}, remove);
	$('.rm_news').on('click', {path:'/auth/news/remove', description: 'Удалить новость?'}, remove);
	$('.rm_event').on('click', {path:'/auth/events/remove', description: 'Удалить событие?'}, remove);
	$('.rm_category').on('click', {path:'/auth/categorys/remove', description: 'Удалить категорию?'}, remove);
	$('.rm_collect').on('click', {path:'/auth/collects/remove', description: 'Удалить коллекцию?'}, remove);
	$('.rm_exhibit').on('click', {path:'/auth/exhibits/remove', description: 'Удалить экспонат?'}, remove);
	$('.rm_hall').on('click', {path:'/auth/halls/remove', description: 'Удалить зал?'}, remove);
	$('.rm_subsidiary').on('click', {path:'/auth/subsidiarys/remove', description: 'Удалить фелиал?'}, remove);
	$('.rm_gallery').on('click', {path:'/auth/gallerys/remove', description: 'Удалить фотографию?'}, remove);
	$('.rm_magazine').on('click', {path:'/auth/magazines/remove', description: 'Удалить журнал?'}, remove);

});