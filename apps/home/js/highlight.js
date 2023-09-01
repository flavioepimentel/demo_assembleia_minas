function highlight(){
	var scroll = $(window).scrollTop(), height = $(window).height();
	$("mark").not(".active").each(function(idx, item) {
		var pos = $(item).offset().top;
		if(scroll+height >= pos+height/6) {
			$(item).addClass("active");
		}
	});
}
$(document).ready(function(){
	highlight();
});
$(window).on("scroll", function(){
	highlight();
});