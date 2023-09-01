/* ------------------------------------------ */
/* --- Toggle Class per Width Breakpoints --- */
/* ------------------------------------------ */
var f_clientWidth_toggleClass = f_clientWidth();
function exec_toggleClass(obj,xdi){
	//Pegar os atributos
	var datas = obj.attr("data-wbreakups").split(";"); //Obrigatorio: Valores dos breaks:classes separados por ponto-e-virgula (ex: data-wbreakups="sm:w-50;md:w-40")
	var class_default = obj.attr("data-class-default"); //Facultativo: Classe default (abaixo do primeiro breakpoint - entre a largura 0 até o primeiro breakpoint)
	
	//Variaveis globais
	var classAll = "";
	var classAdd = "";
	
	//For em todos os breakpoints e suas class
	for(i=0;i<datas.length;i++){
		//Pegar os breakspoints
		var wbreak = datas[i].split(":")[0];
		
		//Pegar breakspoints notaveis
		if(wbreak=="sm") wbreak = 576;
		else if(wbreak=="md") wbreak = 768;
		else if(wbreak=="lg") wbreak = 992;
		else if(wbreak=="xl") wbreak = 1200;
		
		//Adicionar toda as classes
		classAll += " " + datas[i].split(":")[1];
		
		//Se o viewport for maior que o breakpoint, pegamos a classe que sera adicionada
		if(f_clientWidth()+f_scrollWidth() >= wbreak){
			classAdd = " " + datas[i].split(":")[1];
		}
	}
	
	//Se nao pegou nenhuma classe, significa que os breaks passados sao todos maiores que a largura do viewport
	if(classAdd==""){ //'data-class-default' serve para ser a classe da largura 0 até o primeiro breakpoint. Essencial qndo tem apenas um breakpoint, ex: data-wbreakups="sm:w-50"
		//Se ha class-default, entao ela sera a escolhida
		if(class_default!="" && class_default!=undefined){
			classAdd = class_default;
		}
		/* Manter essa opçcao backupeada. Seria estranho atribuir a classe do primeiro break se a largura de tela ainda nao o alcancou. É preferivel usar o 'data-class-default'
		else{ //Caso contrario, temos que pegar a class do primeiro break
			classAdd = datas[0].split(":")[1];
		}*/
	}
	
	//Adicionar class
	//console.log(classAdd);
	obj.removeClass(classAll); //Primeiro, removemos todas as classes
	if(class_default!="" && class_default!=undefined) obj.removeClass(class_default); //Remover class-default
	if(classAdd!="") obj.addClass(classAdd);
}

function ready_toggleclass(origem){
	//callbefore_clientHeightChanged_onlyUi();
	
	$(".ui_toggleclass:not(.ui_isdone)").each(function(idx, item) {
		if(origem==undefined){ origem=""; }
		if(origem=="ajax"){
			var xdi = recursividadeID+"_"+idx;
		}else{
			var xdi = idx;
		}

		exec_toggleClass($(item),xdi);
	
		$(item).addClass("ui_isdone");
	});

	//callback_clientHeightChanged_onlyUi();
}

//Gatilho
$(".ui_toggleclass:last-child").ready(function(){
	ready_toggleclass();
});

//Resize
var waitForFinalResizeToggleClass = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if(!uniqueId) uniqueId = "Don't call this twice without a uniqueId";
		if(timers[uniqueId]) clearTimeout (timers[uniqueId]);
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();
$(window).resize(function() {
	waitForFinalResizeToggleClass(function(){
		if(f_clientWidth_toggleClass != f_clientWidth()){
			f_clientWidth_toggleClass = f_clientWidth(); //Atualizar
			$(".ui_toggleclass").removeClass("ui_isdone");
			ready_toggleclass();
		}
    }, 100, "some unique string");
});