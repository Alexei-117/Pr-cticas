//Cosas por hacer
/*
	- Corregir fallos en el diseño
	- Corregir que sale el login y no el nombre del usuario
	- Acabar la parte de julian de nueva entrada
	- Escribir el acerca
*/


//Variable que muestra la pagina actual
var actualPage = 0;

//Funciones generales de apoyo, como cargar página
function loadPag(pag,num,obj){
	//La pagina actual pasa a ser la solicitada
	actualPage=pag;
	
	//inicializando texto base, url de la petición y la petición XML
	let xhr = new XMLHttpRequest(),
		url = "./rest/entrada/?u=6&?pag="+pag+"&lpag="+num,
		finalText = "<h2>Lo sentimos, no se ha podido atender la petici&oacute;n en este momento.</h2>";
	
	//Enviar petición GET
	xhr.open('GET',url,true);
	xhr.send();
	xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					//Parsear los datos JSON recibidos
					let datosJSON = JSON.parse(xhr.responseText);
					let i = 0;
					
					//Vaciar el texto que irá en la sección
					finalText = "";
					
					//guardar el mensaje formateado
					for( i = 0; i<datosJSON["TOTAL_COINCIDENCIAS"]; i++){
						finalText += 
						"<article>"+
							"<img src=img/"+datosJSON["FILAS"][i]["fichero"]+" alt="+datosJSON["FILAS"][i]["nombre"]+" >"+
							"<p>"+datosJSON["FILAS"][i]["descripcion_foto"]+
								"<a href='entrada.html?id="+datosJSON["FILAS"][i]["id"]+"'>Ver m&aacute;s </a>"+
							"</p>"+
								
							"<a href='entrada.html?id="+datosJSON["FILAS"][i]["id"]+"'>"+datosJSON["FILAS"][i]["nombre"]+"</a>"+
							"<address>"+datosJSON["FILAS"][i]["login"]+"</address>"+
							"<footer>"+
								"<time datetime='"+datosJSON["FILAS"][i]["fecha"]+"'>Fecha <br> "+datosJSON["FILAS"][i]["fecha"]+"</time>"+	
								"<p>Fotos<br>"+datosJSON["FILAS"][i]["nfotos"]+"</p>"+
								"<p>Comentarios <br> "+datosJSON["FILAS"][i]["ncomentarios"]+"</p>"+
							"</footer>"+
						"</article>";
					}
					
					document.getElementById(obj).innerHTML = finalText;
				}else{
					//Mostrar el mensaje de error y por consola lo sucedido en caso de no realizarse la petición
					document.getElementById(obj).innerHTML = finalText;
					console.log("ERROR: "+xhr.responseText);
				}
			}
	}
	return false;
	
};

//Funciones onload de la página
function loadGallery(){
	loadPag(actualPage,6,"indexLastImages");
	return false;
};

function loadLast10Comments(){
		
	let xhr = new XMLHttpRequest(),
		url = "./rest/comentario/?u=10",
		finalTextComments = "<h2>Lo sentimos, no hay &uacute;ltimos comentarios en este momento.</h2>";
		
	xhr.open('GET',url,true);
	xhr.send();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				let datosJSON = JSON.parse(xhr.responseText);
				let i = 0;
				console.log(xhr.responseText);
				finalTextComments = "<h2>&Uacute;ltimos comentarios</h2>";
				for( i = 0; i<datosJSON["FILAS"].length; i++){
					finalTextComments +=
					"<article>"+
						"<header>"+
							"<a href='entrada.html?id="+datosJSON["FILAS"][i]["id_entrada"]+
								"'>"+datosJSON["FILAS"][i]["nombre_entrada"]+"</a>"+
								"<h4>"+datosJSON["FILAS"][i]["titulo"]+"</h4>"+
							"<p>"+datosJSON["FILAS"][i]["texto"]+"</p>"+
						"</header>"+
						"<footer>"+
							"<time datetime='"+datosJSON["FILAS"][i]["fecha"]+"'>Fecha <br> "+datosJSON["FILAS"][i]["fecha"]+"</time>"+
							"<address>Autor <br>"+datosJSON["FILAS"][i]["login"]+"</address>"+
						"</footer>"+
					"</article>";
					document.getElementById("indexLastComments").innerHTML = finalTextComments;
				}
				
				
			}else{
				document.getElementById("indexLastComments").innerHTML = finalTextComments;
				onsole.log("ERROR: "+xhr.responseText);
			}
		}
	}
	return false;
};

function loadPaginationIndex(){
	let bar =  document.querySelector("nav[class=pag]");
	let postperpag = 6;
	//Conseguir el dia de mañana
	let tomorrow = new Date(new Date().getDate() +1);
	let dd = tomorrow.getDate();
	let mm = tomorrow.getMonth()+1; //January is 0!

	let yyyy = tomorrow.getFullYear();
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	tomorrow = yyyy+"-"+mm+"-"+dd;
	
	//Para poner pedir la última página
	let xhr = new XMLHttpRequest(),
		url = "./rest/entrada/?ff="+tomorrow,
		totalPosts = 0;
	
	
	
	xhr.open('GET',url,true);
	xhr.send();
	
	xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					let datosJSON = JSON.parse(xhr.responseText);
					totalPosts = datosJSON["FILAS"].length;
					console.log(xhr.responseText);
				}else{
					console.log("ERROR: "+xhr.responseText);
				}
			}
	}
	totalPags = Math.ceil(totalPosts / postperpag);
	
	if(actualPage == 0){
		bar.innerHTML = 
		"<ul>"+
			"<li onclick='loadPag(0,postperpag,'indexLastImages')'>Actual (1)</li>"+
			"<li onclick='loadPag(1,postperpag,'indexLastImages')'>2</li>"+
			"<li onclick='loadPag(2,postperpag,'indexLastImages')'>3</li>"+
			"<li onclick='loadPag("+(totalPags-1)+",postperpag,'indexLastImages')'>&Uacute;ltima</li>"+
			"<li onclick='loadPag("+(actualPage+1)+",postperpag,'indexLastImages')'>Next</li>"+
		"</ul>";
	}else{
		if(actualPage == totalpags){
			bar.innerHTML = 
			"<ul>"+
				"<li onclick='loadPag("+(actualPage-1)+",postperpag,'indexLastImages')'>Anterior</li>"+
				"<li onclick='loadPag(0,postperpag,'indexLastImages')'>Primera</li>"+
				"<li onclick='loadPag("+(totalPags-3)+",postperpag,'indexLastImages')'>"+(totalPags-2)+"</li>"+
				"<li onclick='loadPag("+(totalPags-2)+",postperpag,'indexLastImages')'>"+(totalPags-1)+"</li>"+
				"<li onclick='loadPag("+(totalPags-1)+",postperpag,'indexLastImages')'> Actual ("+totalPags+")</li>"+
			"</ul>";
		}else{
			bar.innerHTML = 
			"<ul>"+
				"<li onclick='loadPag("+(actualPage-1)+",postperpag,'indexLastImages')'>Anterior</li>"+
				"<li onclick='loadPag(0,postperpag,'indexLastImages')'>Primera</li>"+
				"<li onclick='loadPag("+(actualPage)+",postperpag,'indexLastImages')'>Actual ("+(actualPage+1)+")</li>"+
				"<li onclick='loadPag("+(totalPags-1)+",postperpag,'indexLastImages')'>&Uacute;ltima</li>"+
				"<li onclick='loadPag("+(actualPage+1)+",postperpag,'indexLastImages')'>Next</li>"+
			"</ul>";
		}
	}
	return false;
};
/* Funciones que se hacen automáticamente*/
function setFooterTime(){
	let setting =  document.querySelector("footer>nav>ul>li>time");
	//Conseguir el dia de mañana
	let day = new Date();
	let dd = day.getDate();
	let mm = day.getMonth()+1; //January is 0!

	let yyyy = day.getFullYear();
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	day = yyyy+"-"+mm+"-"+dd;
	
	setting.setAttribute("datetime",day );
	setting.innerHTML ="&copy; "+ yyyy;
}

function comprobarLogin(){
	if(sessionStorage.getItem('status')){
		return true;
	}
	else{
		
		return false;
	}
}

function loadIndex(){
	loadGallery();
	loadLast10Comments();
	loadPaginationIndex();
	comprobarLogin();
	setFooterTime();
}