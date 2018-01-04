function Navio(tamanho, coordenadas, orientacao){
	this.tamanho = tamanho // inteiro
	this.coordenadas = coordenadas // array de tamanho 2
	this.orientacao = orientacao // String
	this.casasAtingidas = (new Array(this.tamanho)).fill(false) // array de booleanos indicando quais casas do navio forma atingidas

	// retorna as casas ocupadas por este navio
	this.casas = function(){
		var lista_casas = []
		for (var i = 0; i < this.tamanho; i++) {
			if(this.orientacao == 'vertical')
				lista_casas.push(new Coordenada(this.coordenadas.x, this.coordenadas.y+i))
			else
				lista_casas.push(new Coordenada(this.coordenadas.x+i, this.coordenadas.y))
		}
		return lista_casas
	}

	this.ocupaCasa = function(coord){
		if(this.indiceCasa(coord) == -1)
			return false
		else
			return true
	}

	this.indiceCasa = function(coord){
		var indice = -1
		
		this.casas().forEach(function(casa, index){
			if(coord.equals(casa)){
				indice = index
			}
		})

		return indice
	}

	this.atingiuCasa = function(coord){
		var indice = this.indiceCasa(coord)
		if(indice != -1)
			this.casasAtingidas[ indice ] = true
	}

	this.destruido = function(){
		destruido = true

		this.casasAtingidas.forEach(function(valor){
			if(valor == false)
				destruido = false
		})

		return destruido
	}
}

function Coordenada(x, y){
	this.x = x
	this.y = y

	this.equals = function(coord){
		return (this.x == coord.x && this.y == coord.y)		
	}
}

function getNavioPelaPosicao(coord, lista_navios) {
	// busca o navio que ocupa essa coordenada na lista_navios

	var navio_procurado = null

	lista_navios.forEach(function(navio){
		if(navio.ocupaCasa(coord))
			navio_procurado = navio
	})

	return navio_procurado
}