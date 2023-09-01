/* ---------------------------- */
/* --- Extensao - Check All --- */
/* ---------------------------- */
//Marcar/Desmarcar todos checkbox (Mantenha essa funcao abaixo das validacoes de form, já que ela manipula checkbox durante a validacao do form - procure por: Debug checkAllfunc)
//PS: jquery 1.10.0 apresenta mudanças relacionados ao set da propriedade checked

function muleta_changeCheckLabel(mainPass,labPass,tipo){
	var labelNew;
	if(tipo=="marcar"){
		if(labPass.length != 0 && labPass.attr("data-label-turnon")!=undefined){
			labelNew = labPass.attr("data-label-turnon");
		}else{
			labelNew = "Marcar tudo";
		}
		mainPass.prop("checked", false).change();
	}else{
		if(labPass.length != 0 && labPass.attr("data-label-turnoff")!=undefined){
			labelNew = labPass.attr("data-label-turnoff");
		}else{
			labelNew = "Desmarcar tudo";
		}
		mainPass.prop("checked", true).change();
	}
	
	mainPass.attr("title",labelNew);
	if(labPass.length != 0) {
		labPass.text(labelNew);
	}
}

var checkMain = ".ui_checkMain";
var checkAll = ".ui_checkAll";
var checkLab = ".ui_checkLabel";


/*--- Comportamento do botao-principal na submissao: Na submissao, consideremos o valor especifico do botao-principal. Caso nao existe um valor especifico, esse comportamento nao sera considerado --- */

// Adicionar class para identificar o formulario que contem um botao check-all (iremos prover alternativas para o botao-principal com value ou nao)
$(checkMain+":last-child").parents("form").ready(function(){
	//$(checkMain).parents("form").css("background","#ab0000"); //Debug checkAllfunc
	$(checkMain).parents("form").each(function(idx, item) { //Para cada elemento form
		$(item).addClass("ui_checkControlForm");
	});
});

/*--- Fim do comportamento do botao-principal na submissao --- */


//FUNCOES
function muleta_checkToggleCheck(xdi,_boolean_,_tigger_){	
	obj = $(checkAll + xdi + " input[type='checkbox']").not(":disabled");
	obj.prop("checked", _boolean_);
	if(_tigger_) obj.change();
}
function muleta_checkAllClick(xdi,evento) {
	//Se existir algum check marcado
	if($(checkAll + xdi + " input[type='checkbox']:checked").not(":disabled").length > 0){
		muleta_changeCheckLabel($(checkMain + xdi),$(checkLab + xdi),"desmarcar");
	
	//Se nao existir nenhum check marcado
	}else{
		//Se o botao-principal estiver marcado:
		if($(checkMain + xdi).is(":checked")) {
			if(evento=="init"){
				muleta_checkToggleCheck(xdi,true,false);
				muleta_changeCheckLabel($(checkMain + xdi),$(checkLab + xdi),"desmarcar");
			}else{
				muleta_checkToggleCheck(xdi,false,false);
				muleta_changeCheckLabel($(checkMain + xdi),$(checkLab + xdi),"marcar");
			}


		//Se o botao-principal NAO estiver marcado:
		}else{
			muleta_changeCheckLabel($(checkMain + xdi),$(checkLab + xdi),"marcar");
		}
	}
}
function muleta_checkMainClick(xdi) {
	//Se o botao-principal estiver marcado
	if($(checkMain + xdi).is(':checked')){
		muleta_changeCheckLabel($(checkMain + xdi),$(checkLab + xdi),"desmarcar");
		muleta_checkToggleCheck(xdi,true,true);

	//Se o botao-principal ainda NAO estiver marcado:
	}else{
		muleta_changeCheckLabel($(checkMain + xdi),$(checkLab + xdi),"marcar");
		muleta_checkToggleCheck(xdi,false,true);
	}
}


function extension_checkAll(origem) { //A ordem importa!
	$(checkMain+":not(.ui_isdone)").each(function(idx, item) { //Para cada elemento		
		if(origem==undefined){ origem=""; }
		if(origem=="ajax"){
			var xdi = recursividadeID+"_"+idx;
		}else{
			var xdi = idx;
		}

		$(item).addClass(checkMain.replace(".","") + xdi);
		
		$(item).unbind("click"); //Prevent duplicate bubble propagation, caso o gatilho ja tenha sido chamado.
		$(item).click(function(event) { //usar 'change' gerou too much recursion no console
			muleta_checkMainClick(xdi);
		});
		
		$(item).addClass("ui_isdone");
	});

	$(checkLab+":not(.ui_isdone)").each(function(idx, item) { //Para cada elemento
		if(origem==undefined){ origem=""; }
		if(origem=="ajax"){
			var xdi = recursividadeID+"_"+idx;
		}else{
			var xdi = idx;
		}

		$(item).addClass(checkLab.replace(".","") + xdi);

		//muleta_checkAllClick(xdi); //Desnecessario, ja que o evento init roda apos o ready do checkAll
		
		$(item).addClass("ui_isdone");
	});
	
	$(checkAll+":not(.ui_isdone)").each(function(idx, item) { //Para cada elemento, inserimos uma class seguida de um numero de indentificacao (de acordo com a ordem de renderizacao da pagina)		
		if(origem==undefined){ origem=""; }
		if(origem=="ajax"){
			var xdi = recursividadeID+"_"+idx;
		}else{
			var xdi = idx;
		}

		$(item).addClass(checkAll.replace(".","") + xdi);
		
		$(item).unbind("change"); //Prevent duplicate bubble propagation, caso o gatilho ja tenha sido chamado.
		$(item).find("input[type='checkbox']").change(function() {
			muleta_checkAllClick(xdi,"click");
		});
		
		muleta_checkAllClick(xdi,"init");
		
		$(item).addClass("ui_isdone");
	});
}

$("form:last-child, input[type='checkbox']:last-child").ready( function() {
	extension_checkAll();
});