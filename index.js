
var tamanho_tabuleiro = 10;
var tamanho_casas_px = 30;
var orientacao = 'vertical'

var lista_navios = []
var novo_navio = null

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

function navio_valido(navio){
	var valido = true
	navio.casas().forEach(function(coord){
		var id = "cel:"+coord.x+"-"+coord.y
		var celula = document.getElementById(id)
		if(celula == null || celula.className == "navio")
			valido = false
	})

	return valido
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

	// Limpar tabuleiro (apenas os navios temporarios), caso haja algum navio temporario no tabuleiro
	mostrar_mar();

	novo_navio = new Navio(tam_navio, new Coordenada(linha, coluna), orientacao)

	if(navio_valido(novo_navio)){
		novo_navio.casas().forEach(function(coord){
			var id = "cel:"+coord.x+"-"+coord.y
			var celula = document.getElementById(id)
			celula.className = "novo_navio"
    		celula.getElementsByTagName("img")[0].src = "./imagens/index_novo_navio.png";
		})
	}else{
		novo_navio = null
	}
}

function mostrar_mar() {
	// busca na pagina por elementos com o className 'novo_navio'
	// retorna um HTMLCollection
	var casas_novos_navios = document.getElementsByClassName('novo_navio')

	// transforma o HTMLCollection em Array
	casas_novos_navios = Array.from(casas_novos_navios)

	// muda os ClassName para 'mar' e a imagem que e mostrada
	casas_novos_navios.forEach(function(celula){
    	celula.className = "mar"
    	celula.getElementsByTagName("img")[0].src = "./imagens/index_mar.png";
  	});
}

function add_navio() {
	// inicia a mensagem de aviso como vazia
	document.getElementById("aviso").innerHTML = "";

	// Caso não seja possivel add o navio nessa posicao
	if(novo_navio == null){
		document.getElementById("aviso").innerHTML = "Não é possível adicionar o navio neste local.";
		return
	}

	// muda as celulas da tabela para fixar o navio
	novo_navio.casas().forEach(function(coord){
		var id = "cel:"+coord.x+"-"+coord.y
		var celula = document.getElementById(id)
		celula.className = "navio"
		celula.getElementsByTagName("img")[0].src = "./imagens/index_navio_fixado.png";
	})

	lista_navios.push(novo_navio)

	console.log(lista_navios)
}

function desfazer() {
	// Remove o ultimo navio que foi adicionado

	// Caso ainda nao tenha adicionado nenhum navio
	if(lista_navios.length == 0)
		return

	// remover o ultimo navio da lista
	var navio = lista_navios.pop()

	navio.casas().forEach(function(coord){
		var id = "cel:"+coord.x+"-"+coord.y
		var celula = document.getElementById(id)
		celula.className = "mar"
		celula.getElementsByTagName("img")[0].src = "./imagens/index_mar.png";
	})
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

function iniciar_jogo() {
	// gravar navios no cookie
	escrever_cookie();

	// alterar a url da pagina para iniciar o jogo
	window.location = "./jogo.html";
}

function escrever_cookie() {
	lista_navios.forEach(function(navio, indice){
		var casas = "casas:"+navio.tamanho;
		var coordenadas = "coordenadas:" + navio.coordenadas.x + "-" + navio.coordenadas.y;
		var orientacao_navio = "orientacao:" + navio.orientacao;
		document.cookie = "navio"+(indice+1)+"="+casas+","+coordenadas+","+orientacao_navio;
	})
	document.cookie = "qnt_navios="+lista_navios.length;
}

function verificarTeclaPressionada(event){
	// Verificar se foi pressionado a Barra de Espaço

    if(event.which == 32) // codigo da Barra de Espaço = 32
    	mudarOrientacao()
}

function mudarOrientacao(){
	// alternar entre horizontal e vertical
	if(orientacao == 'vertical')
		orientacao = 'horizontal'
	else
		orientacao = 'vertical'
}