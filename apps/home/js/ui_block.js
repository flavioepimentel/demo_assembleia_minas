/* --------------------------------- */
/* --- Accordion Resumo em Bloco --- */
/* --------------------------------- */
//Accordion estilo slide-show e slide-hide após contar tag (tag default: <br>; limite default: 5)

function run_block(xdi){
	//callbefore_clientHeightChanged_onlyUi();
	
	if($.isFunction(window.callbefore_block)) { callbefore_block($(".ui_block"+xdi),$(".ui_blockDiv"+xdi)); } //Callbefore-function

	var mySpeed = "normal";
	if($(".ui_block"+xdi).attr("data-speed")!=undefined){
		mySpeed = $(".ui_block"+xdi).attr("data-speed");
		if(mySpeed!="slow" && mySpeed!="normal" && mySpeed!="fast") mySpeed=Number(mySpeed);
	}
	
	//Toggle
	$(".ui_blockDiv"+xdi).slideToggle(mySpeed, function() {
		//Callback
		setTimeout(function(){ if($.isFunction(window.callback_block)) { callback_block($(".ui_block"+xdi),$(".ui_blockDiv"+xdi)); } },50); //Callback-function
		
		//Ancorar
		if($(".ui_block"+xdi).attr("data-anchor")=="true"){
			if($(".ui_block"+xdi).attr("data-single-click")=="true") anchor_ui($(".ui_blockDiv"+xdi));
			else anchor_ui($(".ui_block"+xdi));
		}
		
		//callback_clientHeightChanged_onlyUi();
	});
}
function ready_block(origem){
	$(".ui_block:not(.ui_isdone)").each(function(idx, item) {		
		if(origem==undefined){ origem=""; }
		if(origem=="ajax"){
			var xdi = recursividadeID+"_"+idx;
		}else{
			var xdi = idx;
		}
		
		$(item).addClass("ui_block"+xdi);		
		
		var text = $(".ui_block"+xdi).html(); //ou text()
		//Tornar case insensitive:
		text = text.replace(/A>/gi,"a>"); text = text.replace(/<A/gi,"<a"); text = text.replace(/p>/gi,"p>"); text = text.replace(/<P/gi,"<p"); text = text.replace(/BR>/gi,"br>");

		// Apos quantas unidades haverá toggle
		if($(".ui_block"+xdi).attr("data-num")!=undefined){
			var qtdToggle = $(".ui_block"+xdi).attr("data-num");
		}else{
			var qtdToggle = 5;
		}

		// Tag que será contada para quebrar
		if($(".ui_block"+xdi).attr("data-tag")!=undefined){
			var elementSplit = $(".ui_block"+xdi).attr("data-tag");
		}else{
			var elementSplit = "<br>"; //se usar text(), pode usar /\n/g
		}
		
		// Rótulo:
		if($(".ui_block"+xdi).attr("data-label")!=undefined){
			var elementLabel = $(".ui_block"+xdi).attr("data-label");
		}else{
			var elementLabel = "Leia Mais";
		}

		// Rótulo quando ativo:
		if($(".ui_block"+xdi).attr("data-label-active")!=undefined){
			var elementLabelLess = $(".ui_block"+xdi).attr("data-label-active");
		}else{
			var elementLabelLess = "Esconder";
		}
		
		var eachLine = text.split(elementSplit);
		if(elementSplit.indexOf("<br")!=-1){ //"eachLine.length" ou "eachLine.length-1" significa desprezar a última posicao do vetor ou nao (em tags que iniciam, como o <br ou <p, é melhor considera-la, já tags que fecham, como </a> ou </p>, por exemplo, nao)
			var numberLines = Number(eachLine.length);
		}else{
			var numberLines = Number(eachLine.length-1);
		}
		//console.log( 'Numero de Linhas: ' + numberLines );

		if(numberLines > qtdToggle) {
			qtdToggle = qtdToggle-1; //levar em consideracao que vetor tem a posicao 0
			
			//Limpar conteúdo
			$(".ui_block"+xdi).html("");
			
			var exp_brPrev = "";
			var exp_brPoint = "";
			var exp_brAfter = "";
			
			$.each(new Array(numberLines),function(i) { //Loop nas linhas
				//alert('Vetor ' +i+ ' / Line ' +(i+1)+ ': ' + eachLine[i] + elementSplit);
				if(i < qtdToggle) {
					exp_brPrev += eachLine[i] + elementSplit;
				}else if(i == qtdToggle) {
					exp_brPoint += eachLine[i] + elementSplit;
				}else if(i > qtdToggle){
					exp_brAfter += eachLine[i] + elementSplit;
				}
			});

			// Tag do elemento-gatilho para expandir/retrair
			var tagToExpander = "";
			if($(".ui_block"+xdi).attr("data-element")!=undefined){ //a(default), span, div...
				tagToExpander = $(".ui_block"+xdi).attr("data-element");
			}else{
				tagToExpander = "a";
			}
			var tagToExpanderAttr = "";
			if(tagToExpander=="a"){ tagToExpanderAttr=' href="javascript:;"';
			}else{ //Se outra tag foi usada, pode significar que ha um "<a>" acima. Logo, é preciso remover a propagacao do link (quando clicar no 'leia mais', nao pode ter trigger desse "<a>" acima)
				var t_href = $(".ui_block"+xdi).parents("a").attr("href");
				$(".ui_block"+xdi).parents("a")
					.attr("href","javascript:;")
					.attr("onclick","if(!$(event.target).hasClass('ui_blockMore')) location.href='"+t_href+"';")
				;
			}
		
			//Insere o novo conteudo
			//$(".ui_block"+xdi).append(exp_brPrev + exp_brPoint + "<"+tagToExpander+tagToExpanderAttr+" style='cursor:pointer' class='ui_blockMore ui_blockMore"+xdi+"'>"+elementLabel+"</"+tagToExpander+"><div class='ui_blockDiv ui_blockDiv"+xdi+"'>" + exp_brAfter + "</div>");
			
			//Criar div temporaria apenas para testar o conteudo
			$("<div />", {
				id: 'ui_blockDivTEMP'+xdi,
				html: exp_brAfter
			}).appendTo('body');
			//console.log($("#ui_blockDivTEMP"+xdi).find("img").length);
			
			//Testar o conteudo para nao fazer o resumo em situacoes conhecidas
			var newContent = exp_brPrev + exp_brPoint;
			if(replaceAllSpaces($("#ui_blockDivTEMP"+xdi).text())=="" && $("#ui_blockDivTEMP"+xdi).find("img").length==0){ //Se nao tem texto (por exemplo, é um <br> ou <hr> sozinho) && nao tem imagem
				newContent += exp_brAfter;
			}else{
				var temp_beforeTrigger = "";
				var temp_trigger = "<"+tagToExpander+tagToExpanderAttr+" style='cursor:pointer' class='ui_blockMore ui_blockMore"+xdi+"'>" + elementLabel + "</"+tagToExpander+">";
				var temp_afterTrigger = "";
				var temp_content = "";
				if(elementSplit=="</li>"){
					temp_beforeTrigger = "<li class='ui_blockMoreList ui_blockMoreList"+xdi+"'>";
					temp_afterTrigger = "</"+tagToExpander+">";
					temp_content = "<li class='ui_blockDiv ui_blockDiv"+xdi+" ui_blockDivList'><ul>" + exp_brAfter + "</ul></li>";
				}else{
					temp_content = "<div class='ui_blockDiv ui_blockDiv"+xdi+"'>" + exp_brAfter + "</div>";
				}
				if($(".ui_block"+xdi).attr("data-trigger-at-the-end")=="true") newContent += temp_content + temp_beforeTrigger + temp_trigger + temp_afterTrigger;
				else newContent += temp_beforeTrigger + temp_trigger + temp_afterTrigger + temp_content;
			}
			
			//Remove div temporaria
			$("#ui_blockDivTEMP"+xdi).remove();
			
			//Insere o novo conteudo
			$(".ui_block"+xdi).append(newContent);
		}

		$('.ui_blockDiv'+xdi).hide();
		$('.ui_blockDiv'+xdi).unbind("click"); //Prevent duplicate bubble propagation, caso o gatilho ja tenha sido chamado.
		$('.ui_blockMore'+xdi).click(function() {			
			//Se usario setou para ser um unico clique
			if($(".ui_block"+xdi).attr("data-single-click")=="true"){
				var obj_to_hide = $(".ui_blockMore"+xdi);
				if(elementSplit=="</li>") obj_to_hide=$(".ui_blockMoreList"+xdi);
				obj_to_hide.fadeOut(100, function(){
					run_block(xdi);
				});
			
			//Se usario NAO setou para ser um unico clique
			}else{
				//Ativar botao
				$('.ui_blockMore'+xdi).toggleClass("active");

				//Trocar label
				if($('.ui_blockMore'+xdi).hasClass("active")){
					$('.ui_blockMore'+xdi).text(elementLabelLess);
				}else{
					$('.ui_blockMore'+xdi).text(elementLabel);
				}
				
				run_block(xdi);
			}

			return false;
		});
		
		$(item).addClass("ui_isdone");
	});

	setTimeout(function(){ if($.isFunction(window.callready_block)) { callready_block(); } },50); //Callready-function
}

//Gatilho
$(".ui_block:last-child").ready(function() {
	ready_block();
});