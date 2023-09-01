var prefix_general = "one_filled";
var prefix_item = "one_filled_item";
var prefix_message = "one_filled_message";
var prefix_pseudo = "one_filled_pseudo_empty";

function checkFields(form) {
	var checks_radios = form.find(":checkbox, :radio"), //, select
		inputs = form.find(":input."+prefix_item).not(checks_radios).not("[type='submit'],[type='button'],[type='reset']"),
		checked = checks_radios.not("."+prefix_pseudo).filter(":checked"),
		filled = inputs.filter(function(){
			var this_value = $(this).val();
			//console.log(this_value);
			
			var passed = $.trim(this_value).length > 0;
			if($(this).find("option[value='"+this_value+"']").attr("class")==prefix_pseudo) passed = false;
			
			return passed;
		});

	if(checked.length + filled.length === 0) {
		return false;
	}

	return true;
}

$(function(){
	$("."+prefix_general+":visible").on("submit",function(e){
		e.preventDefault();
		var oneFilled = checkFields($(this));
		//console.log(oneFilled);
		if(oneFilled === true){// if at least one field has a value
			$(this).removeClass(prefix_general).off("submit").on("submit", $(this).submit() );
		}else{
			var msg = "Preencha <b>pelo menos um</b> dos campos assinalados";
			if($("#"+prefix_message).length == 0){
				$(this).before('<div id="'+prefix_message+'" class="alert alert-warning alert-dismissible fade show my-3" role="alert">'+msg+'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>');
			}
			if( f_scrollTop() > $("#"+prefix_message+":visible").offset().top ) { // Só será ancorado se a posição Y da barra de rolagem for maior que a posicao do objeto
    			$("html,body").animate({ scrollTop: $("#"+prefix_message+":visible").offset().top - 15 }, "normal");
			}
			$("."+prefix_item).addClass("is-invalid");
			return false;
		}
	});
});