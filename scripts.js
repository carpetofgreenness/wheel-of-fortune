var quoteArray = [];

function Quote(lyrics,artist,songName,array) {
	this.lyrics = lyrics;
	this.artist = artist;
	this.songName = songName;
	array.push(this)
}

quote1 = new Quote("All lies and jest, still, a man hears what he wants to hear and disregards the rest.", "Simon and Garfunkel", "The Boxer",quoteArray)
quote2 = new Quote("All you need is love, love. Love is all you need.","The Beatles", "All You Need Is Love",quoteArray)
quote3 = new Quote("And in the end, the love you take is equal to the love you make.", "The Beatles", "The End",quoteArray)
quote4 = new Quote("Don't ask me what I think of you, I might not give the answer that you want me to.", "Fleetwood Mac", "Oh Well",quoteArray)
quote5 = new Quote("Freedom's just another word for nothing left to lose. Nothing ain't nothing, but it's free.","Kris Kristofferson; Janis Joplin", "Me And Bobby McGee",quoteArray)

// var myGame = new Game(quoteArray[getRandomInt(0,quoteArray.len
var letterArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]



//make a game function. it takes a string makes it a game
function Game(quoteArray) {
	this.quoteArray = quoteArray
	this.player1 = new Player(1)
	this.player2 = new Player(2)
	this.active = this.player1
	this.letters = new Letters()

	this.startGame = function() {
		this.player1.zeroPoints();
		this.player2.zeroPoints();
		var quoteIndex = getRandomInt(0,quoteArray.length)
		quoteObject = quoteArray[quoteIndex]
		gameString = quoteObject.lyrics
		quoteArray.splice(quoteIndex,1)
		this.answerArray = gameString.split(""); //make an answerArray
		this.answerArrayLC = this.answerArray.map(function(x) {
			return x.toLowerCase()
		}) //make a LC version for comparison
		this.playerArray = this.answerArray.map(function(element) { return element.match(/[a-z]/i) ? "?" : element}) //turns letters to question marks
		this.wrongArray = []; //collects incorrect guesses
		this.gameboard = new Board(this.answerArray);
		this.gameboard.initialize()
		this.letters.initialize();
		$(".form-control").val("")
		$(".artist").text("Artist: " + quoteObject.artist)
		$(".song").text("Song Title: " + quoteObject.songName)
		this.hintIndex = 0;
	}

	this.playRound = function(points) {
		this.active.scorePoints(points)
		// this.active = (this.active.playerNumber==1 ? this.player1 : this.player2)
		if (this.active.playerNumber == 1) {
			this.active = this.player2
		} else {
			this.active = this.player1
		}
		this.checkWinner();
		this.player1.changeTurn()
		this.player2.changeTurn()
	}

	this.playLetter = function(letter,game) {
		// this.optionsArray.splice(this.optionsArray.indexOf(letter),1);
		// console.log(this.answerArrayLC)
		if (this.answerArrayLC.includes(letter)) {
			var indices = []
			var idx = this.answerArrayLC.indexOf(letter);
			
			while (idx != -1) { //when indexOf gets nothing, returns -1
			  indices.push(idx); //add idx to the index list
			  idx = this.answerArrayLC.indexOf(letter, idx + 1); //go to the next index. will get -1 if this was the last
			}

			// console.log(indices)

			for (var i=0; i<indices.length; i++) {
				this.playerArray[indices[i]] = this.answerArrayLC[indices[i]]
				this.gameboard.update(indices[i])
			}
			this.playRound(indices.length*10)
		} else {
			this.wrongArray.push(letter)
			this.letters.addIncorrect(letter)
			this.playRound(0)
		}
	}

	this.solve = function(guessString) {
		// console.log(guessString.toLowerCase().replace(/[^a-zA-Z ]/g, ""))
		// console.log(gameString.toLowerCase().replace(/[^a-zA-Z ]/g, ""))
		if (guessString.toLowerCase().replace(/[^a-zA-Z ]/g, "") == gameString.toLowerCase().replace(/[^a-zA-Z ]/g, "")) {
			alert("correct!")
			this.playRound(50);
			for (var i=0; i<this.answerArrayLC.length; i++) {
				this.playerArray[i] = this.answerArrayLC[i]
				this.gameboard.update(i)
			}
		}
		else {
			alert("sorry, that is incorrect")
			this.playRound(-50)
		}
		this.checkWinner();
	}

	this.checkWinner = function() {
		if (this.playerArray.join("").toLowerCase().replace(/[^a-zA-Z ]/g, "") == this.answerArrayLC.join("").toLowerCase().replace(/[^a-zA-Z ]/g, "")) {
			var winner = (this.player1.score > this.player2.score ? this.player1 : this.player2)
			alert("player "+winner.playerNumber+" wins!")
			winner.isWinner();
			this.startGame();
		}
	}

	this.showHint = function() {
		if (this.hintIndex == 0) {
			$(".artist-well").show();
			this.hintIndex ++;
			this.active.scorePoints(-10)
		} else if (this.hintIndex == 1) {
			$(".song-well").show();
			this.hintIndex ++;
			this.active.scorePoints(-10)
			$(".btn-info").addClass("btn-default")
			$(".btn-default").removeClass("btn-info")
		}
	}
}

function Board(answerArray) {
	this.answerArray = answerArray

	this.initialize = function() {
		var htmlString = "<div class='word'>"
		for (var i=0; i<answerArray.length; i++) {
			htmlString += "<div class='slot "
			htmlString += (answerArray[i]==" " ? "space" : "letter") //either a space or a letter
			htmlString += "' id='index-" + i + "'>"
			htmlString += (answerArray[i].match(/[a-z]/i) ? " " : answerArray[i]) //if not a letter, place in div
			htmlString +="</div>"
			if (answerArray[i]==" ") {
				htmlString += "</div><div class='word'>"
			}
		}
		htmlString += "</div>"
		$("#gameboard").html(htmlString);
	}

	this.update = function(index) {
		var idString = "#index-" + index
		$(idString).text(this.answerArray[index])
		// console.log(idString)
		// console.log(this.answerArray[index])
	}
	
}

function Letters() {

	this.initialize = function() {
		var htmlLetterString = ""
		for (var i=0; i<letterArray.length; i++) {
			htmlLetterString += "<div class='letter slot guessletter' id='guess-letter-" + letterArray[i] + "'>" + letterArray[i] + "</div>"
		}
		$("#options").html(htmlLetterString)

		$(".guessletter").click(function() {
			var clickedLetter = $( event.target ).text()
			myGame.playLetter(clickedLetter);
			$("#guess-letter-"+clickedLetter).hide();
		})
		$("#guesses").html("");
	}

	this.addIncorrect = function(letter) {
		htmlLetterString = "<div class='letter'>" + letter + "</div>"
		$("#guesses").append(htmlLetterString);
	}
}



function Player(number) {
	this.playerNumber = number;
	this.score = 0;
	this.turn = (number%2 == 1);
	this.wins = 0;

	this.isWinner = function() {
		this.wins++;
		$("#wins"+this.playerNumber).text(this.wins)
	}

	this.scorePoints = function(pointsGained) {
		this.score += pointsGained;
		$("#points"+this.playerNumber).text(this.score)
	}

	this.changeTurn = function() {
		this.turn = (this.turn ? false : true);
		if (this.turn) {
			$("#p"+this.playerNumber).addClass("active")
			$(".btn"+this.playerNumber).css('visibility','visible');
		} else {
			$("#p"+this.playerNumber).removeClass("active")
			$(".btn"+this.playerNumber).css('visibility','hidden');
		}
		$(".solve-well").hide();
	}

	this.zeroPoints = function() {
		this.score = 0;
		$("#points"+this.playerNumber).text(this.score)
	}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


$("form").submit(function (e) {
    e.preventDefault();
    myGame.solve($("#guessInput").val());
});

$(".btn-danger").click(function(){
	$(".solve-well").show();
	document.getElementById("guessInput").focus();
})

$(".btn-info").click(function() {
	myGame.showHint();
})

myGame = new Game(quoteArray);
myGame.startGame();