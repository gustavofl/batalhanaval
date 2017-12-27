function Navio(tamanho, coordenadas, orientacao){
	this.tamanho = tamanho // inteiro
	this.coordenadas = coordenadas // array de tamanho 2
	this.orientacao = orientacao // String

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

	this.colisaoCasa = function(coord){
		var colide = false

		this.casas().forEach(function(casa){
			if(casa.equals(coord))
				colide = true
		})

		return colide
	}
}

function Coordenada(x, y){
	this.x = x
	this.y = y

	this.equals = function(coord){
		return (this.x == coord.x && this.y == coord.y)		
	}
}