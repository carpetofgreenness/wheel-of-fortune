
//make a game function. it takes a string makes it a game
function Game(gameString) {
	this.answerArray = gameString.split(""); //make an answerArray
	this.playerArray = this.answerArray.map(function(element) { return "?"})
	this.optionsArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
	this.wrongArray = [];
	this.gameboard = new Board(this.answerArray);
	this.gameboard.initialize()

	this.playLetter = function(letter) {
		if (this.answerArray.includes(letter)) {
			var indices = []
			var idx = this.answerArray.indexOf(letter);
			
			while (idx != -1) {
			  indices.push(idx);
			  idx = this.answerArray.indexOf(letter, idx + 1);
			}

			for (var i=0; i<indices.length; i++) {
				this.playerArray[indices[i]] = this.answerArray[indices[i]]
				this.gameboard.update(indices[i])
			}
		} else {
			this.wrongArray.push(letter)
		}
	}

	this.playLetter(" ")
	console.log(this.playerArray)
}

function Board(answerArray) {
	this.answerArray = answerArray

	this.initialize = function() {
		var htmlString = ""
		for (var i=0; i<answerArray.length; i++) {
			htmlString += "<div class='slot " + (answerArray[i]==" " ? "space" : "letter") + "' id='index-" + i + "'></div>"
		}
		$("#gameboard").html(htmlString);
	}

	this.update = function(index) {
		var idString = "#index-" + index
		$(idString).text(this.answerArray[index])
		// console.log(idString)
		// console.log(this.answerArray[index])
	}
	
}

var myGame = new Game("hello darkness my old friend")