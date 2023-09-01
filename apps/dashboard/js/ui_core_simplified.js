if(!jQuery) alert("Please, use jQuery");
/*
var jquery_vs = jQuery.fn.jquery;
var jquery_vs_num = Number(jquery_vs.toString().replace(/\./g,"")); //Nao recomendo, pois em tese, a 2.1.4 (214) seria menor que a 1.10.0 (1100)
var jquery_vs_1 = Number(jquery_vs.split(".")[0]);
var jquery_vs_2 = Number(jquery_vs.split(".")[1]);
var jquery_vs_3 = Number(jquery_vs.split(".")[2]);
*/

/* ---------------------------------------------------------------- */
/* --- Valores absolutos da Barra de Rolagem e Viewport de Tela --- */
/* ---------------------------------------------------------------- */
//Capturar valores absolutos da scrollbar e da tela do usuário. Nos casos de valores do viewport, a largura e altura da barra de rolagem devem ser desconsideradas.

if(typeof f_topBar == 'undefined') f_topBar = 0; //Se variavel nao foi passada, estipulamos um valor default da barra fixa

function f_clientWidth() {
	return $(window).width();
}
function f_clientHeight(tipo) { //tipo: normal|all
	var retorno;
	if(tipo==undefined || tipo=="") tipo="normal";
	if(tipo=="normal"){
		retorno = $(window).height();
	}else if(tipo=="all"){
		retorno = window.innerHeight ? window.innerHeight : $(window).height(); //Modo que retorna a maior altura disponivel. Ideal para pegar vh e a barra de endereço, principalmente para iOS, onde a barra de endereço sofre toggle
	}
	return retorno;
}
function f_documentHeight() {
	return $(document).height(); //$("html").outerHeight();
}
function f_scrollLeft() {
	return $(window).scrollLeft();
}
function f_scrollTop() {
	return $(window).scrollTop();
}
function f_scrollWidth() { //Tamanho da barra de rolagem
	//Fonte: http://chris-spittles.co.uk/jquery-calculate-scrollbar-width/

	var $inner = jQuery('<div style="width: 100%; height:200px;">test</div>'),
	$outer = jQuery('<div style="width:200px;height:9999px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
	inner = $inner[0],
	outer = $outer[0];

	jQuery('body').append(outer);
	var width1 = inner.offsetWidth;
	$outer.css('overflow', 'scroll');
	var width2 = outer.clientWidth;
	$outer.remove();

	return (width1 - width2);
}


/* ------------------------------------------------------------------- */
/* --- Retornar todas as classes de um item sem determinada string --- */
/* ------------------------------------------------------------------- */
//Ex: Se o elemento tiver as classes: "bar bar1 foo bar2 foo2", a funcao removeClassWith("#item","bar") retornará: "foo foo2"
//Assim, é possivel remover todas as class de um elemento, como no exemplo abaixo
/*
$(".container").find(".my_item").each(function(idx, item) {
	var classesWithoutFoo = removeClassWith(item,"foo");
	$(item).removeClass().addClass(classesWithoutFoo);
});
*/
function removeClassWith(el,clas){
	var classes = el.className.split(" ").filter(function(c) {
		return c.lastIndexOf(clas, 0) !== 0;
	});
	//el.className = $.trim(classes.join(" "));
	return classes.join(" ");
}



/* ----------------------------------- */
/* --- Url, caminhos e partes dela --- */
/* ----------------------------------- */
var urlProtocol = "";
var urlAll = "";
var urlAllNoParam = "";
var urlAllParams = "";
var urlAllSplit = "";
var urlAmbiente = "", urlEnvironment = "";
var urlSubDominio = "", urlSubdomain = "";
var urlDominio = "", urlDomain = "";
var urlDominioNome = "", urlDomainName = "";
var urlSecao = "", urlSection = "";
var urlLocal = "";
var urlCaminho = "", urlPath = "";
var urlPagina = "", urlPage = "";
var urlPaginaNoParam = "", urlPageNoParam = "";

//Protocolo
function f_urlProtocol(){ //returns the web protocol used - http: or https:
	urlProtocol = window.location.protocol;
	return urlProtocol;
}

//Toda a URL
function f_urlAll(){ //return http(s)://(subdomain).domain.xxx(.xx)(/page.file)(?param=value) - (): if available
	urlAll = window.location.href; //document.location;
	return urlAll;
}

//URL sem parametros
function f_urlAllNoParam(){ //Like f_urlAll() without '?param=value'
	urlAllNoParam = f_urlAll().split("?")[0].split("#")[0];
	return urlAllNoParam;
}

//URL somente parametros
function f_urlAllParams(){ //Returns (param1=value1)(&param2=value2)(&param3=value3) - (): if available
	urlAllParams = f_urlAll().split("?")[1];
	if(urlAllParams==undefined) urlAllParams="";
	else urlAllParams = urlAllParams.split("#")[0];
	return urlAllParams;
}

//Split da URL
function f_urlAllSplit(){ //Just a internal shortcut
	urlAllSplit = String(f_urlAll()).split('/');
	return urlAllSplit;
}

//Ambiente
function f_urlAmbiente(){ //returns (subdomain).domain.xxx(.xx) - (): if available
	urlAmbiente = window.location.host; //location.hostname
	
	urlEnvironment = urlAmbiente; //en
	return urlAmbiente;
}
function f_urlEnvironment(){ return f_urlAmbiente(); } //en

//Incluir dominios publicos (https://raw.githubusercontent.com/wrangr/psl/master/dist/psl.min.js)
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.psl=a()}}(function(){var a;return function b(a,c,d){function e(g,h){if(!c[g]){if(!a[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};a[g][0].call(k.exports,function(b){var c=a[g][1][b];return e(c?c:b)},k,k.exports,b,a,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){b.exports=["com","com.br","br","gov.br","mg.gov.br","net","org","org.br","edu.br"];
},{}],2:[function(a,b,c){function d(a,b){return-1!==a.indexOf(b,a.length-b.length)}function e(a){var b=g.toASCII(a);return h.reduce(function(a,c){var e=g.toASCII(c.suffix);return d(b,"."+e)||b===e?c:a},null)}function f(a){var b=g.toASCII(a);if(b.length<1)return"DOMAIN_TOO_SHORT";if(b.length>255)return"DOMAIN_TOO_LONG";var c,d,e=b.split("."),f=e.length;for(d=0;f>d;d++){if(c=e[d],!c.length)return"LABEL_TOO_SHORT";if(c.length>63)return"LABEL_TOO_LONG";if("-"===c.charAt(0))return"LABEL_STARTS_WITH_DASH";if("-"===c.charAt(c.length-1))return"LABEL_ENDS_WITH_DASH";if(!/^[a-z0-9\-]+$/.test(c))return"LABEL_INVALID_CHARS"}}var g=a("punycode"),h=a("./data/rules.json").map(function(a){return{rule:a,suffix:a.replace(/^(\*\.|\!)/,""),wildcard:"*"===a.charAt(0),exception:"!"===a.charAt(0)}});c.errorCodes={DOMAIN_TOO_SHORT:"Domain name too short.",DOMAIN_TOO_LONG:"Domain name too long. It should be no more than 255 chars.",LABEL_STARTS_WITH_DASH:"Domain name label can not start with a dash.",LABEL_ENDS_WITH_DASH:"Domain name label can not end with a dash.",LABEL_TOO_LONG:"Domain name label should be at most 63 chars long.",LABEL_TOO_SHORT:"Domain name label should be at least 1 character long.",LABEL_INVALID_CHARS:"Domain name label can only contain alphanumeric characters or dashes."},c.parse=function(a){function b(){return/xn--/.test(d)?(i.domain&&(i.domain=g.toASCII(i.domain)),i.subdomain&&(i.subdomain=g.toASCII(i.subdomain)),i):i}if("string"!=typeof a)throw new TypeError("Domain name must be a string.");var d=a.slice(0).toLowerCase();"."===d.charAt(d.length-1)&&(d=d.slice(0,d.length-1));var h=f(d);if(h)return{input:a,error:{message:c.errorCodes[h],code:h}};var i={input:a,tld:null,sld:null,domain:null,subdomain:null,listed:!1},j=d.split(".");if("local"===j[j.length-1])return i;var k=e(d);if(!k)return j.length<2?i:(i.tld=j.pop(),i.sld=j.pop(),i.domain=[i.sld,i.tld].join("."),j.length&&(i.subdomain=j.pop()),b());i.listed=!0;var l=k.suffix.split("."),m=j.slice(0,j.length-l.length);return k.exception&&m.push(l.shift()),m.length?(k.wildcard&&l.unshift(m.pop()),m.length?(i.tld=l.join("."),i.sld=m.pop(),i.domain=[i.sld,i.tld].join("."),m.length&&(i.subdomain=m.join(".")),b()):b()):b()},c.get=function(a){return a?c.parse(a).domain||null:null},c.isValid=function(a){var b=c.parse(a);return Boolean(b.domain&&b.listed)}},{"./data/rules.json":1,punycode:3}],3:[function(b,c,d){(function(b){!function(e){function f(a){throw RangeError(I[a])}function g(a,b){for(var c=a.length,d=[];c--;)d[c]=b(a[c]);return d}function h(a,b){var c=a.split("@"),d="";c.length>1&&(d=c[0]+"@",a=c[1]),a=a.replace(H,".");var e=a.split("."),f=g(e,b).join(".");return d+f}function i(a){for(var b,c,d=[],e=0,f=a.length;f>e;)b=a.charCodeAt(e++),b>=55296&&56319>=b&&f>e?(c=a.charCodeAt(e++),56320==(64512&c)?d.push(((1023&b)<<10)+(1023&c)+65536):(d.push(b),e--)):d.push(b);return d}function j(a){return g(a,function(a){var b="";return a>65535&&(a-=65536,b+=L(a>>>10&1023|55296),a=56320|1023&a),b+=L(a)}).join("")}function k(a){return 10>a-48?a-22:26>a-65?a-65:26>a-97?a-97:x}function l(a,b){return a+22+75*(26>a)-((0!=b)<<5)}function m(a,b,c){var d=0;for(a=c?K(a/B):a>>1,a+=K(a/b);a>J*z>>1;d+=x)a=K(a/J);return K(d+(J+1)*a/(a+A))}function n(a){var b,c,d,e,g,h,i,l,n,o,p=[],q=a.length,r=0,s=D,t=C;for(c=a.lastIndexOf(E),0>c&&(c=0),d=0;c>d;++d)a.charCodeAt(d)>=128&&f("not-basic"),p.push(a.charCodeAt(d));for(e=c>0?c+1:0;q>e;){for(g=r,h=1,i=x;e>=q&&f("invalid-input"),l=k(a.charCodeAt(e++)),(l>=x||l>K((w-r)/h))&&f("overflow"),r+=l*h,n=t>=i?y:i>=t+z?z:i-t,!(n>l);i+=x)o=x-n,h>K(w/o)&&f("overflow"),h*=o;b=p.length+1,t=m(r-g,b,0==g),K(r/b)>w-s&&f("overflow"),s+=K(r/b),r%=b,p.splice(r++,0,s)}return j(p)}function o(a){var b,c,d,e,g,h,j,k,n,o,p,q,r,s,t,u=[];for(a=i(a),q=a.length,b=D,c=0,g=C,h=0;q>h;++h)p=a[h],128>p&&u.push(L(p));for(d=e=u.length,e&&u.push(E);q>d;){for(j=w,h=0;q>h;++h)p=a[h],p>=b&&j>p&&(j=p);for(r=d+1,j-b>K((w-c)/r)&&f("overflow"),c+=(j-b)*r,b=j,h=0;q>h;++h)if(p=a[h],b>p&&++c>w&&f("overflow"),p==b){for(k=c,n=x;o=g>=n?y:n>=g+z?z:n-g,!(o>k);n+=x)t=k-o,s=x-o,u.push(L(l(o+t%s,0))),k=K(t/s);u.push(L(l(k,0))),g=m(c,r,d==e),c=0,++d}++c,++b}return u.join("")}function p(a){return h(a,function(a){return F.test(a)?n(a.slice(4).toLowerCase()):a})}function q(a){return h(a,function(a){return G.test(a)?"xn--"+o(a):a})}var r="object"==typeof d&&d&&!d.nodeType&&d,s="object"==typeof c&&c&&!c.nodeType&&c,t="object"==typeof b&&b;(t.global===t||t.window===t||t.self===t)&&(e=t);var u,v,w=2147483647,x=36,y=1,z=26,A=38,B=700,C=72,D=128,E="-",F=/^xn--/,G=/[^\x20-\x7E]/,H=/[\x2E\u3002\uFF0E\uFF61]/g,I={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},J=x-y,K=Math.floor,L=String.fromCharCode;if(u={version:"1.3.2",ucs2:{decode:i,encode:j},decode:n,encode:o,toASCII:q,toUnicode:p},"function"==typeof a&&"object"==typeof a.amd&&a.amd)a("punycode",function(){return u});else if(r&&s)if(c.exports==r)s.exports=u;else for(v in u)u.hasOwnProperty(v)&&(r[v]=u[v]);else e.punycode=u}(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[2])(2)});


//Subdominio
function f_urlSubDominio() { //Returns just inside of the bracket: https://[subdomain].domain.xxx(.xx) - PS: Should returns 'null' for URLS like https://domain.xxx(.xx) - (): if available
    //O metodo abaixo nao funcionara se http://domain.com (sem www ou outro subdomain)
	//urlSubDominio = window.location.toString().split('.')[0].split(f_urlProtocol()+'//')[1];
	
    var parsed = psl.parse(f_urlAllSplit()[2]);
    urlSubDominio = parsed.subdomain;
	
	urlSubdomain = urlSubDominio; //en
	return urlSubDominio;
}
function f_urlSubdomain(){ return f_urlSubDominio(); } //en

//Dominio
function f_urlDominio(){ //Returns just inside of the bracket: https://subdomain.[domain.xxx(.xx)] - PS: Should works for URLS like https://[domain.xxx(.xx)] - (): if available
    //O metodo abaixo nao funcionara se http://domain.com (sem www ou outro subdomain)
    //urlDominio = f_urlAmbiente().split(".").slice(1); //.slice(1,f_urlAmbiente().split(".").length);
	//urlDominio = urlDominio.toString().replace(/,/gi, ".");
	
	var parsed = psl.parse(f_urlAllSplit()[2]);
    urlDominio = parsed.domain
	
	urlDomain = urlDominio; //en
	return urlDominio;
}
function f_urlDomain(){ return f_urlDominio(); } //en

//Nome do dominio
function f_urlDominioNome(){ //Returns just inside of the bracket: https://subdomain.[domain].xxx - PS: Should works for URLS like https://[domain].xxx
    urlDominioNome = f_urlDominio().split(".")[0];
	
	urlDomainName = urlDominioNome; //en
	return urlDominioNome;
}
function f_urlDomainName(){ return f_urlDominioNome(); } //en

//Secao
function f_urlSecao(){ //Returns just inside of the bracket: "https://subdomain.domain.xxx/[section]/page.file?param=value" or null if it doesn't exist
    urlSecao = String(f_urlAll()).split('/')[3].replace("/","");
	if(urlSecao.indexOf(".")!=-1) urlSecao = null; //Se tem ponto, significa que é arquivo, nao pasta
	
	urlSection = urlSecao; //en
	return urlSecao;
}
function f_urlSection(){ return f_urlSecao(); } //en

//Local
function f_urlLocal(){ //returns (subdomain).domain.xxx(.xx) - (): if available
	urlLocal = f_urlAmbiente()
	
	//Se a ultima posicao (pagina) é igual a 3a posicao (secao)
	//if(f_urlSecao()==f_urlPagina()) urlLocal=f_urlAmbiente();
	if(f_urlSecao()!=null) urlLocal += "/"+ f_urlSecao();
	
	return urlLocal;
}

//Caminho
function f_urlCaminho(){
	urlCaminho = window.location.pathname;
	urlPath = urlCaminho; //en
	return urlCaminho;
}
function f_urlPath(){ return f_urlCaminho(); } //en

//Pagina sem parametro (somente pagina)
function f_urlPaginaNoParam(){
	urlPaginaNoParam = f_urlCaminho().split("/").pop();
	if(urlPaginaNoParam.indexOf(".")==-1) urlPaginaNoParam="index.html";
	urlPageNoParam = urlPaginaNoParam; //en
	return urlPaginaNoParam;
}
function f_urlPageNoParam(){ return f_urlPaginaNoParam(); } //en

//Pagina completa (com parametro)
function f_urlPagina(){
	urlPagina = f_urlPaginaNoParam();
	if(f_urlAllParams()!="") urlPagina += "?" + f_urlAllParams();
	urlPage = urlPagina; //en
	return urlPagina;
}
function f_urlPage(){ return f_urlPagina(); } //en



/* -------------------- */
/* --- Tipo do link --- */
/* -------------------- */
function link_type(href){
	var retorno = "";
	var _retorno_ = "";
	if(href==undefined){
		return false;
	}else{
		if(href=="" || href=="#" || href=="javascript:;" || href.replace(";","")=="javascript:void(0)") retorno = "placebo";
		if(href.indexOf("tel:")!=-1 || href.indexOf("mailto:")!=-1 || href.indexOf("whatsapp://")!=-1 || href.indexOf("twitter://")!=-1 || href.indexOf("facetime://")!=-1 || href.indexOf("skype:skype_user")!=-1) retorno = "app";
		if(href.charAt(0)=="/" || href.charAt(0)==".") retorno = "relative";
		if(href.indexOf("http")!=-1){
			if(href.indexOf(urlAmbiente.toString())!=-1) retorno = "absolute";
			else retorno = "external";	
		}
	}
	return retorno;
}



/* ------------------------------------------- */
/* --- Funcao para pegar parametros de url --- */
/* ------------------------------------------- */

//Fonte jQuery:
//http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html

$.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});


/* Como fazer:
var allVars = $.getUrlVars();
var byName = $.getUrlVar('meuParameter');
*/

/* PS:
Use toString() para testar se a url não tem parametros: if($.getUrlVars().toString()==urlAll.toString()){}
*/



/* -------------------------------------------- */
/* --- Retornar url sem parametro informado --- */
/* -------------------------------------------- */
//Funcao que retorna url sem o parametro informado ou sem nenhum parametro (caso a funcao nao tenha assinatura)

function urlSemParametro(_param_,_url_) {
	var retorno = "";
	
	//Remover todos os parametros
	if(_param_==undefined){
		if(_url_==undefined) retorno = urlAllNoParam.toString();
		else retorno = _url_.split("?")[0];
	
	//Remover parametro especifico
	}else{
		if(_url_==undefined || _url_=="") retorno = urlAll.toString();
		else retorno = _url_.toString();
		
		//Verificar se existe _param_
		var sinal = "";
		if(retorno.indexOf("?"+_param_+"=")!=-1) sinal = "?";
		if(retorno.indexOf("&"+_param_+"=")!=-1) sinal = "&";
		if(sinal!=""){
			var paramReject = retorno.split(sinal+_param_+"=")[1] + "";
			if(paramReject.indexOf("&")!=-1){ //Se existir outros parametros na sequencia
				paramReject = paramReject.split("&")[0];
			}
			retorno = retorno.replace(sinal+_param_+"="+paramReject,"");
		}
		
		//Se restou somente um parametro (quando havia 2 e retiramos 1), garantir que o sinal seja "?" (quando o parametro retirado era o "?", restaria apenas o "&")
		var countE = retorno.split(/\&/).length-1;
		if(retorno.indexOf("?")==-1 && countE>0){
			retorno = retorno.replace("&","?");
		}
	}
	
	return retorno;
}



/* ----------------------- */
/* --- Detectar mobile --- */
/* ----------------------- */
function is_mobile(min_width) {
	if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		|| navigator.userAgent.match(/ZuneWP7/i)
	){
		return true;
	}else if(min_width!=undefined && f_clientWidth() < min_width){ //Tamanho minimo que sera considerado mobile
		return true;
	}else{
		return false;
	}
}



/* ----------------------------------------- */
/* --- Salvar/recuperar dados localmente --- */
/* ----------------------------------------- */
//Funcao para resgatar dados locais
function getLocalData(c_name,c_method) {
	var c_value = "";
	var c_log = "";
	if(c_method==undefined || c_method==null || c_method=="") c_method="cookie";
	
	if(c_name==undefined || c_name=="") {
	    console.warn("Nenhum nome fornecido para recuperação de dados locais")
	}
	
	//Cookie
	if(c_method=="cookie"){
		//document.cookie
        var i,x,y,ARRcookies=document.cookie.split(";");
        for (i=0;i<ARRcookies.length;i++) {
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x==c_name) {
				c_value = unescape(y);
				c_log = "success";
			}
        }
	
	//Local
	}else if(c_method=="local"){
		if(window.localStorage){
			c_value = localStorage.getItem(c_name);
			c_log = "success";
        }else{
			c_log="error";
		}
	
	//Invalido
	}else{
		c_log="invalid";
	}
	if(c_value==undefined || c_value==null){ //Se nao ha registro, tratamos o valor
		c_value="";
	}
	setTimeout(function(){ if($.isFunction(window.callback_getLocalData)) { callback_getLocalData(c_name,c_value,c_method,c_log); } },50); //Callback-function
	/* Exemplo completo do callback:
	function callback_getLocalData(c_name,c_value,c_method,c_log){
		if(c_log=="success") var mensagem="Dados recuperados com sucesso";
		else if(c_log=="error" || c_log=="invalid") var mensagem="Dados não puderam ser recuperados"; 
		alert(mensagem);
	}
	*/
	return c_value;
}

//Funcao para salvar localmente (recomendado para boolean e string, mas não recomendado para salvar objetos)
function saveLocalData(c_name,c_value,c_method,c_expire,c_path,c_domain){ //nome da chave; valor da chave; metodo de salvamento [cookie, local]; dias para expirar (apenas para cookie. 0=default, significa expirar na sessao); dominio da informacao (apenas para cookie. "/"=default, significa que as informacoes estarão válidas e acessiveis em toda aplicacao);
	var c_log = "";
	if(c_method==undefined || c_method==null || c_method=="") c_method="cookie";
	
	//Cookie
	if(c_method=="cookie"){
		//Data
		if(c_expire==undefined || c_expire==null || c_expire=="") c_expire=0; //0=session
		if(c_expire>0){ var exdate=new Date(); exdate.setDate(exdate.getDate()+c_expire); exdate=exdate.toUTCString(); }else{ var exdate=0; }
		
		//Dominio
		if(c_domain==undefined || c_domain==null || c_domain=="") c_domain = "."+f_urlDominio();
	
		//Path
		if(c_path==undefined || c_path==null || c_path=="") c_path="/";
	
		//Valor e propriedades (data e path)
		c_value = escape(c_value) + "; expires=" + exdate + "; domain=" + c_domain + "; path=" + c_path;
		//alert( decodeURIComponent(c_value.replace(/\+/g,  " ")) );
		c_value = decodeURIComponent(c_value.replace(/\+/g,  " "));
	
		//Set e log
        document.cookie = c_name+'='+c_value;
		c_log = "success";
    
	//Local
	}else if(c_method=="local"){
    	if(window.localStorage){
			localStorage.setItem(c_name,c_value);
			c_log = "success";
        }else{
			c_log="error";
		}
    
	//Invalido
	}else{
		c_log="invalid";
	}
	setTimeout(function(){ if($.isFunction(window.callback_saveLocalData)) { callback_saveLocalData(c_name,c_value,c_method,c_log); } },50); //Callback-function
	/* Exemplo completo do callback:
	function callback_saveLocalData(c_name,c_value,c_method,c_log){
		if(c_log=="success") var mensagem="Dados salvos com sucesso";
		else if(c_log=="error" || c_log=="invalid") var mensagem="Dados não puderam ser salvos"; 
		alert(mensagem);
	}
	*/
}

function deleteLocalData(c_name,c_method,c_domain){
	var c_log = "";
	if(getLocalData(c_name,c_method)!=""){
		if(c_method==undefined || c_method==null || c_method=="") c_method="cookie";
		
		//Dominio
		if(c_domain==undefined || c_domain==null || c_domain=="") c_domain = "."+urlDominio;
		
		//Cookie
		if(c_method=="cookie"){
			//document.cookie = c_name+"="+"";
			document.cookie = c_name+"=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=" + c_domain + "; path=/";
			c_log="success";
			
		//Local
		}else if(c_method=="local"){
			if(window.localStorage) {
				localStorage.setItem(c_name,"");
				c_log="success";
			}else{
				c_log="error";
			}

		//Invalido
		}else{
			c_log="invalid";
		}
	}
	setTimeout(function(){ if($.isFunction(window.callback_deleteLocalData)) { callback_deleteLocalData(c_name,c_method,c_log); } },50); //Callback-function
	/* Exemplo completo do callback:
	function callback_deleteLocalData(c_name,c_method,c_log){
		if(c_log==""){
			alert("Não há dados para excluir");
		}else{
			if(c_log=="success") var mensagem="Dados excluidos com sucesso";
			else if(c_log=="error" || c_log=="invalid") var mensagem="Dados não puderam ser excluidos"; 
			alert(mensagem);
		}
	}
	*/
}



/* ------------------- */
/* --- Detectar OS --- */
/* ------------------- */
function os_name(){
	var os = "unknown";

	//Desktop:
	if (navigator.appVersion.indexOf("Win")!=-1) os="windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) os="macos";
	if (navigator.appVersion.indexOf("X11")!=-1) os="unix";
	if (navigator.appVersion.indexOf("Linux")!=-1) os="linux";
	
	//Mobile:
	//if (navigator.userAgent.match(/(iPod|iPhone|iPad)/i)) os="ios";
	if (navigator.userAgent.match(/iPod/i)) os="ios_ipod";
	if (navigator.userAgent.match(/iPhone/i)) os="ios_iphone";
	if (navigator.userAgent.match(/iPad/i)) os="ios_ipad";
	if (navigator.userAgent.match(/Android/i)) os="android";
	if (navigator.userAgent.match(/BlackBerry/i)) os="blackberry";
	if (navigator.userAgent.match(/Windows Phone/i)) os="windowsphone";
	if (navigator.userAgent.match(/ZuneWP7/i)) os="zunewp7";
	if (navigator.userAgent.match(/webOS/i)) os="webos";

	return os;
}



/* -------------------------- */
/* --- Substituir espacos --- */
/* -------------------------- */
//Substituir espaços simples (substituira todo e qualquer espaco)
function replaceAllSpaces(text,substitute,type) {
	if(text==undefined) return false;

	var retorno = text;
	
	if(substitute==undefined) substitute="";
	
	if(type==undefined || type==null || type=="") type="both";
	
	if(type=="html" || type=="both") //Deve vir primeiro, especialmente se "both"
		retorno = retorno.replace(/&nbsp;/gi, substitute);
	
	if(type=="asc" || type=="both")
		retorno = retorno.replace(/ +?/g, substitute).replace(/\s/g, substitute).replace(/\s+/g, substitute).replace(/ /g, substitute);
		
	return retorno;
}

//Substituir multiplos espaços (substituira apenas espacos iguais ou maiores que 2)
function replaceAllMultipleSpaces(text,substitute,type) {
	if(text==undefined) return false;
	
	var retorno = text;
	
	if(substitute==undefined) substitute=" ";

	if(type==undefined || type==null || type=="") type="both";
	
	if(type=="html" || type=="both") //Deve vir primeiro, especialmente se "both"
		retorno = retorno.replace(/&nbsp;/gi, substitute);
	
	if(type=="asc" || type=="both")
		retorno = retorno.replace( /\s\s+/g, substitute);
		//retorno = retorno.replace(/\s{2,}/g, substitute);

	return retorno;
}


/* ----------------------------- */
/* --- Substituir breaklines --- */
/* ----------------------------- */
function replaceAllBreaklines(text) { //substituira toda e qualquer quebra de linha
	if(text==undefined) return false;
	
	var substitute=" ";
	return text.replace(/<br(|\/)>/gi, substitute).replace(/(\r\n|\n|\r)/gm, substitute);
}



/* --------------------------------- */
/* --- Pegar matches de um regex --- */
/* --------------------------------- */
function getMatches(string,regex,index) {
	if(index==undefined) index=0;
	
	if(typeof regex=="string"){
		if(regex.split("/g")[0]==undefined){
			alert("Regex sem modifier ou primeiro caractere da expressão é 'g', gerando conflito com a função"); // /foo/ ou /gfoo/gi
			return false;
		}
		var regex0 = regex.split("/g")[0].replace("/","");
		var regex1 = regex.split("/g")[1];
		regex = new RegExp(regex0, "g"+regex1);
	}
	
	var match, matches=[];
	do{
		match = regex.exec(string);
		if(match) matches.push(match[index]);
	} while(match); //console.log(matches);
	
	return matches;
}



/* -------------------------- */
/* --- Call recursividade --- */
/* -------------------------- */
var recursividadeID = 1;