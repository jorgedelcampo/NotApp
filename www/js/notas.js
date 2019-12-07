var arrayNota = [];

var app = {
	inicio: function(){
		this.iniciaFastClick();
		this.iniciaNotas();
		this.iniciaBotones();
		this.iniciaHammer();
	},
	
	iniciaFastClick: function(){
		FastClick.attach(document.body);
	},
		
	iniciaNotas: function(){
		var arrayNota = window.localStorage.getItem('arrayNota');
		var listadoNotas = document.getElementById('listadoNotas');
		listadoNotas.innerHTML = '';
		var oldNotas = [];
		if(arrayNota !== null) {
			oldNotas = JSON.parse(window.localStorage.getItem('arrayNota'));
			for(var i = 0; i < oldNotas.length; i++) {
				var ultimaNota = document.createElement('li');
				ultimaNota.className = 'item-' + i;
				ultimaNota.innerHTML = '<p id="borrar" onclick="app.borrarNota(' + i + ')">x</p><div class="item_content" id="item_content-' + i + '" onclick="app.editNota(' + i + ')"><p id="tituloNota"><b>' + oldNotas[i].tituloNota + '</b></p><p id="contenidoNota">' + oldNotas[i].contenidoNota.replace(/\n/g, "<br />"); + '</p></div>';
				listadoNotas.appendChild(ultimaNota);
			}
		}
		this.iniciaHammer();
	},
	
	iniciaHammer: function(){
		var itemLista = document.querySelectorAll('#listadoNotas li');
		for(let item of itemLista){
			var hammerTime = new Hammer(item);
			hammerTime.on('panleft panright', function(e){
				if(e.type == 'panright'){
					item.style.transform = 'translateX(20%)';
				}
				else if(e.type == 'panleft'){
					item.style.transform = 'translateX(0)';
				}
			});
		}
	},
	
	iniciaBotones: function(){
		var editarNota = document.getElementById('editarNota');
		var nuevaNota = document.getElementById('mas');
		var crearNota = document.getElementById('crearNota');
		var listadoNotas = document.getElementById('listadoNotas');
		var mas = document.getElementById('mas');
		nuevaNota.addEventListener('click', app.nuevaNota);
		crearNota.addEventListener('submit', this.guardarNota, false);
		crearNota.addEventListener('reset', this.cancelarCrearNota, false);
		editarNota.addEventListener('submit', this.editarNota, false);
		editarNota.addEventListener('reset', this.cancelarEditNota, false);
	},
	
	nuevaNota: function(){
		crearNota.innerHTML = '<input type="text" id="tituloNota" placeholder="Título" required /><textarea rows="12" id="contenidoNota" placeholder="Escribe aquí tus notas..." required></textarea><input type="submit" value="Guardar" id="guardarNota" /><input type="reset" value="Cancelar" id="cancelarNota" />';
		crearNota.style.background = '#fff';
		crearNota.style.display = 'block';
		mas.style.transform = 'translateY(200%)';
	},
	
	cancelarCrearNota: function(){
		var crearNota = document.querySelector('#crearNota');
		crearNota.style.display = '';
		mas.style.transform = 'translateY(0)';
	},
	
	guardarNota: function(e){
		e.preventDefault();
		var arrayNota = [];
		var tituloNota = document.querySelector('#crearNota #tituloNota').value;
		var contenidoNota = document.querySelector('#crearNota #contenidoNota').value;
		let nuevaNota = {'tituloNota': tituloNota, 'contenidoNota': contenidoNota};
		if(window.localStorage.getItem('arrayNota') !== null){
			arrayNota = JSON.parse(window.localStorage.getItem('arrayNota'));
			}
		arrayNota.push(nuevaNota);
		window.localStorage.setItem('arrayNota',JSON.stringify(arrayNota));
		app.cancelarCrearNota();
		app.inicio();
	},
	
	editNota: function(i){
		arrayNota = JSON.parse(window.localStorage.getItem('arrayNota'));
		editarNota.innerHTML = '<input type="text" id="tituloNota" placeholder="Título" required="" value="' + arrayNota[i].tituloNota + '" /><textarea rows="12" id="contenidoNota" placeholder="Escribe aquí tus notas..." required="" />' + arrayNota[i].contenidoNota + '</textarea><input type="submit" value="Guardar" id="guardarNota"><input type="reset" value="Cancelar" id="cancelarNota">';
		editarNota.style.display = 'block';
		mas.style.transform = 'translateY(200%)';
		listadoNotas.style.display = 'none';
		index = i;
	},
	
	cancelarEditNota: function(){
		var editarNota = document.querySelector('#editarNota');
		editarNota.style.display = '';
		//editarNota.style.transform = 'translateX(100%)';
		editarNota.style.background = 'transparent';
		mas.style.transform = 'translateY(0)';
		listadoNotas.style.display = '';
	},
	
	editarNota: function(e){
		e.preventDefault();
		editarNota.style.transform = 'scale(1)';
		editarNota.style.background = '#fff';
		mas.style.transform = 'translateY(200%)';
		var tituloNota = document.querySelector('#editarNota #tituloNota').value;
		var contenidoNota = document.querySelector('#editarNota #contenidoNota').value;
		let nuevaNota = {'tituloNota': tituloNota, 'contenidoNota': contenidoNota};
		arrayNota = JSON.parse(window.localStorage.getItem('arrayNota'));
		arrayNota.splice(index,1,nuevaNota);
		window.localStorage.setItem('arrayNota',JSON.stringify(arrayNota));
		app.cancelarEditNota();
		app.inicio();
	},
	
	borrarNota: function(i){
		var thisList = document.querySelectorAll('#listadoNotas li')[i];
		arrayNota = JSON.parse(window.localStorage.getItem('arrayNota'));
		var msg = document.getElementById('msg');
		msg.innerHTML = '<form id="confirmarBorrar"><p>¿Realmente deseas eliminar esto?</p><input type="submit" value="Sí" /><input type="reset" value="No" /></form>';
		msg.style.zIndex = '999';
		msg.style.opacity = '1';
		msg.querySelector('form').style.transform = 'scale(1)';
		document.getElementById('confirmarBorrar').addEventListener('submit', function(e){
			e.preventDefault();
			msg.innerHTML = '<p id="loading"></p>';
			var offHeight = thisList.offsetHeight;
			thisList.style.transform = 'translateX(-100%)';
			thisList.style.opacity = '0';
			thisList.style.margin = '0';
			if(thisList.nextElementSibling){
				thisList.nextElementSibling.style.marginTop = offHeight * -1 + 'px';
			}			
		arrayNota.splice(i,1);
		window.localStorage.setItem('arrayNota',JSON.stringify(arrayNota));
		setTimeout(function(){
			app.inicio();
			msg.style.opacity = '0';
			msg.style.zIndex = '-9999';
			msg.innerHTML = '';
			}, 500);
		});
	document.getElementById('confirmarBorrar').addEventListener('reset', function(){
		msg.style.opacity = '0';
		msg.querySelector('form').style.transform = 'scale(0)';
		thisList.style.transform = 'translateX(0)';
		setTimeout(function(){
			app.inicio();
			msg.style.zIndex = '-9999';
			msg.innerHTML = '';
			}, 500);
		});
	},
		
}

if('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function(){
		app.inicio();
		}, false);
}