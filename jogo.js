
var tamanho_tabuleiro = 10;
var tamanho_casas_px = 30;
var lista_navios = [];

// procurar no cookie os navios adicionados pelo usuario
analizar_cookie()

// mostra os cookies do navegador no console
// (para ver o console aperte F12 no navegador e clique na aba console)
console.log("BATALHA NAVAL");
console.log(document.cookie);

// criar tabuleiro
criarTabuleiro();

function criarTabuleiro() {

	// cria uma tabela que sera o tabuleiro
	var tab = document.getElementById("tabuleiro1");
	for (var i = 0; i < tamanho_tabuleiro; i++) {

		// cria uma linha
		var linha = document.createElement("tr");
		for (var j = 0; j < tamanho_tabuleiro; j++) {

			// cria uma celula e faz id=posicao no tabuleiro
			var celula = document.createElement("td");
			celula.id = "cel:"+i+"-"+j;

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
		// mostrar para o usuario
		console.log("navio destruido")
	}
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
	}

	console.log(lista_navios)
}