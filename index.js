
var tamanho_tabuleiro = 10;
var tamanho_casas_px = 30;
var qnt_navios = 0
var orientacao = 'vertical'

/*
var lista_navios = []

function Navio(tamanho, coordenadas, orientacao){
	this.tamanho = tamanho
	this.coordenadas = coordenadas
	this.orientacao = orientacao

	// retorna as casas ocupadas por este navio
	this.casas = (function {
		var casas = []
		for (var i = 0; i < tamanho; i++) {
				
		}
	})
}
*/

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

	// Se ha alguma casa mostrando um navio a ser fixado: limpar as casas
	if(document.getElementsByClassName('novo_navio').length != 0){
		mostrar_mar();
	}

	// casas em que o novo navio sera inserido
	var casas_novos_navios = []

	// verifica se as casas estao disponiveis para adicionar um navio
	if(orientacao == 'vertical'){
		// Para navios na vertical
		for (var i = linha ; i < linha+tam_navio ; i++){
			var id = "cel:"+i+"-"+coluna;

			var celula = document.getElementById(id)

			// verifica se existe esta casa no tabuleiro e se ja existe algum navio nesta posicao
			if(celula != null && celula.className != "navio")
				casas_novos_navios.push(celula) // add a celula da tabela na lista
		}
	}else{
		// Para navios na horizontal
		for (var i = coluna ; i < coluna+tam_navio ; i++){
			var id = "cel:"+linha+"-"+i;

			var celula = document.getElementById(id)

			// verifica se existe esta casa no tabuleiro e se ja existe algum navio nesta posicao
			if(celula != null && celula.className != "navio")
				casas_novos_navios.push(celula) // add a celula da tabela na lista
		}
	}

	// Se a quantidade de casas adicionadas na lista for diferente do tamanho do navio entao nao e possivel add o navio
	if(casas_novos_navios.length != tam_navio)
		return

	// Se nao tiver nenhum problema, entao mostrar que e possivel add o navio nesta posicao
	casas_novos_navios.forEach(function(celula){
    	celula.className = "novo_navio"
    	celula.getElementsByTagName("img")[0].src = "./imagens/index_novo_navio.png";
  	});
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

	// busca na pagina por elementos com o className 'novo_navio'
	// retorna um HTMLCollection
	var casas_novos_navios = document.getElementsByClassName('novo_navio')

	// transforma o HTMLCollection em Array
	casas_novos_navios = Array.from(casas_novos_navios)

 	// Se o array nao estiver vazio: add o navio
	if(casas_novos_navios.length > 0){
		// muda as celulas da tabela para fixar o navio
		casas_novos_navios.forEach(function(celula){
	    	celula.className = "navio"
	    	celula.getElementsByTagName("img")[0].src = "./imagens/index_navio_fixado.png";
	  	});

	  	// identificacao das coordenadas onde ocorreu o evento
		var id_cel = this.parentElement.id;
		var coordenadas_cel = id_cel.split(":")[1].split("-");
		var linha = parseInt(coordenadas_cel[0]);
		var coluna = parseInt(coordenadas_cel[1]);

		// identificar qual o tamanho do navio a ser removido
		var tam_navio = tamanho_do_navio();

	  	// add no cookie que foi adicionado um navio nessa posicao
		var casas = "casas:"+tam_navio;
		var coordenadas = "coordenadas:" + coordenadas_cel[0]+"-"+coordenadas_cel[1];
		var orientacao_navio = "orientacao:"+orientacao;
		document.cookie = "navio"+(++qnt_navios)+"="+casas+","+coordenadas+","+orientacao_navio;
		document.cookie = "qnt_navios="+qnt_navios

		// mostrar cookie no console 
		// (para ver o console aperte F12 no navegador e clique na aba console)
		console.log(document.cookie);
	}else{
		// Caso não seja possivel add nessa posicao
		document.getElementById("aviso").innerHTML = "Não é possível adicionar o navio neste local.";
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

function tamanho_do_navio_2(){ 
	// lista opcoes para o tamanho do navio
	var opt_check = document.getElementsByName('tipo_navio')

	// indice da lista que esta marcada
	var opcao_escolhida = -1

	// procura na lista qual o navio escolhido
	for(var i=0; i<opt_check.length; i++){
		if(opt_check[i].checked){
			opcao_escolhida = i;
			break;
		}
	}

	// estrai do valor do navio escolhido qual o seu tamanho
	var tamanho = parseInt(opt_check[opcao_escolhida].value.replace(/navio_(\d+)casas/, '$1'))

	return tamanho
}

function iniciar_jogo() {
	// alterar a url da pagina para iniciar o jogo
	window.location = "./jogo.html";
}

function verificarTeclaPressionada(event){
	// Verificar se foi pressionado a Barra de Espaço

    if(event.which == 32) { // codigo da Barra de Espaço = 32

    	// alternar entre horizontal e vertical
    	if(orientacao == 'vertical')
    		orientacao = 'horizontal'
    	else
    		orientacao = 'vertical'
    }
}