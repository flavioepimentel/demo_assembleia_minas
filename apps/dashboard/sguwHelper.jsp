 

 function usuarios_login(callbackUrl) {
 	if (typeof callbackUrl === 'undefined') {
 		callbackUrl = window.location.href;
 	}

	 //redireciona para app de usuarios
	 window.location.href = '/apps/login' + '?callbackUrl=' + encodeURIComponent(callbackUrl);
 }

 /**
 * A requisição ao endpoint de signout resulta na remoção do JWT.
 * Há, logo em seguida, um redirecionamento.
 * Neste redirecionamento, br.gov.almg.opencms.login.LoginFilter (almg-opencms.jar) é acionado e se encarrega das 
 * tarefas necessárias ao logout no OpenCMS. 
 **/
 function usuarios_logout(callbackUrl) {

 	if (typeof callbackUrl === 'undefined') {
 		callbackUrl = window.location.protocol + '//' + window.location.host;
 	}
 
	 //obtem o csrf token
	 $.ajax({ 
		 type: 'get',
		 url : '/apps/api/auth/csrf',
		 xhrFields: {
			 withCredentials: true
	 	 }
	 }).then(function (data) {
		 
		 //envia requisição de logout
		 $.ajax({ 
			 type: 'post',
			 url : '/apps/api/auth/signout',
			 xhrFields: {
				 withCredentials: true
			 },
			 data : {
				 callbackUrl : callbackUrl,
				 csrfToken : data.csrfToken,
				 json : 'true'
			 }
			 
		 }).then(function (data2) {
		 
			 let callbackUrl = data2.url;

			 //redirecionamento
		     window.location.replace(callbackUrl);
			 
		     // If url contains a hash, the browser does not reload the page. We reload manually
		     if (callbackUrl.includes('#')) {
		    	 window.location.reload();
		     }

		 });
		 
	 });
 }
 
