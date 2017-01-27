
//make a game function. it takes a string makes it a game
function Game(gameString) {
	this.answerArray = gameString.split(""); //make an answerArray
	this.playerArray = this.answerArray.map(function(element) { return "?"})
	// this.optionsArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
	this.wrongArray = [];
	this.gameboard = new Board(this.answerArray);
	this.gameboard.initialize()

	this.playLetter = function(letter) {
		// this.optionsArray.splice(this.optionsArray.indexOf(letter),1);
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
			updateIncorrect(letter)
		}
	}

	this.playLetter(" ")
	// console.log(this.playerArray)
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

var myGame = new Game("i heard words i never heard in the bible")
var letterArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

function makeLetterArray() {
	var htmlLetterString = ""
	for (var i=0; i<letterArray.length; i++) {
		htmlLetterString += "<div class='letter' id='guess-letter-" + letterArray[i] + "'>" + letterArray[i] + "</div>"
	}
	$("#options").html(htmlLetterString)

	$(".letter").click(function() {
		var clickedLetter = $( event.target ).text()
		myGame.playLetter(clickedLetter);
		$("#guess-letter-"+clickedLetter).hide();
	})
}

function updateIncorrect(letter) {
	htmlLetterString = "<div class='letter'>" + letter + "</div>"
	$("#guesses").append(htmlLetterString);
}

makeLetterArray();

