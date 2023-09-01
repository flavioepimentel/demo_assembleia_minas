/* --------------------------------------- */
/* --- Funcoes-Muleta para comunidades --- */
/* --------------------------------------- */
//Pegar chave token (http://developers.facebook.com/docs/opengraph/howtos/publishing-with-app-token) e rodar ajax para contabilizar os shares

if(typeof useTWCount == 'undefined') useTWCount = false; //Se variavel nao foi passada
if(typeof useFBCount == 'undefined') useFBCount = false; //Se variavel nao foi passada
var FBappID = 1154754775193384;
var use_short_url_tw = false;
var debugToken = true;

function getTokenFB(){
	//if(browser("name")=="Internet Explorer" && browser("version")<=9){ //Pegar chave token manual (https://developers.facebook.com/tools/explorer?method=GET&path=100002599881303%3Ffields%3Did%2Cname):
	//	if(TokenFB!="CAACEdEose0cBAMrRV3PyyvFngvhU3Bq7mIZADD7V8Wq6aBs3ot0ZC61bpQytZBmLR1yTSfcXmPul1OknFNdM3f6mhm4ZAmWrj6270vntKMBMLNmuHJZBJ5EbyP6YV3p4LTxfUpZA7DZAtCjB97eb8dwRFHvC1u2fkh3ZCXhZAXzuYVHD8FzegP0GZCjwU4BjsxWS3vTQADsZACS6Bt47ybSAUZBK"){
	//		//--- Conclusao 1 de 4 --- //
	//		TokenFB = "CAACEdEose0cBAMrRV3PyyvFngvhU3Bq7mIZADD7V8Wq6aBs3ot0ZC61bpQytZBmLR1yTSfcXmPul1OknFNdM3f6mhm4ZAmWrj6270vntKMBMLNmuHJZBJ5EbyP6YV3p4LTxfUpZA7DZAtCjB97eb8dwRFHvC1u2fkh3ZCXhZAXzuYVHD8FzegP0GZCjwU4BjsxWS3vTQADsZACS6Bt47ybSAUZBK";
	//		saveLocalData("TokenFB",TokenFB);
	//		// ----------------------- //
	//	}
	//}else{
		var MyUrl = "https://graph.facebook.com/oauth/access_token?client_id=186928284792262&client_secret=fe3b93bcb143b339e509602ec88b3795&grant_type=client_credentials"; //"https://graph.facebook.com/oauth/access_token?client_id=186928284792262&client_secret=fe3b93bcb143b339e509602ec88b3795&grant_type=fb_exchange_token&fb_exchange_token="+TokenFB;

		if(TokenFB==undefined || TokenFB==null || TokenFB==""){ //Pegar o token pela primeira vez
			$.ajax({
				url: MyUrl,
				cache: false,
				//dataType: ($.browser.msie) ? "text" : "text",
				success: function(data) {
					if(data.error==undefined){
						//--- Conclusao 2 de 4 --- //
						TokenFB = data.access_token; saveLocalData("TokenFB",TokenFB);
						if(debugToken) console.log("Token gerado com sucesso:" + TokenFB);
						// ----------------------- //
					}else{
						if(debugToken) console.error("Error. Não foi possível pegar token: "+data.error);
					}
				},
				error: function(XMLHttpRequest2, textStatus2, errorThrown2) { 
					if (XMLHttpRequest2.status == 0){
						if(debugToken) console.error("Error. Token não foi resgatado devido a problemas de conexão");
					}else if (XMLHttpRequest2.status == 404){
						if(debugToken) console.error("Error. A URL para token não foi encontrada");
					}else if (XMLHttpRequest2.status == 500){
						if(debugToken) console.error("Error. Erro de servidor ao recuperar token");
					}else{
						if(debugToken) console.error("Error. Desconhecido: " + XMLHttpRequest2.responseText);
					}
				}
			});

		}else{ //Token ja foi iniciado, testamos se ele ainda é valido
			$.ajax({
				url: "https://graph.facebook.com/oauth/access_token_info?client_id=186928284792262&access_token="+TokenFB,
				cache: false,
				success: function(data) {
					if(data.error==undefined){
						//--- Conclusao 3 de 4 --- //
						TokenFB = data.access_token; saveLocalData("TokenFB",TokenFB);
						if(debugToken) console.log("Token resgatado do cookie ainda é válido: " + TokenFB);
						// ----------------------- //
					}else{ //Se retornou como token invalido (ja expirou), zeramos o TokenFB e rodamos a funcao novamente
						//--- Conclusao 4 de 4 --- //
						TokenFB = ""; saveLocalData("TokenFB",TokenFB);
						if(debugToken) console.warn("Error. Token expirado. A função será executada novamente para renová-la");
						getTokenFB();
						// ----------------------- //
					}
				},
				error: function(XMLHttpRequest2, textStatus2, errorThrown2) {
					if(debugToken) console.error("Error. Teste do token não foi realizado: " + XMLHttpRequest2.responseText);
				}
			});
		}
	//}
}

//Iniciar variavel global
var TokenFB = getLocalData("TokenFB");
//var TokenFB = "CAACEdEose0cBAMrRV3PyyvFngvhU3Bq7mIZADD7V8Wq6aBs3ot0ZC61bpQytZBmLR1yTSfcXmPul1OknFNdM3f6mhm4ZAmWrj6270vntKMBMLNmuHJZBJ5EbyP6YV3p4LTxfUpZA7DZAtCjB97eb8dwRFHvC1u2fkh3ZCXhZAXzuYVHD8FzegP0GZCjwU4BjsxWS3vTQADsZACS6Bt47ybSAUZBK";

//Rodar funcao
if(useFBCount) getTokenFB();


//Funcao para limpar uma url com parametros de compartilhamento
function removeParamsCampanha(url) {
	//Atencao: o texto deve chegar sem escape, decode ou unicode. Os tratamentos abaixo retiram caracteres especiais sem codificacao, como ? e &
	
	//Parametros de Campanhas
	url = urlSemParametro("utm_source",url);
	url = urlSemParametro("utm_medium",url);
	url = urlSemParametro("utm_campaign",url);
	
	//Parametros do Facebook
	url = urlSemParametro("post_id",url);
	url = urlSemParametro("refid",url);
	url = urlSemParametro("ref",url);
	url = urlSemParametro("fb_source",url);
	
	//Lixo do Redirect do compatilhar via facebook (deve ficar depois do RedirectUri)
	url = url.replace("#_=_","");

	return url;
}


/* ------------------- */
/* --- Comunidades --- */
/* ------------------- */

//Variaveis contadoras. Serao concatenadas no include comunidades
var contadorIncludeShareTW = 0;
var contadorIncludeShareFB = 0;

function numeroShareTw(loop,url) { //O twitter desconsidera parametros de campanha. Nao precisa calcular as 2 URLs
	if(useTWCount){
		//Tratamento url
		if(url==""){ //deve ficar dentro da funcao, para pegar url dinamica
			var urlGet = f_urlAll().toString();
		}else{
			var urlGet = url;
		}
		if(link_type(urlGet)=="relative") urlGet=f_urlProtocol()+"//"+f_urlAmbiente()+urlGet;
		
		//Desconsiderar parametros de campanha:
		urlGet = removeParamsCampanha(urlGet);
		
		//Encode URL
		//var urlEncode = encodeURIComponent(urlGet);
		var urlEncode = urlGet.replaceAll("?","%3F").replaceAll("&","%26").replaceAll(":","%3A").replaceAll("/","%2F").replaceAll("=","%3D").replaceAll(" ","+").replace(/\+\++/g,"+");
		
		//Json para retornar o numero de tweets da url
		jQuery.getJSON(f_urlProtocol()+"//urls.api.twitter.com/1/urls/count.json?url="+urlEncode+"&callback=?", function(data) {
			$(".almg-js_countTW:eq("+loop+")").text(data.count);
		});
	}
}


function numeroShareFb(loop,url,auto_count) { //O facebook nao desconsidera parametros de campanha. É preciso calcular as 2 URLs
	if(useFBCount){
		/*
		http://graph.facebook.com/SUA_URL&callback=?
		http://graph.facebook.com/?id=SUA_URL
		http://api.facebook.com/restserver.php?method=links.getStats&format=JSON&callback=?&urls=SUA_URL
		https://api.facebook.com/method/fql.query?query=select%20%20like_count,%20total_count,%20share_count,%20click_count%20from%20link_stat%20where%20url=%22SUA_URL%22
		http://free.sharedcount.com/url?url=http%3A%2F%2Fwww.almg.gov.br%2Facompanhe%2Fnoticias%2Farquivos%2F2015%2F08%2F27_release_pessoa_deficiencia_visita_censa.html&apikey=479dfb502221d2b4c4a0433c600e16ba5dc0df4e
		http://www.emetello.com/facebook-share-counter
		http://sharedcount.com
		http://free.sharedcount.com/url?url=SUA_URL (tb oferece dados do twitter)
		*/
		
	
		//Tratamento url
		if(url==""){ //deve ficar dentro da funcao, para pegar url dinamica
			var urlGet = f_urlAll().toString();
		}else{
			var urlGet = url;
		}
		if(link_type(urlGet)=="relative") urlGet=f_urlProtocol()+"//"+f_urlAmbiente()+urlGet;
		
		//Desconsiderar parametros de campanha:
		urlGet = removeParamsCampanha(urlGet);
		
		//Encode URL
		//var urlEncode = encodeURIComponent(urlGet);
		var urlEncode = urlGet.replaceAll("?","%3F").replaceAll("&","%26").replaceAll(":","%3A").replaceAll("/","%2F").replaceAll("=","%3D").replaceAll(" ","+").replace(/\+\++/g,"+");
		
		//Json para retornar o numero de compartilhamentos ja efetuados no facebook
		//1) Qndo o compartilhamento é direto no FB (e sem campanha), apenas a consulta à URL SEM campanha retorna a informação de compartilhamento
		//2) Qndo o compartilhamento é no botão de compartilhar, as duas consultas às URLs COM e SEM campanha retornam a informação de compartilhamento
		// Calculo a ser feito: (2 - 1) + 1.
		// Tratamento de execacao: Calc_A) A subtracao nao pode ser negativa ou Calc_B) exibir o maior valor entre calculo e 1). Metodo usado: "Calc-A"
		
	
		if(urlGet.indexOf("?")==-1 && urlGet.indexOf("%3F")==-1) { //para verificar se existe interrogacao
			var urlGet2 = urlGet + "%3Futm_source=Facebook%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
		}else{
			var urlGet2 = urlGet + "%26utm_source=Facebook%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
		}
	
		//Encode URL
		//var urlEncode2 = encodeURIComponent(urlGet2); //escape(urlGet2);
		var urlEncode2 = urlGet2.replaceAll("?","%3F").replaceAll("&","%26").replaceAll(":","%3A").replaceAll("/","%2F").replaceAll("=","%3D").replaceAll(" ","+").replace(/\+\++/g,"+");
		
		//variavel da URL com e sem campanha
		var urlSemCampanha = 0;
		var urlComCampanha = 0;
		
		//Chamadas
		if(replaceAllSpaces(replaceAllBreaklines(TokenFB))==""){
			if(auto_count=="1" || auto_count==undefined || auto_count=="" || auto_count==null){
				TokenFB = ""; saveLocalData("TokenFB",TokenFB);
				if(debugToken) console.warn("Token não foi gerado e o contador de compartilhamento do facebook não pode ser inciado. O ajax para gerar a chave ainda pode estar em execução. Tentaremos carregar o contador de compartilhamento do facebook novamente em 2 segundos.");
				setTimeout(function(){ numeroShareFb(loop,url,"2"); }, 2000);
			}else if(auto_count=="2"){
				TokenFB = ""; saveLocalData("TokenFB",TokenFB);
				if(debugToken) console.warn("Token não foi gerado e o contador de compartilhamento do facebook não pode ser inciado. O ajax para gerar a chave ainda pode estar em execução. Tentaremos carregar o contador de compartilhamento do facebook mais uma vez em 4 segundos.");
				setTimeout(function(){ numeroShareFb(loop,url,"3"); }, 4000);
			}else if(auto_count=="3"){
				if(debugToken) console.warn("Token não foi gerado e o contador de compartilhamento do facebook não pode ser inciado. O ajax para gerar a chave ainda pode estar em execução. Não haverá uma nova tentativa.");
			}else{
				if(debugToken) console.error("Token não foi gerado. A função encontrou um problema ao tentar gerar a chave e iniciar o contador de compartilhamento do facebook.");
			}
			
		}else{
	
			if(debugToken) console.log("Token existe. A chamada ajax será iniciada");
			$.get('https://graph.facebook.com/v2.3/?id='+urlEncode+'&access_token='+TokenFB+'&fields=share{share_count}&callback=?', function(data) {
				if(data.error!=undefined){
					if(debugToken) console.warn(data.error);
				}else{
					if(debugToken) console.log("Token gerado. O contador do facebook foi inciado");
					//console.log(data);
					
					var urlSemCampanha = 0
					if(data.share!=undefined && data.share.share_count!=undefined) urlSemCampanha = data.share.share_count;
		
					$.get('https://graph.facebook.com/v2.3/?id='+urlEncode2+'&access_token='+TokenFB+'&fields=share{share_count}&callback=?', function(data2) {
						if(data2.error!=undefined){
							if(debugToken) console.warn(data2.error);
						}else{
							if(debugToken) console.log("O segundo sucesso do contador do facebook foi inciado");
							//if(debugToken) console.log(data2);
												
							var urlComCampanha = 0
							if(data2.share!=undefined && data2.share.share_count!=undefined) urlComCampanha = data2.share.share_count;
				
							if(urlComCampanha-urlSemCampanha<0) var somaUrlsFB=urlSemCampanha; //Calc-A
							else var somaUrlsFB=(urlComCampanha - urlSemCampanha) + urlSemCampanha;
				
							$(".js_countFacebook:eq("+loop+")").text(somaUrlsFB);
						}
					}, 'json');
				}
				
			}, 'json');
		}
	}
}

//Postar para whatsapp
$(".almg-js_whatsapp:last-child").ready( function(){
	/*
	$.ajax({
		type: 'HEAD',
		url: 'whatsapp://send?text=text=Hello%20World!',
		success: function() {
			//
		},
		error: function() {
			$(".almg-js_whatsapp").remove();
		}
	});
	*/
	/*if(!is_mobile() || os_name()=="ios_ipod" || os_name()=="ios_ipad"){
		$(".almg-js_whatsapp").remove();
		$(".almg-js_shareToggleCol").addClass("col-4");
	}else{
		$(".almg-js_shareToggleCol").addClass("col-3");
	}*/
});
function postToWhatsApp(url,text) {
	//Tratamento url
	if(url==undefined || url==""){ //deve ficar dentro da funcao, para pegar url dinamica a cada onclick
		var urlGet = f_urlAll().toString();
	}else{
		var urlGet = url;
	}
	if(link_type(urlGet)=="relative") urlGet=f_urlProtocol()+"//"+f_urlAmbiente()+urlGet;
	
	//Desconsiderar parametros de campanha:
	urlGet = removeParamsCampanha(urlGet);
	
	//Inserir parametros de campanha
	if(urlGet.indexOf("?")==-1 && urlGet.indexOf("%3F")==-1) { //para verificar se existe interrogacao
		var urlLong = urlGet + "%3Futm_source=WhatsApp%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
	}else{
		var urlLong = urlGet + "%26utm_source=WhatsApp%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
	}
	
	//var urlEncode = encodeURIComponent(urlLong);
	var urlEncode = urlLong.replaceAll("?","%3F").replaceAll("&","%26").replaceAll(":","%3A").replaceAll("/","%2F").replaceAll("=","%3D").replaceAll(" ","+").replace(/\+\++/g,"+");
	
	//Tratamento text
	if(text==undefined || text==""){ //se text estiver vazia, pegamos...
		text = document.title;
	}
	
	//Evento GA
	if($.isFunction(window.trackAction)) trackAction("link", "Compartilhamento", "Whatsapp", "click", urlGet);
	
	//Abrir link
	var urlSend = "https://api.whatsapp.com/send?text="+text+" "+urlEncode; //Pode valer para todos os dispositivos
	if(is_mobile()) urlSend = "whatsapp://send?text="+text+" "+urlEncode; else urlWP = "https://web.whatsapp.com/send?text="+text+" "+urlEncode; //url especificas por dispositivos
	location.href = urlSend;
}



//Postar para Telegram
//$(".almg-js_telegram:last-child").ready( function(){
//});
function postToTelegram(url,text) {
	//Tratamento url
	if(url==undefined || url==""){ //deve ficar dentro da funcao, para pegar url dinamica a cada onclick
		var urlGet = f_urlAll().toString();
	}else{
		var urlGet = url;
	}
	if(link_type(urlGet)=="relative") urlGet=f_urlProtocol()+"//"+f_urlAmbiente()+urlGet;
	
	//Desconsiderar parametros de campanha:
	urlGet = removeParamsCampanha(urlGet);
	
	//Inserir parametros de campanha
	if(urlGet.indexOf("?")==-1 && urlGet.indexOf("%3F")==-1) { //para verificar se existe interrogacao
		var urlLong = urlGet + "%3Futm_source=Telegram%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
	}else{
		var urlLong = urlGet + "%26utm_source=Telegram%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
	}
	
	//var urlEncode = encodeURIComponent(urlLong);
	var urlEncode = urlLong.replaceAll("?","%3F").replaceAll("&","%26").replaceAll(":","%3A").replaceAll("/","%2F").replaceAll("=","%3D").replaceAll(" ","+").replace(/\+\++/g,"+");
	
	//Tratamento text
	if(text==undefined || text==""){ //se text estiver vazia, pegamos...
		text = document.title;
	}
	
	//Evento GA
	if($.isFunction(window.trackAction)) trackAction("link", "Compartilhamento", "Telegram", "click", urlGet);
	
	//Abrir link
	var urlSend = "https://t.me/share/url?url="+urlEncode+"&text="+text;
	location.href = urlSend;
}


//Postar para twitter
function postToTwitter(desc,url) {
	//Tratamento desc
	if(desc==undefined || desc==""){ //se desc estiver vazia, pegamos...
		if($("meta[name=description]").attr("content")!="" && $("meta[name=description]").attr("content")!=undefined){
			desc = $('meta[name=description]').attr("content");
		}else{
			desc = document.title;
		}
	}

	//Tratamento url
	if(url==undefined || url==""){ //deve ficar dentro da funcao, para pegar url dinamica a cada onclick
		var urlGet = f_urlAll().toString();
	}else{
		var urlGet = url;
	}
	if(link_type(urlGet)=="relative") urlGet=f_urlProtocol()+"//"+f_urlAmbiente()+urlGet;
	
	//Desconsiderar parametros de campanha:
	urlGet = removeParamsCampanha(urlGet);

	//Inserir parametros de campanha
	if(urlGet.indexOf("?")==-1 && urlGet.indexOf("%3F")==-1) { //para verificar se existe interrogacao
		var urlLong = urlGet + "%3Futm_source=Twitter%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
	}else{
		var urlLong = urlGet + "%26utm_source=Twitter%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
	}
	
	//Postar
	var urlSend="";
	if(use_short_url_tw){
		$.getJSON("https://api-ssl.bitly.com/v3/shorten?callback=?", { 
			"format": "json",
			"apiKey": "R_5d9fbf1b978f535bcb2f5cee95e8d86a",
			"login": "almg",
			"longUrl": urlLong,
		},
		function(response) {
			//console.log(JSON.stringify(response));
			if(response.data.url!="" && response.data.url!=undefined) { //Sucesso
				var urlShort = response.data.url;
				
				//Continuar processo de post no twitter
				var caracteresPermitidos = 139 - urlShort.length; //140 twitter menos um espaco (entre a desc e a url), menos a url da pagina
		
				if(desc.length > caracteresPermitidos-4){ //se a descricao for maior que o total permitido (mais uma margem de seguranca por causa da reticencias e do espaco inserido entre a descricao e a url ao final do codigo)
					//alert(desc.length + " / " + caracteresPermitidos);
					desc = desc.substr(0,caracteresPermitidos-4) + "...";
				}
		
				urlSend = urlShort;
				
				//Evento GA
				if($.isFunction(window.trackAction)) trackAction("link", "Compartilhamento", "Twitter", "click", urlGet);
				
				//Abrir twitter
				//window.open("http://twitter.com/home?status=" + desc + " " + urlSend,"Twitter","width=640,height=300");
				//location.href = "http://twitter.com/home?status=" + desc + " " + urlSend;
				location.href = "http://twitter.com/share?text="+desc+"&url="+urlSend;/*+"&hashtags=#ALMG,#Assembleia"*/
			
			}else{ //Erro
				console.log("Erro encurtamento: " + response.status_txt);
				use_short_url_tw = false;
				postToTwitter(desc,url);
			}
			
		});
		
	}else{
		//var urlEncode = encodeURIComponent(urlLong);
		var urlEncode = urlLong.replaceAll("?","%3F").replaceAll("&","%26").replaceAll(":","%3A").replaceAll("/","%2F").replaceAll("=","%3D").replaceAll(" ","+").replace(/\+\++/g,"+");
		
		//Continuar processo de post no twitter
		var caracteresDesconsiderar = f_urlProtocol()+"//"+f_urlAmbiente()+"/"; //Do dominio para frente (aquivo.html e parametros), o twitter nao conta como caracteres
		var caracteresPermitidos = 139 - caracteresDesconsiderar.length; //140 twitter menos um espaco (entre a desc e a url), menos a url da pagina

		if(desc.length > caracteresPermitidos-4){ //se a descricao for maior que o total permitido (mais uma margem de seguranca por causa da reticencias e do espaco inserido entre a descricao e a url ao final do codigo)
			console.log(desc.length + " / " + caracteresPermitidos);
			desc = desc.substr(0,caracteresPermitidos-4) + "...";
		}
		
		urlSend = urlEncode;
		
		//Evento GA
		if($.isFunction(window.trackAction)) trackAction("link", "Compartilhamento", "Twitter", "click", urlGet);
		
		//Abrir twitter
		//window.open("http://twitter.com/home?status=" + desc + " " + urlSend,"Twitter","width=640,height=300");
		//location.href = "http://twitter.com/home?status=" + desc + " " + urlSend;
		location.href = "http://twitter.com/share?text="+desc+"&url="+urlSend;/*+"&hashtags=#ALMG,#Assembleia"*/
	}
}


//Postar para facebook
/* BACKUP ApiFB
//Necessario para facebook dialog. PS: Arquivo include no inc_header: http://connect.facebook.net/pt_BR/all.js
FB.init({
	appId: FBappID,
	status: true,
	cookie: true,
});
*/
function postToFacebook(url,img,name,title,desc) {
	var url=url; var img=img; var name=name; var title=title; var desc=desc; //'url' é o link; 'imagem' é o thumb; 'name' é a manchete da publicacao; 'title' é uma especie de subtitulo (pode ficar vazio); desc é a descricao da publicacao 

	//Tratamento name
	if(name==undefined || name==""){ //se name estiver vazia, pegamos...
		name = document.title;
	}
	
	//Tratamento desc
	if(desc==undefined || desc==""){ //se desc estiver vazia, pegamos...
		if($("meta[name=description]").attr("content")!="" && $("meta[name=description]").attr("content")!=undefined){
			desc = $('meta[name=description]').attr("content");
		}else{
			desc = document.title;
		}
	}
	if(desc.indexOf("#")!=-1) desc=desc.replace(/#/gm,""); //Remover caracteres indesejados
	
	//Tratamento img 0/5 - Se tiver parametro (Ex: http://www.almg.gov.br/sala_imprensa/fotos/index.html?idAlb=3861&albPos=5)
	
	//Tratamento img 1/5 - Sem parametro, parametro vazio
	if (img==undefined || img=="") { //Se nao tiver o parametro
	
		//Tratamento img 2/5 - Sem parametro, mas com imagem de compartilhamento no header (Ex: http://www.almg.gov.br/acompanhe/noticias/arquivos/2014/05/27_avaliacao_icms_solidario.html)
		if($("link[rel=image_src]").length!=0 && $("link[rel=image_src]").attr("href").indexOf("logo_default_16-9.png")==-1){ //Pegamos o "link[rel]" (tb poderia ser "og:image"), desde que nao seja a imagem da marca-padrao da ALMG
			img = $("link[rel=image_src]:eq(0)").attr("href");

		//Tratamento img 3/5 - Sem parametro e nem imagem de compartilhamento no header (imagem default ALMG)
		}else{
			//Se for noticias, mas nao a index
			if (urlPagina=="noticias" && f_urlAll().toString().indexOf("index")==-1 && $(".almg-js_notTexto").find("img:eq(0)").length!=0) {
				img = $(".almg-js_notTexto").find("img:eq(0)").attr("src");
			
			//default
			}else{
				img = f_urlProtocol()+"//"+f_urlAmbiente()+"/biblioteca-almg/logo_default_16-9.png"; //Deve ser absoluto para o FB capturar
			}
		}
	}

	// A partir desse momento, a variavel img deve ter algum valor, seja via parametro, header ou imagem-default

	//Tratamento img 4/5 - Se imagem for do media server (Ex: http://www.almg.gov.br/acompanhe/noticias/arquivos/2012/10/18_release_ppag_araxa.html)
	if(img.indexOf("mediaserver")!=-1){ //Retirar dominio (http://www.almg.gov.br/system/modules/br.gov.almg.site.portal/elements/imagem.jpg?url=)
		img = img.replace(f_urlProtocol()+"//"+f_urlAmbiente()+"/system/modules/br.gov.almg.site.portal/elements/imagem.jpg?url=","").replace("/system/modules/br.gov.almg.site.portal/elements/imagem.jpg?url=",""); //Ora vem absoluta, ora vem relativa
	}

	//Tratamento img 5/5 - Se imagem chegou ate aqui com caminho relativo
	if(img.indexOf("https://")==-1 && img.indexOf("http://")==-1){
		img = f_urlProtocol()+"//"+f_urlAmbiente() + img;
	}

	//Tratamento url
	if(url==undefined || url==""){ //deve ficar dentro da funcao, para pegar url dinamica a cada onclick
		var urlGet = f_urlAll().toString();
	}else{
		var urlGet = url;
	}
	if(link_type(urlGet)=="relative") urlGet=f_urlProtocol()+"//"+f_urlAmbiente()+urlGet;

	//Desconsiderar parametros de campanha:
	urlGet = removeParamsCampanha(urlGet);
	
	//Inserir parametros de campanha
	if(urlGet.indexOf("?")==-1 && urlGet.indexOf("%3F")==-1) { //para verificar se existe interrogacao
		var urlLong = urlGet + "%3Futm_source=Facebook%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
	}else{
		var urlLong = urlGet + "%26utm_source=Facebook%26utm_medium=Btn-Compartilhar%26utm_campaign=Compartilhar";
	}
	
	/* BACKUP ApiFB
	//Abrir dialogo
	var obj = {
		method: 'feed',
		link: urlLong,
		picture: img,
		name: name,
		caption: title,
		description: desc,
	};
	function callback(response) {
		//alert(response['post_id']);
	}
	FB.ui(obj, callback);
	*/
	
	//Tratar parametros //escape()
	//urlEncode = encodeURIComponent(urlLong);
	urlEncode = urlLong.replaceAll("?","%3F").replaceAll("&","%26").replaceAll(":","%3A").replaceAll("/","%2F").replaceAll("=","%3D").replaceAll(" ","+").replace(/\+\++/g,"+");
	imgEncode = encodeURIComponent(img);
	nameEncode = encodeURI(name);
	titleEncode = encodeURI(title);
	descEncode = encodeURI(desc);
	
	//Evento GA
	if($.isFunction(window.trackAction)) trackAction("link", "Compartilhamento", "Facebook", "click", urlGet);

	//Abrir dialogo
	//window.open(f_urlProtocol()+"//www.facebook.com/dialog/feed?app_id="+FBappID+"&link="+urlEncode+"&picture="+imgEncode+"&name="+nameEncode+"&caption="+titleEncode+"&description="+descEncode+"&redirect_uri="+urlEncode,"Facebook","width=981,height=505");
	location.href=f_urlProtocol()+"//www.facebook.com/dialog/feed?app_id="+FBappID+"&link="+urlEncode+"&picture="+imgEncode+"&name="+nameEncode+"&caption="+titleEncode+"&description="+descEncode+"&redirect_uri="+urlEncode;
	
	/*Exemplo externo:
	https://www.facebook.com/dialog/feed
	?app_id=458358780877780
	&link=https://developers.facebook.com/docs/reference/dialogs/
	&picture=http://fbrell.com/f8.jpg
	&name=Facebook%20Dialogs
	&caption=Reference%20Documentation
	&description=Using%20Dialogs%20to%20interact%20with%20users.
	&redirect_uri=https://mighty-lowlands-6381.herokuapp.com/*/

	/*Exemplo ALMG
	https://www.facebook.com/dialog/feed
	?app_id='+FBappID+'
	&link=http://www.almg.gov.br/acompanhe/noticias/arquivos/2013/01/18_orquestra_sinfonica_declarada_patrimonio_historico.html
	&picture=http://www.almg.gov.br/biblioteca/imagens/logo_facebook.png
	&name=Estado%20apresenta%20avan%C3%A7os%20na%20%C3%A1rea%20de%20Defesa%20Social%20do%20PPAG
	&caption=
	&description=Representantes%20do%20Governo%20detalharam%20projetos%20estruturadores,%20na%20reuni%C3%A3o%20de%20monitoramento%20realizada%20nesta%20ter%C3%A7a%20%2828%29.
	&redirect_uri=http://www.almg.gov.br/acompanhe/noticias/arquivos/2013/01/18_orquestra_sinfonica_declarada_patrimonio_historico.html*/
}


//Compartilhar Calendar
function postToCalendar(obj){
	//Se ainda nao é um objeto, passamos a string para objeto
	if(!obj.jquery) obj = eval('(' + obj + ')');
	
	//Tipos de calendario
	var type = "";
	if(os_name().indexOf("ios")!=-1/* || os_name()=="macos"*/) type="ical"; //Sistemas Apple (iOS ou MacOS) abre iCalendar (ics)
	else if(!is_mobile() || os_name()=="android") type="gcal_desk"; //Desktop abre a URL versão desktop do Google Calendar. Android interpreta a mesma URL para abrir o App nativo do Google Calendar
	else type="gcal_mobi"; //Demais sistemas (o que sobrou: não-desktop, não-android, não-ios, não-macos) abrem a URL do Google Calendar, versão mobile	
	
	//Iniciar montagem do output por dispositivo
	var outPut = "";
	if(type=="ical") outPut = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//almg.gov.br//NONSGML v1.0//EN"; //outPut = "https://www.almg.gov.br/system/modules/br.gov.almg.site.commons/elements/share/calendar/icalendar.ics?action=TEMPLATE";
	else if(type=="gcal_desk") outPut = "https://www.google.com/calendar/render?action=TEMPLATE&sf=true&output=xml";
	else if(type=="gcal_mobi") outPut = "https://www.google.com/calendar/gp#~calendar:view=e&bm=1&action=TEMPLATE&trp=false";
	
	//Tratamento url da página compartilhada no cal
	if(obj.link==undefined || obj.link=="" || obj.link==null){
		var urlGet = f_urlAll().toString();
	}else{
		var urlGet = obj.link;
	}
	if(link_type(urlGet)=="relative") urlGet=f_urlProtocol()+"//"+f_urlAmbiente()+urlGet;

	//Encode URL
	//var urlEncode = encodeURIComponent(urlGet);
	var urlEncode = urlGet.replaceAll("?","%3F").replaceAll("&","%26").replaceAll(":","%3A").replaceAll("/","%2F").replaceAll("=","%3D").replaceAll(" ","+").replace(/\+\++/g,"+");
	
	//Tratamento de outros parametros
	var _gmt_ = "America/Sao_Paulo";
	var _desc_ = obj.desc;
	if(replaceAllSpaces(_desc_)=="") _desc_ = "Mais informações:";
	var _local_ = obj.local.replace(/<br[^>]*>/gi,""); // /<br(| \/)>/gi
	
	//Adicionar parâmetros gcal:
	if(type=="gcal_desk" || type=="gcal_mobi"){
		outPut += "&text=" + obj.titulo;
		outPut += "&dates=" + obj.date_start +"/"+ obj.date_end;
		outPut += "&details=" + _desc_ +" "+ urlEncode;
		outPut += "&location=" + _local_;
		outPut += "&ctz=" + _gmt_;
	
	//Adicionar parâmetros ical:
	}else if(type=="ical"){
		outPut += "\nBEGIN:VTIMEZONE";
		outPut += "\nTZID:" + _gmt_;
		outPut += "\nTZURL:http://tzurl.org/zoneinfo-outlook/" + _gmt_;
		outPut += "\nX-LIC-LOCATION:" + _gmt_;
		outPut += "\nBEGIN:DAYLIGHT";
		outPut += "\nTZOFFSETFROM:-0300";
		outPut += "\nTZOFFSETTO:-0200";
		outPut += "\nTZNAME:BRST";
		outPut += "\nDTSTART:19701018T000000";
		outPut += "\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=3SU";
		outPut += "\nEND:DAYLIGHT";
		outPut += "\nBEGIN:STANDARD";
		outPut += "\nTZOFFSETFROM:-0300";
		outPut += "\nTZOFFSETTO:-0300";
		outPut += "\nTZNAME:BRT";
		outPut += "\nDTSTART:19700215T000000";
		outPut += "\nRRULE:FREQ=YEARLY;BYMONTH=2;BYDAY=3SU";
		outPut += "\nEND:STANDARD";
		outPut += "\nEND:VTIMEZONE";
		
		var _mail_ = "assessoria.imprensa@almg.gov.br";
		var _date_ = new Date(); var year = _date_.getUTCFullYear(); var month = _date_.getUTCMonth()+1; if(month<10) month="0"+month; var day = _date_.getUTCDate(); if(day<10) day="0"+day; var hour = _date_.getHours(); if(hour<10) hour="0"+hour; var minutes = _date_.getMinutes(); if(minutes<10) minutes="0"+minutes;
		var _stamp_ = year+""+month+""+day+"T"+hour+""+minutes+"00z";

		outPut += "\nBEGIN:VEVENT";
		outPut += "\nUID:" + _mail_;
		outPut += "\nDTSTAMP:" + _stamp_;
		outPut += "\nATTENDEE;CN=ALMG;RSVP=TRUE:MAILTO:" + _mail_
		outPut += "\nORGANIZER;CN=Assembleia de Minas Gerais:MAILTO:" + _mail_;
		outPut += "\nSUMMARY:" + obj.titulo;
		outPut += "\nDESCRIPTION:" + _desc_ +" "+ urlGet;
		outPut += "\nDTSTART:" + obj.date_start;
		outPut += "\nDTEND:" + obj.date_end;
		outPut += "\nLOCATION:" + _local_
		outPut += "\nEND:VEVENT";
		outPut += "\nEND:VCALENDAR";
		
		//Url para abrir
		outPut = "data:text/calendar;charset=utf8," + escape(outPut);
	}else{
		alert("Não há calendário para o evento");
		return false;
	}
	
	//Evento GA
	if($.isFunction(window.trackAction)) trackAction("link", "Compartilhamento", "Calendar", "click", urlGet);
	
	//Abrir link
	//location.href = outPut;
	window.open(outPut);
}


//Compartilhar por email
function postToEmail(title,desc,url){
	var metodo = "2"; //1: Envio por JSP (via codigo-fonte), 2: Envio JS
	
	if(metodo==1){
		var objForm = $(el).find(".almg-js_shareMail");
		if(!objForm.hasClass("almg-js_shareMailDONE")){ //Se nao passou pelo 'ready' (qndo o compartilhamento é incluido via ajax), entao, tem que passar
			shareMailReady(objForm);
		}
	}
	
	//Tratamento url
	var urlGet = "";
	if(metodo==1){
		urlGet = $(el).find("input[name=sharingMail_url]").val();
	}else{
		urlGet = url;
		if(urlGet==undefined || urlGet==""){ //se title estiver vazia, pegamos...
			urlGet = f_urlAll().toString();
		}
	}
	if(link_type(urlGet)=="relative") urlGet=f_urlProtocol()+"//"+f_urlAmbiente()+urlGet;
	
	//Desconsiderar parametros de campanha:
	urlGet = removeParamsCampanha(urlGet);
	
	//Inserir parametros de campanha
	var urlGetCampanha = "";
	if(urlGet.indexOf("?")==-1 && urlGet.indexOf("%3F")==-1) { //para verificar se existe interrogacao
		urlGetCampanha = urlGet + "%3Futm_source=CompartilhamentoPorEmail%26utm_medium=email%26utm_campaign=Compartilhar";
	}else{
		urlGetCampanha = urlGet + "%26utm_source=CompartilhamentoPorEmail%26utm_medium=email%26utm_campaign=Compartilhar";
	}
	
	//Encode URL
	//var urlEncode = encodeURIComponent(urlGetCampanha);
	var urlEncode = urlGetCampanha.replaceAll("?","%3F").replaceAll("&","%26").replaceAll(":","%3A").replaceAll("/","%2F").replaceAll("=","%3D").replaceAll(" ","+").replace(/\+\++/g,"+");
	
	//Evento GA
	if($.isFunction(window.trackAction)) trackAction("link", "Compartilhamento", "Email", "click", urlGet);
	
	if(metodo==1){
		//Abrir modal
		$("#myModal").modal("show");
	}else{
		//Tratamento title
		if(desc==undefined || desc==""){ //se title estiver vazia, pegamos...
			title = document.title;
		}
		
		//Tratamento desc
		if(desc==undefined || desc==""){ //se desc estiver vazia, pegamos...
			desc = $('meta[name=description]').attr("content");
		}

		//Dados do Usuario
		let prompt_mail = prompt("Para qual e-mail você deseja compartilhar?", "nome@email.com");
		if(prompt_mail != null && prompt_mail != ""){
			window.open('mailto:'+prompt_mail+'?subject=ALMG: '+title+'&body='+desc+'%0D%0A%0D%0AVeja:%0D%0A'+urlEncode+'%0D%0A');
		}else{
			alert("Compartilhamento cancelado");
		} 
	}
}
function shareMailReady(obj){
	//Tratamento url
	var urlGet = "";
	if(obj.find("input[name=sharingMail_url]").val()==""){ //Se a url estiver vazia
		urlGet = f_urlAll().toString();
	}else{
		urlGet = obj.find("input[name=sharingMail_url]").val();
	}
	if(link_type(urlGet)=="relative") urlGet=f_urlProtocol()+"//"+f_urlAmbiente()+urlGet;
	
	//Desconsiderar parametros de campanha:
	urlGet = removeParamsCampanha(urlGet);

	//Inserir parametros de campanha
	var urlGetCampanha = "";
	if(urlGet.indexOf("?")==-1 && urlGet.indexOf("%3F")==-1) { //para verificar se existe interrogacao
		urlGetCampanha = urlGet + "%3Futm_source=CompartilhamentoPorEmail%26utm_medium=email%26utm_campaign=Compartilhar";
	}else{
		urlGetCampanha = urlGet + "%26utm_source=CompartilhamentoPorEmail%26utm_medium=email%26utm_campaign=Compartilhar";
	}
	
	//Passar valores (action)
	//obj.attr("action",urlGet); //URL compartilhada
	obj.attr("action",f_urlAll().toString());//URL de onde o usuário compartilha (recomendado)
	
	//Url de compartilamento
	obj.find("input[name=sharingMail_url]").val(urlGetCampanha);

	//Tratamento titulo
	if(obj.find("input[name=sharingMail_titulo]").val()==""){ //Se o title estiver vazio, pegamos o title
		obj.find("input[name=sharingMail_titulo]").val(document.title);
	}
	
	//Identificar itens (para identificar aqueles que não passaram por pelo ready (que foram chamados via ajax)
	obj.addClass("almg-js_shareMailDONE");
}
$(".almg-js_shareMail:last-child").ready( function() { //Nao será acionado em include do compartilhamento via ajax
	$(".almg-js_shareMail").each(function(idx, item) {
		shareMailReady($(item));
	});
});


//Abrir/Fechar share do tipo drop-box
function toggleDrpShare(obj,_t_){
	if(_t_=="hide"){
		obj.parent().next().fadeOut(150);
		obj.removeClass("active");
		obj.find("i:eq(0)").removeClass("d-none");
		obj.find("i:eq(1)").addClass("d-none");
	}else if(_t_=="show"){
		obj.parent().next().fadeIn(150);
		obj.addClass("active");
		obj.find("i:eq(0)").addClass("d-none");
		obj.find("i:eq(1)").removeClass("d-none");
		
	}
}
function clickDrpShare(obj){
	//Esconder todos os itens
	obj.addClass("running");
	var obj_all = $(".almg-css_shareItemBT .almg-css_shareItemTag").not(".running");
	toggleDrpShare(obj_all,"hide");
	obj.removeClass("running");
	
	//Toggle item solicitado
	if(obj.hasClass("active")){
		toggleDrpShare(obj,"hide");
	}else{
		toggleDrpShare(obj,"show");
	}
}


//Position Fixed para o share interno
var elFixed = "almg-js_shareFixed"; //both|always
var elFixedAlways = "almg-js_shareFixedAlways";
function showCloneShare(tipo,animado){
	if(tipo==undefined) tipo="init";
	if(animado==undefined) animado=true;
	if($("."+elFixed+"_clone").length==0){
		$("."+elFixed+"_clone").remove();
		$("."+elFixed).clone(true).prependTo("body").addClass(elFixed+"_clone").removeClass(elFixed).css("position","fixed").css("z-index","1").css("width","100%").css("background-color","#f1f1f1").css("padding","0.2rem 1rem 0.3rem 1rem");//.css("border-top","1px solid #ccc");

		if(!$("."+elFixed+"_clone").hasClass(elFixed+"_clone_is_sliding")){
			if(tipo=="init" || !animado){ //Direto, sem animacao
				$("."+elFixed+"_clone").css("bottom","0");
			}else{ //Com animacao
				$("."+elFixed+"_clone").addClass(elFixed+"_clone_is_sliding").css("bottom",-$("."+elFixed+"_clone").outerHeight());
				$("."+elFixed+"_clone").stop().animate({bottom:0}, 600, "easeOutExpo", function() {
					$("."+elFixed+"_clone").removeClass(elFixed+"_clone_is_sliding");
				});
			}
		}
	}
}
function hideCloneShare(animado){
	if(animado==undefined) animado=true;
	if(!$("."+elFixed+"_clone").hasClass(elFixed+"_clone_is_sliding")){
		if(animado){
			$("."+elFixed+"_clone").addClass(elFixed+"_clone_is_sliding").stop().animate({bottom:-$("."+elFixed+"_clone").outerHeight()}, 300, "easeOutExpo", function() { 
				$("."+elFixed+"_clone").removeClass(elFixed+"_clone_is_sliding").remove();
			});
		}else{
			$("."+elFixed+"_clone").css("bottom",-$("."+elFixed+"_clone").outerHeight());
		}
	}
}
function cloneFixed(){
	$("."+elFixed+"_clone").css("position","fixed").css("top","auto").css("bottom",0);
}
function cloneAbsolute(){
	$("."+elFixed+"_clone").css("position","absolute").css("top","auto").css("bottom", $("footer").outerHeight());
}
function shareScroll(tipo){
	if(tipo==undefined) tipo="init";
	if($("."+elFixed).length!=0){
		//console.log( ($(window).scrollTop() + f_clientHeight("all")) +" / "+ ($("html").outerHeight() - $("footer").outerHeight()) )
		if($("."+elFixed).hasClass(elFixedAlways) || $(window).scrollTop() > $("."+elFixed).offset().top + $("."+elFixed).outerHeight()){
			showCloneShare(tipo,false);
			
			//Fixed
			if($(window).scrollTop()+f_clientHeight("all") < f_documentHeight() - $("footer").outerHeight()){ //console.log( $(window).scrollTop() +"+"+  f_clientHeight("all") +"<"+ f_documentHeight() +"-"+ $("footer").outerHeight());
				if(!$("."+elFixed+"_clone").hasClass(elFixed+"_clone_is_sliding")) cloneFixed();
			
			//Absolute
			}else{
				cloneAbsolute();
			}
		}else{
			hideCloneShare(false);
		}
	}
}

function shareMoveModalZindex(){
	//Mover os modais de compartilhamento por email, qndo necessario
	if($(".almg-js_moveModalShare").length>0){
		$(".almg-js_moveModalShare").not(".almg-js_moveModalShare_isdone").each(function(idx, item) {
			if(
				$(item).parents(".almg-js_filtroAbaLista").length>0 || //Qndo estiverem dentro do filtro (filtro.js), pois a manipulacao do filtro interfere no modal, fazendo com que eles percam a funcionalidade de submissao (ex: share drop na home)
				$(item).parents(".almg-css_share").length>0 //Qndo tiver dentro de outra barra de share, ou seja, um share dentro de outro. Nesse caso, o modal ficaria 'preso' no z-index, caso nao seja retirado (ex: share drop no chat de comissões interativas)
			){
				jQuery(item).detach().appendTo("body");
				$(item).addClass("almg-js_moveModalShare_isdone");
				//Ajustando click em radio buttons e checkbox
				$(item).find(".custom-radio,.custom-checkbox").find(".custom-control-label").each(function(idx2, item2) {
					$(item2).attr("onclick","$(this).prev('input').prop('checked',true);");
				});
				ready_form("ajax");
			}
		});
	}
}

//$("."+elFixed).ready(function(){
$(document).ready(function(){
	if($("."+elFixed).length!=0){
		$("footer").removeClass("mt-2").addClass("mt-4_5");

		$(document).scroll(function(event) {
			shareScroll("scroll");
		});
		
		if($("."+elFixed).hasClass(elFixedAlways)){
			//showCloneShare("init",false);
			$("."+elFixed).hide();
		}
	}
	
	shareMoveModalZindex();
});