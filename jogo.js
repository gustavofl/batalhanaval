
var tamanho_tabuleiro = 10;
var tamanho_casas_px = 30;
var lista_jogadas = []

var lista_navios_jogador = []
var lista_navios_ia = []

var lista_tam_navios = []

// procurar no cookie os navios adicionados pelo usuario
analizar_cookie()

// enquanto nao implementar a ia para posicionar os navios: copiar a lista de navios do jogador para lista de navios da ia
lista_navios_jogador.forEach(function(navio, indice){
	lista_navios_ia.push(new Navio(navio.tamanho, navio.coordenadas, navio.orientacao))
})

// mostra os cookies do navegador no console
// (para ver o console aperte F12 no navegador e clique na aba console)
console.log("BATALHA NAVAL");
console.log(document.cookie);

// criar tabuleiros
criarTabuleiroJogador();
criarTabuleiroIA();

mostrarInfoNavios()

var jogadorDaVez = 'ia'
alternarJogador()

/*
coordX = 3
coordY = 9
jogadorDaVez = 'ia'
var id_cel = "ia_cel:"+coordX+"-"+coordY
var cel = document.getElementById(id_cel).getElementsByTagName('img')[0]
disparo_casa(coordX, coordY, cel)
*/

function mostrarInfoNavios() {

	lista_tam_navios.forEach( inserir_infoNavios_jogador )

	lista_tam_navios.forEach( inserir_infoNavios_ia )
}

function inserir_infoNavios_jogador(tam, indice){
	var div = document.getElementById('info_navios_jogador')

	var id_navio = 'jogador_infoNavio'+tam

	// label de confirmacao que o navio foi inserido
	var label = document.createElement('label')
	label.id = id_navio+'_destruido'
	label.setAttribute('style', 'color:green')

	// add o label na div
	div.appendChild(label)

	// criar o elemento label, que e o texto (rotulo) que aparece pro usuario
	var label = document.createElement('label')
	label.id = id_navio+'_nome'
	label.setAttribute("for", 'jogador_infoNavio'+tam)
	label.innerHTML = 'Navio ('+tam+' casas)'

	// add o label na div
	div.appendChild(label)

	// add um pula linha na div
	div.appendChild(document.createElement('br'))
}

function inserir_infoNavios_ia(tam, indice){
	var div = document.getElementById('info_navios_ia')

	var id_navio = 'ia_infoNavio'+tam

	// criar o elemento label, que e o texto (rotulo) que aparece pro usuario
	var label = document.createElement('label')
	label.id = id_navio+'_nome'
	label.setAttribute("for", 'ia_infoNavio'+tam)
	label.innerHTML = 'Navio ('+tam+' casas)'

	// add o label na div
	div.appendChild(label)

	// label de confirmacao que o navio foi inserido
	var label = document.createElement('label')
	label.id = id_navio+'_destruido'
	label.setAttribute('style', 'color:red')

	// add o label na div
	div.appendChild(label)

	// add um pula linha na div
	div.appendChild(document.createElement('br'))
}

function criarTabuleiroIA() {

	// cria uma tabela que sera o tabuleiro
	var tab = document.getElementById("tabuleiro_ia");
	for (var i = 0; i < tamanho_tabuleiro; i++) {

		// cria uma linha
		var linha = document.createElement("tr");
		for (var j = 0; j < tamanho_tabuleiro; j++) {

			// cria uma celula e faz id=posicao no tabuleiro
			var celula = document.createElement("td");
			celula.id = "ia_cel:"+i+"-"+j;

			// insere uma imagem em cada celula
			var img = document.createElement("img");

			var coord = new Coordenada(i,j)
			var navio = getNavioPelaPosicao(coord, lista_navios_jogador)
			if(navio == null){
				img.src = "./imagens/jogo_mar.png";
				img.height = tamanho_casas_px;
				img.className = "mar";
			}else{
				img.src = "./imagens/jogo_navio.png";
				img.height = tamanho_casas_px;
				img.className = "navio_jogador";
			}

			// add imagem na celula da tabela
			celula.appendChild(img);
			// add a celula na linha
			linha.appendChild(celula);
		};
		// add a linha na tabela
		tab.appendChild(linha);
	};
}

function criarTabuleiroJogador() {

	// cria uma tabela que sera o tabuleiro
	var tab = document.getElementById("tabuleiro_jogador");
	for (var i = 0; i < tamanho_tabuleiro; i++) {

		// cria uma linha
		var linha = document.createElement("tr");
		for (var j = 0; j < tamanho_tabuleiro; j++) {

			// cria uma celula e faz id=posicao no tabuleiro
			var celula = document.createElement("td");
			celula.id = "jog_cel:"+i+"-"+j;

			// insere uma imagem em cada celula
			// (no inicio todas as posicoes do tabuleiro sao mar)
			var img = document.createElement("img");
			img.src = "./imagens/jogo_mar.png";
			img.height = tamanho_casas_px;
			img.className = "mar";

			// EVENTOS
			// quando ocorre um click na imagem
			img.onclick = clique_casa;

			// add imagem na celula da tabela
			celula.appendChild(img);
			// add a celula na linha
			linha.appendChild(celula);
		};
		// add a linha na tabela
		tab.appendChild(linha);
	};
}

function clique_casa() {

	// se o jogador da vez não for "jogador", entao o usuario nao pode jogar
	if(jogadorDaVez != "jogador")
		return;

	// verificar se a casa em que ocorreu o evento ainda não foi descorberta
	if(this.className != "mar"){
		console.log(this.className)
		return;
	}

	// identificacao das coordenadas onde ocorreu o evento
	var id_cel = this.parentElement.id;
	var coordenadas_cel = id_cel.split(":")[1].split("-");
	var linha = parseInt(coordenadas_cel[0]);
	var coluna = parseInt(coordenadas_cel[1]);

	disparo_casa(linha, coluna, this)

	ia_jogar()
}

function alternarJogador() {

	if(jogadorDaVez == 'ia')
		jogadorDaVez = 'jogador'
	else
		jogadorDaVez = 'ia'

	document.getElementById('jogadorDaVez').innerHTML = 'Jogador da vez: ' + jogadorDaVez
}

function mostrarAviso(mensagem){
	document.getElementById("aviso").innerHTML = mensagem;
}

function informarNavioDestruido(tam) {
	var id_label = jogadorDaVez+'_infoNavio'+tam+'_destruido'
	document.getElementById(id_label).innerHTML = ' DESTRUIDO '
}

function analizar_cookie () {
	// Analizar o cookie da pagina para identificar os navios adicionados pelo usuario

	// le quantos navios foram adicionados
	var qnt_navios = parseInt(document.cookie.replace(/.*\bqnt_navios\s*=\s*(\d+).*/, '$1'))

	// procura no cookie cada um dos navios
	for (var i = 1; i <= qnt_navios; i++) {

		// le as informacoes do navio
		var regex = new RegExp(".*\\bnavio"+i+"\\s*=\\s*([^;]*).*")
		var info_navio = document.cookie.replace(regex, '$1')

		// analisa e separa as informacoes
		var casas = parseInt(info_navio.replace(/.*casas:([^,]*).*/, '$1'))
		var coordenadas = info_navio.replace(/.*coordenadas:([^,]*).*/, '$1').split('-')
		var orientacao = info_navio.replace(/.*orientacao:([^,]*).*/, '$1')

		lista_navios_jogador.push(new Navio(casas, new Coordenada(parseInt(coordenadas[0]), parseInt(coordenadas[1])), orientacao))

		lista_tam_navios.push(casas)
	}

	lista_tam_navios.sort()

	console.log(lista_navios_jogador)
}

function reiniciarJogo() {
	window.location = "./index.html";
}

/*      //////////////       REGRAS DA IA     ///////////////// 

0- Basicamente, a IA tem um vetor de jogadas possiveis, comeca com todas as casas e vai se restrigindo conforme o jogo flui
1- Ao acertar um Navio, a IA limita as proximas jogadas para os seus arredores possiveis
2- Ao acertar uma segunda casa de um possivel navio, o limite eh mudado para apenas as casas que completariam esse possivel navio
2.1 Se o Navio nao foi completado, quer dizer que eram navios adjacentes, e agora limita as jogadas para o passo 1, a partir de uma casa de navio acertada
2.2 Se o navio foi completado, checa se ha alguma casa acertada pendente, se sim, retorna ao passo 1
3- Ao terminar os Navios achados, a IA define o vetor de possiveis jogadas como as casas em que os navios restantes ainda cabem, e atira ate voltar ao passo 1 *


*Ainda nao implementado

*/


async function ia_jogar() {
	// ALEATORIO

	if(jogadorDaVez != 'ia')
		return;
	
	var cel = null

	while(cel == null || cel.className=='acertou_navio' || cel.className=='acertou_mar' ){


		// se nao tiver acertado nada joga RANDOM *por enquanto
		if(lista_jogadas.length == 0){

			var coordX = Math.floor(Math.random()*tamanho_tabuleiro)
			var coordY = Math.floor(Math.random()*tamanho_tabuleiro)
			var id_cel = "ia_cel:"+coordX+"-"+coordY
			var cel = document.getElementById(id_cel).getElementsByTagName('img')[0]
		}// se tiver acertado um navio, joga entre as possiveis casas
		else{
			var indice_jogada = Math.floor(Math.random()*(lista_jogadas.length))
			var coordX = lista_jogadas[indice_jogada].x
			var coordY = lista_jogadas[indice_jogada].y
			lista_jogadas.splice(indice_jogada, 1)
			
			var id_cel = "ia_cel:"+coordX+"-"+coordY
			var cel = document.getElementById(id_cel).getElementsByTagName('img')[0]
		}
	}

	console.log(coordX+','+coordY)
	var acertou_navio = disparo_casa(coordX, coordY, cel)

	// print das casas que ira randomizar e escolher a proxima jogada
	for(let k = 0; k < lista_jogadas.length; k++ ){
		console.log(lista_jogadas[k].x + ", " + lista_jogadas[k].y + " possiveis ")
	}

	if(acertou_navio){
		await sleep(900);
		
		ia_jogar()
	}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mostrarVencedor(vencedor){
	console.log("JOGADOR VENCEU!!!")

	document.getElementById('jogadorDaVez').innerHTML = 'FIM DE JOGO - VENCEDOR: ' + vencedor

	document.getElementById('reiniciar').hidden = false

	jogadorDaVez = 'fim de jogo'
}

function disparo_casa(coordX, coordY, casaElement){

	var coord = new Coordenada(coordX, coordY)

	if(jogadorDaVez == 'jogador')
		var navio = getNavioPelaPosicao(coord, lista_navios_ia)
	else
		var navio = getNavioPelaPosicao(coord, lista_navios_jogador)
	
	mostrarAviso('Ultima jogada: '+jogadorDaVez+' ('+(coordY+1)+','+(coordX+1)+')')
	
	if(navio == null){
		// se não tiver um navio associado a essa casa então ecertou o mar
		casaElement.className = "acertou_mar"
		casaElement.src = "./imagens/jogo_acertou_mar.png"

		alternarJogador()

		// Caso em que, foi encerrado uma reta de acertos em navios e nao existia um navio, portanto a lista esta vazia, mas existem navios pendentes
		if(lista_jogadas.length == 0){
			checaNaviosPendentes()

		}
		return false
	
	}
	
	// se tiver um navio associado a essa casa entao acertou um navio
	casaElement.className = "acertou_navio"
	casaElement.src = "./imagens/jogo_acertou_navio.png"

	navio.atingiuCasa(coord)

	if(navio.destruido()){
		informarNavioDestruido(navio.tamanho)
	}

	if(destruiuTodosNavios(lista_navios_ia)){
		mostrarVencedor('jogador')
	}else if(destruiuTodosNavios(lista_navios_jogador)){
		mostrarVencedor('ia')
	}

	
	// Definindo o vetor das proximas jogadas ao acertar um navio
	if(jogadorDaVez == 'ia'){
		
		var count = 0
		navio.casasAtingidas.forEach(function(valor){ // Checa quantas casas foram atingidas, pra saber o quanto a IA pode saber
			if(valor == true)
				count++
		})
		
		if (count == 1){//Se apenas 1 foi atingida, retorna uma lista das opções dos valores Viáveis ao redor da casa atingida ( em cruz))
			
			//Caso existam navios diferentes adjacente, para a IA nao ter vantagem, se sim, preenche com as jogadas considerando como se fosse um navio
			
			existe = checaNaviosAoRedor(coord)
			
			if(!existe){
			//caso nao tenha achado navios ao lado, preenche com as possiveis casas ao lado

				preencheAdjacentes(coord)

			}

		}else if(count != navio.casasAtingidas.length){// se tiver acertado mais de uma casa do navio, já se sabe a orientacao, portanto, diminui as possibilidades
			
			completaNavio(navio)
			
		}else{//Ao terminar um navio, checa se ja achou vestigios de algum outro, caso contrario, retorna uma lista vazia e volta ao random
			checaNaviosPendentes()
			
		}
	}

	return true
}

////////////////////////// FUNCOES DA IA //////////////////////// 

function checaNaviosPendentes(){
	lista_jogadas = []
	for(let k = 0; k < lista_navios_jogador.length; k++){
		var count = 0
		var indice = 0

		for(let i = 0; i < lista_navios_jogador[k].casasAtingidas.length; i++){
			if(lista_navios_jogador[k].casasAtingidas[i] == true){
				indice = i
				count++
			}
		}
				
		var navio_casas = lista_navios_jogador[k].casas()
		if(count == 1){
			if(navio_casas[indice].x - 1 >= 0){
				coord1 = new Coordenada(navio_casas[indice].x -1, navio_casas[indice].y)
				lista_jogadas.push(coord1)
			}
			if(navio_casas[indice].y - 1 >= 0){
				coord2 = new Coordenada(navio_casas[indice].x, navio_casas[indice].y -1)
				lista_jogadas.push(coord2)
			}
			if(navio_casas[indice].x +1 <= 9){
				coord3 = new Coordenada(navio_casas[indice].x +1, navio_casas[indice].y)
				lista_jogadas.push(coord3)
			}
			if(navio_casas[indice].y +1 <= 9){
				coord4 = new Coordenada(navio_casas[indice].x, navio_casas[indice].y +1)
				lista_jogadas.push(coord4)
			}
			return
		}
	}
}

function completaNavio(navio){
	lista_jogadas = []
	var min_x = 10
	var max_x = 0
	var min_y = 10
	var max_y = 0
	var coord_x = 0
	var coord_y = 0
	if(navio.orientacao == 'vertical'){
		var navio_casas = navio.casas()
		for(let k = 0; k < navio_casas.length; k++){
			coord_x = navio_casas[k].x
			if(navio.casasAtingidas[k] == true){
				if(navio_casas[k].y < min_y){
					min_y = navio_casas[k].y
				}else if(navio_casas[k].y > max_y){
					max_y = navio_casas[k].y
				}
			}
		}
		
		if(max_y +1 <= 9){
			coord1 = new Coordenada(coord_x, max_y +1)
			lista_jogadas.push(coord1)
		}
		if(min_y -1 >= 0){
			coord2 = new Coordenada(coord_x, min_y -1)
			lista_jogadas.push(coord2)
		}
	}else{
		var navio_casas = navio.casas()
		for(let k = 0; k < navio_casas.length; k++){
			coord_y = navio_casas[k].y
			if(navio.casasAtingidas[k] == true){
				if(navio_casas[k].x < min_x){
					min_x = navio_casas[k].x
				}else if(navio_casas[k].x > max_x){
					max_x = navio_casas[k].x
				}
			}
		}
		
		if(max_x +1 <= 9){
			coord1 = new Coordenada(max_x +1, coord_y)
			lista_jogadas.push(coord1)
		}
		if(min_x -1 >= 0){
			coord2 = new Coordenada(min_x -1, coord_y)
			lista_jogadas.push(coord2)
		}
	}
}

function checaNaviosAoRedor(coord){

	// cada if checa se a casa adjacente ja foi acertada e possui um navio, se sim, limita para os lados como uma pessoa faria, achando que teria um navio ali


	if(coord.x - 1 >= 0 ){
		lista_jogadas = []
		var id_cel1 = "ia_cel:"+(coord.x-1)+"-"+coord.y
		var cel1 = document.getElementById(id_cel1).getElementsByTagName('img')[0]
		if(cel1.className == 'acertou_navio'){
			var coordenada = new Coordenada(coord.x-1, coord.y)
			console.log("entra11")
			var navio2 = getNavioPelaPosicao(coordenada, lista_navios_jogador)
			if(!navio2.destruido()){
				console.log("entra1")
				if(coord.x+1 <= 9){
					var coord1 = new Coordenada(coord.x+1, coord.y)
					lista_jogadas.push(coord1)
				}
				for(let k = coord.x; k > 0; k--){
					var coordenada = new Coordenada(k-1, coord.y)
					var navio2 = getNavioPelaPosicao(coordenada, lista_navios_jogador)
					var id_cel1 = "ia_cel:"+(k-1)+"-"+coord.y
					var cel1 = document.getElementById(id_cel1).getElementsByTagName('img')[0]
					
					if(cel1.className == 'acertou_navio' && navio2.destruido()){
						return true
					}else if(cel1.className != 'acertou_navio'){
						var coord2 = new Coordenada(k-1, coord.y)
						lista_jogadas.push(coord2)
						break
					}
				}
				return true
			}
		}
	}

	if(coord.x +1 <= 9){
		lista_jogadas = []
		var id_cel2 = "ia_cel:"+(coord.x+1)+"-"+coord.y
		var cel2 = document.getElementById(id_cel2).getElementsByTagName('img')[0]
		if(cel2.className == 'acertou_navio'){
			console.log("entra22")
			var coordenada =new Coordenada(coord.x+1, coord.y)
			var navio2 = getNavioPelaPosicao(coordenada, lista_navios_jogador)
			if(!navio2.destruido()){
				console.log("entra2")
				if(coord.x -1>=0){
					var coord1 = new Coordenada(coord.x-1, coord.y)
					lista_jogadas.push(coord1)
				}
				for(let k = coord.x; k < 9; k++){
					var coordenada = new Coordenada(k+1, coord.y)
					var navio2 = getNavioPelaPosicao(coordenada, lista_navios_jogador)
					var id_cel2 = "ia_cel:"+(k+1)+"-"+coord.y
					var cel2 = document.getElementById(id_cel2).getElementsByTagName('img')[0]
					
					if(cel2.className == 'acertou_navio' && navio2.destruido()){
						return true
						}else if(cel2.className !='acertou_navio'){
						var coord2 = new Coordenada(k+1, coord.y)
						lista_jogadas.push(coord2)
						console.log(coord2.x + " " + (coord2.y)+ " a 2 ")

						break
					}
				}
			return true
			}
		}				
	}

	if(coord.y-1 >= 0){
		lista_jogadas = []
		var id_cel3 = "ia_cel:"+coord.x+"-"+(coord.y-1)
		var cel3 = document.getElementById(id_cel3).getElementsByTagName('img')[0]
		if(cel3.className == 'acertou_navio'){
			console.log("entra33")
			var coordenada = new Coordenada(coord.x, coord.y-1)
			var navio2 = getNavioPelaPosicao(coordenada, lista_navios_jogador)
			if(!navio2.destruido()){
				console.log("entra3")
				if(coord.y +1 <= 9){
					var coord1 = new Coordenada(coord.x, coord.y+1)
					lista_jogadas.push(coord1)
				}
				for(let k = coord.y; k > 0; k--){
					var coordenada = new Coordenada(coord.x, k-1)
					var navio2 = getNavioPelaPosicao(coordenada, lista_navios_jogador)
					var id_cel3 = "ia_cel:"+coord.x+"-"+(k-1)
					var cel3 = document.getElementById(id_cel3).getElementsByTagName('img')[0]
					
					if(cel3.className == 'acertou_navio' && navio2.destruido()){
						return true
					}else if(cel3.className !='acertou_navio'){
						var coord2 = new Coordenada( coord.x, k-1)
						lista_jogadas.push(coord2)
						break
					}
				}
			return true
			}
		}
	
	}

	if(coord.y +1 <= 9){ 
		lista_jogadas = []
		var id_cel4 = "ia_cel:"+coord.x+"-"+(coord.y+1)
		var cel4 = document.getElementById(id_cel4).getElementsByTagName('img')[0]
		if(cel4.className == 'acertou_navio'){
			console.log("entra44")
			var coordenada = new Coordenada(coord.x, coord.y+1)
			var navio2 = getNavioPelaPosicao(coordenada, lista_navios_jogador)
			if(!navio2.destruido()){
				console.log("entra4")
				if(coord.y -1 >= 0){
					coord1 = new Coordenada(coord.x, coord.y -1)
					lista_jogadas.push(coord1)
				}
				for(let k = coord.y; k < 9; k++){
					var coordenada = new Coordenada(coord.x, k+1)
					var navio2 = getNavioPelaPosicao(coordenada, lista_navios_jogador)
					var id_cel4 = "ia_cel:"+coord.x+"-"+(k+1)
					var cel4 = document.getElementById(id_cel4).getElementsByTagName('img')[0]
								
					if(cel4.className == 'acertou_navio' && navio2.destruido()){
						return true
					}else if(cel4.className !='acertou_navio'){
						var coord2 = new Coordenada( coord.x, k+1)
						lista_jogadas.push(coord2)
						break
					}
				}
			return true
			}
		}
	}
}

function preencheAdjacentes(coord){	

	if(coord.x - 1 >= 0){	
		coord1 = new Coordenada(coord.x -1, coord.y)
		lista_jogadas.push(coord1)
		
	}
	if(coord.y - 1 >= 0){
		coord2 = new Coordenada(coord.x, coord.y -1)
		lista_jogadas.push(coord2)
	}
	if(coord.x +1 <= 9){
		coord3 = new Coordenada(coord.x +1, coord.y)
		lista_jogadas.push(coord3)
	}
	if(coord.y +1 <= 9){
		coord4 = new Coordenada(coord.x, coord.y +1)
		lista_jogadas.push(coord4)
	}
}