
var tamanho_tabuleiro = 10;
var tamanho_casas_px = 30;
var orientacao = 'vertical'

var lista_tam_navios = [ 2, 3, 4, 5, 7 ]

// indica se o proximo click no tabuleiro sera para modificar um navio
var modificar_navio = false

// lista de navios adicionados
var lista_navios = []

// navio temporario, que aparece ao usuario anter de ser fixado
var novo_navio = null

// criar o tabuleiro
criarTabuleiro();
criarOpcoesTamanhos();

function criarOpcoesTamanhos() {
	// Cria as opcoes na pagina conforme os tamanhos na lista_tam_navios

	// Ordena a lista_tam_navios e remove repeticoes
	lista_tam_navios.sort()
	lista_tam_navios = lista_tam_navios.filter(function(elemento, index){
		return lista_tam_navios.indexOf(elemento) == index
	})

	// div onde ficam as opcoes
	var div = document.getElementById('opcoes_tamanho_navio')

	// Para cada tamanho em lista_tam_navios
	lista_tam_navios.forEach(function(tam, indice){ 

		// cria um elemento HTML input
		var input = document.createElement('input')
		input.type='radio'
		input.id='escolhaNavio'+tam
		input.name='tipo_navio'
		input.value=''+tam

		// se for o primeiroa ser adicionado deixar marcado como padrao
		if(indice == 0)
			input.checked = true

		// add o input na div
		div.appendChild(input)

		// criar o elemento label, que e o texto (rotulo) que aparece pro usuario
		var label = document.createElement('label')
		label.id = input.id+'_nome'
		label.setAttribute("for", 'escolhaNavio'+tam)
		label.innerHTML = 'Navio ('+tam+' casas)'

		// add o label na div
		div.appendChild(label)

		// label de confirmacao que o navio foi inserido
		var label = document.createElement('label')
		label.id = input.id+'_confirmacao'
		label.setAttribute('style', 'color:green')

		// add o label na div
		div.appendChild(label)

		// add um pula linha na div
		div.appendChild(document.createElement('br'))
	})
}

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
			img.onclick = click_mouse;

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
	// Verifica as casas que o navio ira ocupar, pra ve se existem e estao livres

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

	// caso esteja escolhendo o navio pra modifica, nao mostrar um novo_navio
	if(modificar_navio)
		return

	// identificacao das coordenadas onde ocorreu o evento
	var id_cel = this.parentElement.id;
	var coordenadas_cel = id_cel.split(":")[1].split("-");
	var linha = parseInt(coordenadas_cel[0]);
	var coluna = parseInt(coordenadas_cel[1]);

	// identificar qual o tamanho do navio a ser mostrado
	var tam_navio = tamanho_do_navio();

	if(verificarSeNavioInserido(tam_navio)){
		return
	}

	// Limpar tabuleiro (apenas os navios temporarios), caso haja algum navio temporario no tabuleiro
	mostrar_mar();

	// cria um novo navio, que e mostrado ao usuario antes de ser fixado
	novo_navio = new Navio(tam_navio, new Coordenada(linha, coluna), orientacao)

	if(navio_valido(novo_navio)){
		// Se for possivel adicionar o navio nessa posição, mostrar o novo navio ao usuario

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

function configurar_proximo_click_para_modificar_navio() {

	// Caso nao tenha nenhum navio adicionado
	if(lista_navios.length == 0)
		return

	// mostrar uma mensagem pedindo que o usuario escolha o navio
	document.getElementById('aviso_modificar_navio').innerHTML="Selecione o navio a ser modificado."

	modificar_navio = true
}

function click_mouse() {
	// Verifica se o click do mouse vai ser para adicionar ou modificar um navio

	if(modificar_navio)
		alterar_navio(this)
	else
		add_navio()
}

function alterar_navio(casa_tabuleiro) {

	// identificacao das coordenadas onde ocorreu o evento
	var id_cel = casa_tabuleiro.parentElement.id;
	var coordenadas_cel = id_cel.split(":")[1].split("-");
	var linha = parseInt(coordenadas_cel[0]);
	var coluna = parseInt(coordenadas_cel[1]);

	var coord = new Coordenada(linha, coluna)

	// busca o navio que ocupa essa coordenada na lista de navios
	var navio = getNavioPelaPosicao(coord, lista_navios)

	remover_navio(navio)

	// configuracao para que o proximo navio a ser adicionado seja identico ao que foi removido
	setTamanhoNavio(navio.tamanho)
	orientacao = navio.orientacao

	// retira o aviso para escolher um navio para ser modificado
	document.getElementById('aviso_modificar_navio').innerHTML=""

	modificar_navio = false
}

function add_navio() {
	// inicia a mensagem de aviso como vazia
	document.getElementById("aviso").innerHTML = "";

	// identificar qual o tamanho do navio a ser mostrado
	var tam_navio = tamanho_do_navio();

	// Caso não seja possivel add o navio nessa posicao
	if(novo_navio == null){
		if(verificarSeNavioInserido(tam_navio)){
			if(todosNaviosInseridos())
				document.getElementById("aviso").innerHTML = "Todos os navios já foram inseridos, clique em 'Iniciar Jogo'.";
			else
				document.getElementById("aviso").innerHTML = "Já foi inserido um navio de tamanho "+tam_navio+".";	
		}else
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

	addConfirmacaoNavioInserido(novo_navio.tamanho)
	novo_navio = null

	console.log(lista_navios)
}

function desfazer() {
	// Remove o ultimo navio que foi adicionado

	// Caso ainda nao tenha adicionado nenhum navio
	if(lista_navios.length == 0)
		return

	// remover o ultimo navio da lista
	var navio = lista_navios[lista_navios.length-1]

	remover_navio(navio)

	// retira o aviso para escolher um navio para ser modificado (caso haja)
	document.getElementById('aviso_modificar_navio').innerHTML=""
	modificar_navio = false

	document.activeElement.blur()
}

function remover_navio(navio) {
	// remove um navio da lista_navios (é necessário que o objeto navio seja a mesma instancia do elemento que sera removido da lista)

	var indice = lista_navios.indexOf(navio)

	lista_navios.splice(indice,1)

	navio.casas().forEach(function(coord){
		var id = "cel:"+coord.x+"-"+coord.y
		var celula = document.getElementById(id)
		celula.className = "mar"
		celula.getElementsByTagName("img")[0].src = "./imagens/index_mar.png";
	})

	removerConfirmacaoNavioInserido(navio.tamanho)
}

function tamanho_do_navio(){ 
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

function setTamanhoNavio(tamanho) {
	// altera o tamanho do navio a ser adicionado

	var opt_check = document.getElementsByName('tipo_navio')

	var tamanho_existe = false

	for(var i=0; i<opt_check.length; i++){
		if(opt_check[i].value == ''+tamanho){
			opt_check[i].checked = true
			tamanho_existe = true
		}
	}

	if(!tamanho_existe){
		console.log('Erro ao mudar tamanho do navio: '+tamanho+' não é um tamanho válido.')
	}
}

function iniciar_jogo() {

	if(todosNaviosInseridos() == false){
		document.getElementById("aviso").innerHTML = "Insira todos os navios para iniciar o jogo.";
		return
	}

	// gravar navios no cookie
	escrever_cookie();

	// alterar a url da pagina para iniciar o jogo
	window.location = "./jogo.html";
}

function escrever_cookie() {
	// salva em cookie os navios adicionados
	
	lista_navios.forEach(function(navio, indice){
		var casas = "casas:"+navio.tamanho
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

function addConfirmacaoNavioInserido(tamNavio){
	var input = document.getElementById('escolhaNavio'+tamNavio)
	input.disabled = true

	var label_nome = document.getElementById(input.id+'_nome')
	label_nome.setAttribute('style', 'color:gray')

	var label_confirmacao = document.getElementById(input.id+'_confirmacao')
	label_confirmacao.innerHTML = ' OK'

	var prox_tam = selecionarProximoTamanho()
	if(prox_tam != null)
		setTamanhoNavio(prox_tam)
}

function removerConfirmacaoNavioInserido(tamNavio){
	var input = document.getElementById('escolhaNavio'+tamNavio)
	input.disabled = false

	var label_nome = document.getElementById(input.id+'_nome')
	label_nome.setAttribute('style', 'color:black')

	var label_confirmacao = document.getElementById(input.id+'_confirmacao')
	label_confirmacao.innerHTML = ''
}

function verificarSeNavioInserido(tamNavio){
	var inserido = false

	lista_navios.forEach(function(navio){
		if(navio.tamanho == tamNavio)
			inserido = true
	})

	return inserido
}

function todosNaviosInseridos(){
	var naviosInseridos = true

	lista_tam_navios.forEach(function(tamanho){
		if(verificarSeNavioInserido(tamanho) == false)
			naviosInseridos = false
	})

	return naviosInseridos
}

function selecionarProximoTamanho(){
	var tamanho = null

	lista_tam_navios.forEach(function(tam){
		if(!verificarSeNavioInserido(tam) && tamanho == null)
			tamanho = tam
	})

	return tamanho
}