/* --------------------------------- */
/* --- Accordion Resumo em Linha --- */
/* --------------------------------- */
//Accordion exclusivo para texto com um pequeno resumo

function redo_brief(pai){ //Refazer todos os brief de um elemento pai
	pai.find(".ui_briefHellip").remove();
	pai.find(".ui_briefMore").remove();
	pai.find(".ui_briefAnchor").remove();
	pai.find(".ui_briefHidden").each(function(idx, item) {
		$(item).parent(".ui_brief").append($(item).text());
		$(item).remove();
	});
	pai.find(".ui_brief").each(function(idx, item) {
		var classesWithoutBrief = removeClassWith(item,"ui_brief");
		$(item).removeClass().addClass(classesWithoutBrief).removeClass("ui_isdone").addClass("ui_brief");
	});
	ready_brief("ajax");
}
function run_brief(xdi){
	//callbefore_clientHeightChanged_onlyUi();
	
	if($.isFunction(window.callbefore_brief)) { callbefore_brief($(".ui_brief"+xdi),$("#ui_briefHidden"+xdi)); } //Callbefore-function
	
	var mySpeed = "normal";
	if($(".ui_brief"+xdi).attr("data-speed")!=undefined){
		mySpeed = $(".ui_brief"+xdi).attr("data-speed");
		if(mySpeed!="slow" && mySpeed!="normal" && mySpeed!="fast") mySpeed=Number(mySpeed);
	}

	//Fechar
	if ( $("#ui_briefHidden"+xdi).is(":visible") ) {
		$("#ui_briefHidden"+xdi).animate({
			opacity: 0,
		}, mySpeed, function() {
			//callback

			$("#ui_briefHellip"+xdi).show();
			$("#ui_briefMore"+xdi).show();
			$("#ui_briefHidden"+xdi).css("display","none");
			
			//if ( (window.pageYOffset + f_topBar) > $(".ui_brief"+xdi).offset().top) { // Só será ancorado se a posição Y da barra de rolagem for maior que a posicao da ancora
			if ( (f_scrollTop() + f_topBar) > $(".ui_brief"+xdi).offset().top) { // Só será ancorado se a posição Y da barra de rolagem for maior que a posicao da ancora
				$("html,body").animate({ scrollTop: $(".ui_brief"+xdi).offset().top - f_topBar},'slow'); //Para chamar a ancora, passamos a class do expander que é o mesmo id da ancoras (para facilitar)
			}

			setTimeout(function(){ if($.isFunction(window.callback_brief)) { callback_brief($(".ui_brief"+xdi),$("#ui_briefHidden"+xdi)); } },50); //Callback-function
			
			//callback_clientHeightChanged_onlyUi();
		});

	//Abrir
	}else{
		$("#ui_briefHellip"+xdi).hide();
		$("#ui_briefMore"+xdi).hide();
		$("#ui_briefHidden"+xdi).css("display","inline");
		$("#ui_briefHidden"+xdi).animate({
			opacity: 1,
		}, mySpeed, function() {
			//callback

			setTimeout(function(){ if($.isFunction(window.callback_brief)) { callback_brief($(".ui_brief"+xdi),$("#ui_briefHidden"+xdi)); } },50); //Callback-function
			
			//Se for para ancorar
			if($(".ui_brief"+xdi).attr("data-anchor")=="true"){
				anchor_ui($("#ui_briefHidden"+xdi));
			}
			
			//callback_clientHeightChanged_onlyUi();
		});
	}
}
function ready_brief(origem){
	$(".ui_brief:not(.ui_isdone)").each(function(idx, item) {
		if(origem==undefined){ origem=""; }
		if(origem=="ajax"){
			var xdi = recursividadeID+"_"+idx;
		}else{
			var xdi = idx;
		}
		
		$(item).addClass("ui_brief"+xdi);

		$(".ui_brief"+xdi).before('<span id="ui_brief'+xdi+'" class="ui_briefAnchor ui_briefAnchor'+xdi+'"></span>'); //Insere um elemento para ser a ancora. Ele tem o id igual a class do expander (para facilitar a chamada mais tarde)
		
		// Apos quantos cararacteres
		var caracteresToExpander = "";
		if($(".ui_brief"+xdi).attr("data-num")!=undefined){
			caracteresToExpander = $(".ui_brief"+xdi).attr("data-num");
		}else{
			caracteresToExpander = 360;
		}
		
		// Margem de segurança
		var margem_de_seguranca = 0;
		if($(".ui_brief"+xdi).attr("data-margin-of-safety")!=undefined){
			margem_de_seguranca = $(".ui_brief"+xdi).attr("data-margin-of-safety");
		}
		
		// Rotulo
		var labelToExpander = "";
		if($(".ui_brief"+xdi).attr("data-label")!=undefined){
			labelToExpander = $(".ui_brief"+xdi).attr("data-label");
		}else{
			labelToExpander = "Leia Mais";
		}
		
		var labelToExpanderLess = "";
		if($(".ui_brief"+xdi).attr("data-label-active")!=undefined){
			labelToExpanderLess = $(".ui_brief"+xdi).attr("data-label-active");
		}else{
			labelToExpanderLess = "-";
		}
		
		// Tag do elemento-gatilho para expandir/retrair (é importante ter uma alternativa ao "<a>" para os casos onde o brief é usado dentro de um outro "<a>", ou seja, o "<a>" do brief iria quebrar o layout
		var tagToExpander = "";
		if($(".ui_brief"+xdi).attr("data-element")!=undefined){ //a(default), span, div...
			tagToExpander = $(".ui_brief"+xdi).attr("data-element");
		}else{
			tagToExpander = "a";
		}
		var tagToExpanderAttr = "";
		if(tagToExpander=="a"){ tagToExpanderAttr=' href="javascript:;"';
		}else{ //Se outra tag foi usada, pode significar que ha um "<a>" acima. Logo, é preciso remover a propagacao do link (quando clicar no 'leia mais', nao pode ter trigger desse "<a>" acima)
			//Pegamos o href
			var t_href = $(".ui_brief"+xdi).parents("a").attr("href");

			//Se vier de redo, pegamos o href do data-* ja que o href sera sobrescrito
			if($(".ui_brief"+xdi).attr("data-href-original-for-redo")!=undefined) t_href = $(".ui_brief"+xdi).attr("data-href-original-for-redo");
			
			if(link_type(t_href)!="placebo"){	
				//Armazenar o href original (para redo, vamos guarda-lo em um data-*)
				$(".ui_brief"+xdi).attr("data-href-original-for-redo",t_href);
				
				$(".ui_brief"+xdi).parents("a")
					.attr("href","javascript:void(0);")
					.attr("onclick","if(!$(event.target).hasClass('ui_briefMore') && !$(event.target).hasClass('ui_briefPrevent') && $(event.target).parents('.ui_briefPrevent').length==0){ location.href='"+t_href+"'; }")
				;
			}
		}

		// Expander
		//$(".ui_brief"+xdi).each(function(idx2, item2) { //Para cada elemento
			if( $(".ui_brief"+xdi).text().length >= Number(caracteresToExpander) + Number(margem_de_seguranca) ){
				// 1) Evitar quebrar em tags notaveis (1 de 2) - identificação das tags
				var plainTxt = $(".ui_brief"+xdi).html(); //Colocando o html como plain-text para tratamentos
				
				// 1.a) Tag <br>
				var regex_br = /<br[\s\S]*?>/g; //<br(...)>
				var matches_br = getMatches(plainTxt, regex_br);
				var temp_br = "^"; //O ideal é que seja a expressao colocada de forma temporario seja um unico caracter para que o corte da funcao nao o divida (sugiro acentos soltos, como '~', '^' ou '´',  ja que dificilmente serao usados sem uma letra, como 'ã', 'â' ou 'á')
				plainTxt = plainTxt.replace(regex_br,temp_br); //Substituir temporariamente
				
				// 1.b) Tag <a>
				var regex_a = /<a[\s\S]*?<\/a>/g;  //<a(...)</a>
				var matches_a = getMatches(plainTxt, regex_a);
				var temp_a = "~"; //O ideal é que seja a expressao colocada de forma temporario seja um unico caracter para que o corte da funcao nao o divida (sugiro acentos soltos, como '~', '^' ou '´',  ja que dificilmente serao usados sem uma letra, como 'ã', 'â' ou 'á')
				plainTxt = plainTxt.replace(regex_a,temp_a); //Substituir temporariamente
				
				// 1.c) Tag <p>
				var regex_p = /<p[\s\S]*?<\/p>/g;  //<p(...)</p>
				var matches_p = getMatches(plainTxt, regex_p);
				var temp_p = "´"; //O ideal é que seja a expressao colocada de forma temporario seja um unico caracter para que o corte da funcao nao o divida (sugiro acentos soltos, como '~', '^' ou '´',  ja que dificilmente serao usados sem uma letra, como 'ã', 'â' ou 'á')
				plainTxt = plainTxt.replace(regex_p,temp_p); //Substituir temporariamente
				
				// 1.d) Tag <i>
				var regex_i = /<i[\s\S]*?<\/i>/g;  //<i(...)</i>
				var matches_i = getMatches(plainTxt, regex_i);
				var temp_i = "`"; //O ideal é que seja a expressao colocada de forma temporario seja um unico caracter para que o corte da funcao nao o divida (sugiro acentos soltos, como '~', '^' ou '´',  ja que dificilmente serao usados sem uma letra, como 'ã', 'â' ou 'á')
				plainTxt = plainTxt.replace(regex_i,temp_i); //Substituir temporariamente
				
				// 1.e) Tag <em>
				var regex_em = /<em[\s\S]*?<\/em>/g;  //<em(...)</em>
				var matches_em = getMatches(plainTxt, regex_em);
				var temp_em = "¿"; //O ideal é que seja a expressao colocada de forma temporario seja um unico caracter para que o corte da funcao nao o divida (sugiro acentos soltos, como '~', '^' ou '´',  ja que dificilmente serao usados sem uma letra, como 'ã', 'â' ou 'á')
				plainTxt = plainTxt.replace(regex_em,temp_em); //Substituir temporariamente
				
				// 1.f) Tag <b>
				var regex_b = /<b[\s\S]*?<\/b>/g;  //<b(...)</b>
				var matches_b = getMatches(plainTxt, regex_b);
				var temp_b = "¨"; //O ideal é que seja a expressao colocada de forma temporario seja um unico caracter para que o corte da funcao nao o divida (sugiro acentos soltos, como '~', '^' ou '´',  ja que dificilmente serao usados sem uma letra, como 'ã', 'â' ou 'á')
				plainTxt = plainTxt.replace(regex_b,temp_b); //Substituir temporariamente
				
				// 1.g) Tag <strong>
				var regex_strong = /<strong[\s\S]*?<\/strong>/g;  //<strong(...)</strong>
				var matches_strong = getMatches(plainTxt, regex_strong);
				var temp_strong = "|"; //O ideal é que seja a expressao colocada de forma temporario seja um unico caracter para que o corte da funcao nao o divida (sugiro acentos soltos, como '~', '^' ou '´',  ja que dificilmente serao usados sem uma letra, como 'ã', 'â' ou 'á')
				plainTxt = plainTxt.replace(regex_strong,temp_strong); //Substituir temporariamente
				
				// 1.h) Tag <u>
				var regex_u = /<u[\s\S]*?<\/u>/g;  //<u(...)</u>
				var matches_u = getMatches(plainTxt, regex_u);
				var temp_u = "§"; //O ideal é que seja a expressao colocada de forma temporario seja um unico caracter para que o corte da funcao nao o divida (sugiro acentos soltos, como '~', '^' ou '´',  ja que dificilmente serao usados sem uma letra, como 'ã', 'â' ou 'á')
				plainTxt = plainTxt.replace(regex_u,temp_u); //Substituir temporariamente
				
				// 2) Fazendo o corte do Leia Mais
				var retorno = plainTxt.substring(0,caracteresToExpander);
				var btnLess = '<'+tagToExpander+tagToExpanderAttr+' id="ui_briefLess'+xdi+'" onClick="run_brief(\''+xdi+'\');" class="ui_briefLess">'+labelToExpanderLess+'</'+tagToExpander+'>';
				retorno += '<span id="ui_briefHellip'+xdi+'" class="ui_briefHellip">&hellip;</span><'+tagToExpander+tagToExpanderAttr+' id="ui_briefMore'+xdi+'" class="ui_briefMore" onClick="run_brief(\''+xdi+'\');" style="cursor:pointer;">'+labelToExpander+'</'+tagToExpander+'>';
				retorno += '<span id="ui_briefHidden'+xdi+'" class="ui_briefHidden">';
					if($(".ui_brief"+xdi).attr("data-single-click")!="true" && $(".ui_brief"+xdi).attr("data-trigger-at-the-init")=="true") retorno += btnLess;
					retorno += plainTxt.substring(caracteresToExpander,plainTxt.length);
					if($(".ui_brief"+xdi).attr("data-single-click")!="true" && $(".ui_brief"+xdi).attr("data-trigger-at-the-init")!="true") retorno += btnLess;
				retorno += '</span>';
				
				// 3) Inserir e tratando conteudo
				$(".ui_brief"+xdi).html(retorno);
				$("#ui_briefHidden"+xdi).hide().css('opacity','0');
				
				// 4) Evitar quebrar em tags notaveis (1 de 2) - Re-inserção das tags
				//console.log("caracteresToExpander: "+ caracteresToExpander +" / matches: "+matches_br.length+" / "+matches_a.length+" / "+matches_p.length+" / "+matches_i.length+" / "+matches_em.length+" / "+matches_b.length+"/ "+matches_strong.length+" / "+matches_u.length);
				//for(j=0;j<matches_br.length;j++) $(".ui_brief"+xdi).html( $(".ui_brief"+xdi).html().replace(temp_br, matches_br[j]) );
				$(".ui_brief"+xdi).html( $(".ui_brief"+xdi).html().replace(new RegExp('\\'+temp_br,"g"),"<br />") ); //a tag <br /> nao tem conteudo nem atributo (ou nao deveria). Logo, nao é necessario passar por um for (que sobrecarregar a pagina) para repor cada item, ja que todos os resultados sao os mesmos: <br />. Nesse caso, fazemos um 'replace all' geral e mais rapido
				for(j=0;j<matches_a.length;j++) $(".ui_brief"+xdi).html( $(".ui_brief"+xdi).html().replace(temp_a, matches_a[j]) );
				for(j=0;j<matches_p.length;j++) $(".ui_brief"+xdi).html( $(".ui_brief"+xdi).html().replace(temp_p, matches_p[j]) );
				for(j=0;j<matches_i.length;j++) $(".ui_brief"+xdi).html( $(".ui_brief"+xdi).html().replace(temp_i, matches_i[j]) );
				for(j=0;j<matches_em.length;j++) $(".ui_brief"+xdi).html( $(".ui_brief"+xdi).html().replace(temp_em, matches_em[j]) );
				for(j=0;j<matches_b.length;j++) $(".ui_brief"+xdi).html( $(".ui_brief"+xdi).html().replace(temp_b, matches_b[j]) );
				for(j=0;j<matches_strong.length;j++) $(".ui_brief"+xdi).html( $(".ui_brief"+xdi).html().replace(temp_strong, matches_strong[j]) );
				for(j=0;j<matches_u.length;j++) $(".ui_brief"+xdi).html( $(".ui_brief"+xdi).html().replace(temp_u, matches_u[j]) );
				
				// 5) Ajuste defensivo
				//console.log(replaceAllSpaces($("#ui_briefHidden"+xdi).text()));
				if( replaceAllSpaces($("#ui_briefHidden"+xdi).text()) == replaceAllSpaces(labelToExpanderLess) ){ //Se so tem o sinal e o resto do conteudo está vazio
					run_brief(xdi); $("#ui_briefLess"+xdi).remove();
				}
			}
		//});
		
		$(item).addClass("ui_isdone");
	});
	
	if($.isFunction(window.callready_brief)) { callready_brief(); } //Callready-function
}

//Gatilho
$(".ui_brief:last-child").ready(function() {
	ready_brief();
});