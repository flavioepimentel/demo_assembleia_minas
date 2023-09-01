//Funcao global de monitoramento de eventos
function trackAction(kind, group, element, ato, value) {
	/*
	Todos os elementos interativos (links, formularios, botões e etc) são automaticamente monitorados (se GA estiver disponivel).
	Logo, todos os parametros são recolhidos automaticamente, de acordo com o valor de cada um.
	Isso significa que não há necessidade de manipular ou usar a função (ela está reservada para uso somente da ui)
	De qualquer forma, se ainda existir necessidade do usuário usá-la, segue um exemplo de uso:
	 - kind: Descrição (ou tag) do gatilho [link | form | button]
	 - group: Grupo do gatilho [id do pai | class do pai | qq string para representar o grupo]
	 - element: Identificação do gatilho[class | id | qq string para representar o gatilho]
	 - ato: Ação[click | submit | etc.]
	 - value: Valor ou label do gatilho
	*/
	
	if(kind==undefined || group==undefined || element==undefined){ console.error("[trackAction] A função não recebeu todos os parâmetros necessários"); return false; }
	if(ato==undefined) ato="click";
	if(value==undefined) value="";

	//Pos-Tratamento
	if(element.charAt(0)==" ") element=element.substr(1,element.length);
	if(element.slice(-1)==" ") element=element.substr(0,element.length-1);
	
	if( urlAmbiente.indexOf('wwwd')==-1 && urlAmbiente.indexOf('wwwh')==-1){
		
		if(typeof(_gaq) != 'undefined'){
			//console.log("[trackAction] Google Analytics is installed. The General Track Event function is on.");

			/*
			// ### 1) Metodo por categoria (recomendado pelo GA) - _gag.push(['_trackEvent','Category','Action','Label'])
			
			//Preparando dados para envio
			var label="", label_divisor = "/";
			if(group!="") label += "Grupo: " + group;
			if(element!=""){
				if(label!="") label+=" "+label_divisor;
				label += "Elemento: " + element;
			}
			if(value!=""){
				if(label!="") label+=" "+label_divisor;
				label += "Valor: " + value;
			}
			//label += label_divisor + " Uri: "+window.location.href; //Recomendo nao usar. Melhor que armazenar a URL no evento é filtrar no GA por pagina. Caso contrario (enviando a URL, segmentaremos o evento)
			

			//Enviando dados para GA
			_gaq.push(['_trackEvent', kind, ato, label]);
			console.log("[trackAction] Categoria -> " +kind+ " || Ação -> " + ato+ " || Label -> " + label);
			*/


			// ### 2) Metodo por grupo (monitoramento mais prático)
			
			//Preparando dados para envio
			//var label = kind +": "+ element;
			var label =  kind +" '"+ element +"' in "+ group;
			//ato += " @ " + window.location.href; //Recomendo nao usar. Melhor que armazenar a URL no evento é filtrar no GA por pagina. Caso contrario (enviando a URL, segmentaremos o evento)
			if(value!="") ato += " to '" + value + "'";
			
			//Enviando dados para GA
			_gaq.push(['_trackEvent', group, ato, label]);
			console.log("[trackAction] [Category]: \"" +group+ "\"; [Action]: \"" + ato+ "\"; [Label]: \"" + label +"\"");
			/*
			Exemplos monitoramento no GA com metodo 2:

			> Capturar o total de clique de um item especifico
			Tipo: 'Métrica'
			Métrica: 'Total de eventos'
			Filtro: 'Categoria do evento' / Correspondência exata: 'myBanner'
			
			> Listar itens mais clicados (ainda que o item possua mais de um elemento de interacao)
			Tipo: 'Tabela'
			Colunas: 'Rótulo do evento' ou 'Ação do evento' / 'Total de eventos'
			Filtro: 'Categoria do evento' / Expressão Comum: 'itemPhoto|itemTitle'
			
			> Capturar o numero de submissao de um form de busca recuperando o valor
			Tipo: 'Tabela'
			Colunas: 'Ação do Evento' / 'Total de eventos'
			Filtro: 'Rótulo do evento' / Que contém: 'formQuery'
			*/
			
		}else{
			console.info("[trackAction] Google Analytics is not installed. The General Track Event function is off.");
		}
	}
}

function trackActionGetGroup(elem){
	var retorno = "";
	
	if($(elem).parents("*[data-track-group]").length>0){
		//Se tem algum elemento pai indicando qual é o grupo
		retorno = $(elem).parents("*[data-track-group]").attr("data-track-group");
		
	}else{
		//Pegar a primeira div acima
		var closestId = $(elem).closest('div[id!=""][id]'); //Primeira div acima com id existente e dirente de vazio
		var closestCl = $(elem).closest('div[class!=""][class]'); //Primeira div acima com class existente e dirente de vazio
		
		//Pegar o level no DOM da div
		var closestId_index = $("div").index(closestId); //closestId.index("div");
		var closestCl_index = $("div").index(closestCl); //closestCl.index("div");
		
		//Pegamos o mais profundo, ou seja, o mais perto de $(elem)
		if(closestId_index==-1 && closestCl_index==-1) retorno="(not set)"; //Se permanecer vazio (nao ha elementos div acima)
		else if(closestId_index>=closestCl_index) retorno=closestId.attr("id");//"#"+
		else retorno=closestCl.attr("class");//"."+
		
		//console.log("[trackAction] Index (profundidade) #"+closestId.attr('id')+": " + closestId_index + "\n[trackAction] Index (profundidade) ."+closestCl.attr('class')+": " + closestCl_index + "\n[trackAction] Grupo escolhido: " +  retorno);
	}

	return retorno;
}

// --- Gatilhos (usar on para pegar conteudo carregado via ajax ou demais scripts) --- //
$(document).ready(function(){
	//Form
	$("form").on("submit", function(event){
		var group = trackActionGetGroup(this);
		var element = "";
		if($(this).attr("name")!=undefined && $(this).attr("name")!="") element=$(this).attr("name");
		else if($(this).attr("id")!=undefined && $(this).attr("id")!="") element=$(this).attr("id");
		else if($(this).attr("class")!=undefined && $(this).attr("class")!="") element=$(this).attr("class");
		else element="(not set)";
		var value = $(this).serialize();
		var valueAct = $(this).attr("action");
		if(valueAct!=undefined && valueAct!=""){
			if(valueAct.indexOf("?")==-1) var concati="?"; else var concati="&";
			value=valueAct+concati+value;
		}
		value = decodeURIComponent(value.replace(/(login|user|usuario)=[^\&]+/gi, "$1=***").replace(/(senha|pass|password)=[^\&]+/gi, "$1=***"));
		trackAction('form', group, element, 'submit', value); //$(this).prop("tagName")
	});

	//Links
	$("a").on("click", function(event){
		var attrLink = "";
		if(link_type($(this).attr("href"))!="" && link_type($(this).attr("href"))!="placebo") attrLink = "href";
		if(link_type($(this).attr("data-link"))!="" && link_type($(this).attr("data-link"))!="placebo") attrLink = "data-link";
		if(attrLink!=""){
			var group = trackActionGetGroup(this);
			var element = $(this).text();
			if(replaceAllSpaces(element)==""){ //Se nao ha texto dentro do link
				element=""; //Limpando variavel
				if($(this).find("img").length>0){ //Se tem imagem dentro do link
					if($(this).find("img").attr("alt")!=undefined && $(this).find("img").attr("alt")!="") element=$(this).find("img").attr("alt"); //Se tem texto alternativo na imagem
					else if($(this).find("img").attr("title")!=undefined && $(this).find("img").attr("title")!="") element=$(this).find("img").attr("title"); //Se tem titulo na imagem
				}
				if(element==""){ //Se nao ha imagem ou se nenhum atributo da imagem estava disponivel
					if(link_type($(this).attr(attrLink))!="" && link_type($(this).attr(attrLink))!="placebo") element=$(this).attr(attrLink); //Se href for relevante
					else if($(this).attr("id")!=undefined && $(this).attr("id")!="") element=$(this).attr("id"); //Se link tem id
					else if($(this).attr("class")!=undefined && $(this).attr("class")!="") element=$(this).attr("class"); //Se link tem classe
					else if($(this).attr("onclick")!=undefined && $(this).attr("onclick")!="") element=$(this).attr("onclick"); //Se link tem onclick
					else element="(not set)"; //Última opção
					
				}
			}
			element = replaceAllBreaklines(element); //Removendo quebras de linhas
			element = replaceAllMultipleSpaces(element, " "); //Removendo multiplos espacos
			var value = "";
			if(link_type($(this).attr(attrLink))!="" && link_type($(this).attr(attrLink))!="placebo") value=$(this).attr(attrLink); //Se href for relevante
			else if($(this).attr("onclick")!=undefined && $(this).attr("onclick")!="") value=$(this).attr("onclick");
			else value="(not set)";
			trackAction('link', group, element, 'click', value);
		}
	});

	//Butoes
	$("button").on("click", function(event){
		var group = trackActionGetGroup(this);
		var element = $(this).text();
		if(replaceAllSpaces(element)==""){ //Se nao ha texto dentro do botao
			if(link_type($(this).attr("href"))!="" && link_type($(this).attr("href"))!="placebo") element=$(this).attr("href"); //Se href for relevante
			else if($(this).attr("id")!=undefined && $(this).attr("id")!="") element=$(this).attr("id"); //Se link tem id
			else if($(this).attr("class")!=undefined && $(this).attr("class")!="") element=$(this).attr("class"); //Se link tem classe
			else if($(this).attr("onclick")!=undefined && $(this).attr("onclick")!="") element=$(this).attr("onclick"); //Se link tem onclick
			else element="(not set)"; //Última opção
		}
		element = replaceAllBreaklines(element); //Removendo quebras de linhas
		element = replaceAllMultipleSpaces(element, " "); //Removendo multiplos espacos
		var value = "";
		if(link_type($(this).attr("href"))!="" && link_type($(this).attr("href"))!="placebo") value=$(this).attr("href");
		else if($(this).attr("onclick")!=undefined && $(this).attr("onclick")!="") value=$(this).attr("onclick");
		else if($(this).attr("type")!=undefined && $(this).attr("type")!="") value=$(this).attr("type");
		else value="(not set)";
		trackAction('link', group, element, 'click', value);
	});
});