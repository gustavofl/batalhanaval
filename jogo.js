
var tamanho_tabuleiro = 10;
var tamanho_casas_px = 30;
var lista_navios = [];

var lista_tam_navios = []

// procurar no cookie os navios adicionados pelo usuario
analizar_cookie()

// mostra os cookies do navegador no console
// (para ver o console aperte F12 no navegador e clique na aba console)
console.log("BATALHA NAVAL");
console.log(document.cookie);

// criar tabuleiros
criarTabuleiroJogador();
criarTabuleiroIA();

mostrarInfoNavios()

var jogadorDaVez = 'jogador'

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
			var navio = getNavioPelaPosicao(coord, lista_navios)
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

	var coord = new Coordenada(linha, coluna)
	var navio = obter_navio(coord)
	
	if(navio == null){
		// se não tiver um navio associado a essa casa então ecertou o mar
		this.className = "acertou_mar"
		this.src = "./imagens/jogo_acertou_mar.png";
		return
	}

	// se tiver um navio associado a essa casa entao acertou um navio
	this.className = "acertou_navio"
	this.src = "./imagens/jogo_acertou_navio.png";

	navio.atingiuCasa(coord)

	if(navio.destruido()){
		informarNavioDestruido(navio.tamanho, jogadorDaVez)
	}
}

function informarNavioDestruido(tam, jogador) {
	var id_label = jogador+'_infoNavio'+tam+'_destruido'
	document.getElementById(id_label).innerHTML = 'DESTRUIDO '
}

function obter_navio(coord) {
	// verifica se essa coordenada esta associada a algum navio e o retorna

	var navioNaPosicao = null

	lista_navios.forEach(function(navio){
		if(navio.ocupaCasa(coord)){
			navioNaPosicao = navio
		}
	})

	return navioNaPosicao
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

		lista_navios.push(new Navio(casas, new Coordenada(parseInt(coordenadas[0]), parseInt(coordenadas[1])), orientacao))

		lista_tam_navios.push(casas)
	}

	lista_tam_navios.sort()

	console.log(lista_navios)
}