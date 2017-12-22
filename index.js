
var tamanho_tabuleiro = 10;
var tamanho_casas_px = 30;
var qnt_navios = 0

// criar o tabuleiro
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
			celula.className = "mar";
			var img = document.createElement("img");
			img.src = "./imagens/index_mar.png";
			img.height = tamanho_casas_px;

			// EVENTOS
			// quando o mouse passa por cima da imagem
			img.onmouseover = mostrar_navio;
			// quando o mouse sai de cima da imagem
			img.onmouseout = mostrar_mar;
			// quando ocorre um click na imagem
			img.onclick = add_navio;

			// add imagem na celula da tabela
			celula.appendChild(img);
			// add a celula na linha
			linha.appendChild(celula);
		};
		// add a linha na tabela
		tab.appendChild(linha);
	};
}

function mostrar_navio() {
	// Evento quando o mouse passar por cima de uma imagem
	// alterar a cor da celula em que ocorre o evento e em casas na sequencia
	// para mostrar um navio

	// identificacao das coordenadas onde ocorreu o evento
	var id_cel = this.parentElement.id;
	var coordenadas_cel = id_cel.split(":")[1].split("-");
	var linha = parseInt(coordenadas_cel[0]);
	var coluna = parseInt(coordenadas_cel[1]);

	// identificar qual o tamanho do navio a ser mostrado
	var tam_navio = tamanho_do_navio();

	// verificar se ha espaco para add um navio nessa coordenada
	if(linha+tam_navio <= tamanho_tabuleiro){

		// alterar a cor das celulas para mostrar o navio
		for (var i = linha ; i < linha+tam_navio ; i++){
			var id = "cel:"+i+"-"+coluna;

			// se houver nao houver navio fixado: mostrar navio
			if(document.getElementById(id).className != "navio"){
				document.getElementById(id).getElementsByTagName("img")[0].src = "./imagens/index_novo_navio.png";
			}
		}
	}
}

function mostrar_mar() {
	// Evento quando o mouse sai de cima de uma imagem
	// mostrando novamente o mar ou um navio, caso haja um navio ja fixado naquela posicao

	// identificacao das coordenadas onde ocorreu o evento
	var id_cel = this.parentElement.id;
	var coordenadas_cel = id_cel.split(":")[1].split("-");
	var linha = parseInt(coordenadas_cel[0]);
	var coluna = parseInt(coordenadas_cel[1]);

	// identificar qual o tamanho do navio a ser removido
	var tam_navio = tamanho_do_navio();

	// verificar se foi possivel mostrar um navio nessa posicao
	// (se nao foi possivel mostrar o navio entao nao ha navio para ser removido)
	if(linha+tam_navio <= tamanho_tabuleiro){

		// iterar pela casas onde o navio esta sendo mostrado
		for (var i = linha ; i < linha+tam_navio ; i++){
			var id = "cel:"+i+"-"+coluna;

			// verificar se nessa posicao nao existe um navio ja fixado
			if(document.getElementById(id).className == "mar"){

				// alterar a cor da imagem para mar
				document.getElementById(id).getElementsByTagName("img")[0].src = "./imagens/index_mar.png";
			}
		}
	}
}

function botao_acionado (event) {
	console.log('entrou')
	if(event.keyCode == 32){
		console.log('ok')
	}
}

function tamanho_do_navio(){
	// analiza na pagina qual o tamanho do navio que o usuario escolheu
	if(document.getElementById("escolhaNavio1").checked){
		return 3;
	}else if(document.getElementById("escolhaNavio2").checked){
		return 5;
	}else if(document.getElementById("escolhaNavio3").checked){
		return 7;
	}
}

function add_navio() {
	// Evento quando ocorre um click na imagem
	// Verifica se ha espaco para adicionar o navio e se ha outro navio que esta no meio
	// caso esteja tudo ok o navio e adicionado

	// inicia a mensagem de aviso como vazia
	document.getElementById("aviso").innerHTML = "";

	// identificacao das coordenadas onde ocorreu o evento
	var id_cel = this.parentElement.id;
	var coordenadas_cel = id_cel.split(":")[1].split("-");
	var linha = parseInt(coordenadas_cel[0]);
	var coluna = parseInt(coordenadas_cel[1]);

	// identificar qual o tamanho do navio a ser removido
	var tam_navio = tamanho_do_navio();

	// Verifica se ha espaco para adicionar o navio e se ha outro navio que esta no meio
	pode_add_navio = true;

	// Verifica se ha espaco
	if(linha+tam_navio <= tamanho_tabuleiro){

		// Verifica se ha outro navio no meio do caminho
		for (var i = linha ; i < linha+tam_navio ; i++){
			var id = "cel:"+i+"-"+coluna;

			// se houver nao pode add navio
			if(document.getElementById(id).className == "navio"){
				pode_add_navio = false;
			}
		}
	}else{
		pode_add_navio = false;
	}

	// se estiver tudo ok, pode add o navio
	if(pode_add_navio){

		// fixar o navio na posicao (alterando a class da img)
		for (var i = linha ; i < linha+tam_navio ; i++){
			var id = "cel:"+i+"-"+coluna;
			document.getElementById(id).className = "navio";
			document.getElementById(id).getElementsByTagName('img')[0].src = "./imagens/index_navio_fixado.png"
		}

		// add no cookie que foi adicionado um navio nessa posicao (nao funciona no Chrome...)
		var casas = "casas:"+tam_navio;
		var coordenadas = "coordenadas:" + coordenadas_cel[0]+"-"+coordenadas_cel[1];
		var orientacao = "orientacao:"+"vertical";
		document.cookie = "navio"+(++qnt_navios)+"="+casas+","+coordenadas+","+orientacao;
		document.cookie = "qnt_navios="+qnt_navios
	}else{
		// caso no estaja tudo ok eh mostrada uma mensagem ao usuario
		document.getElementById("aviso").innerHTML = "Não é possível adicionar o navio neste local.";
	}

	// mostrar cookie no console 
	// (para ver o console aperte F12 no navegador e clique na aba console)
	console.log(document.cookie);

	// É PRECISO CRIAR SESSÕES?
	// É PRECISO USAR SOCKETS?
}

function iniciar_jogo() {
	// alterar a url da pagina para iniciar o jogo
	window.location = "./jogo.html";
}