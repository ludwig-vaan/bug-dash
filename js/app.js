// Player class with ES6 syntax
class Player {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
		// default sprite
		this.sprite = `images/char-horn-girl.png`;
		this.collisionSprite = `images/char-horn-girl-collision.png`;
		this.winSprite = `images/char-horn-girl-winning.png`;
		// png size in px
		this.height = 85;
		this.width = 75;

		this.collision = false;
		this.restart = false;

		this.score = 0;
		this.life = 5;

		this.highScore = [];

		// Sounds
		this.stepPlayer = new Audio();
		this.winPlayer = new Audio();
		this.stepSound = "assets/audio/sfx_movement_footsteps5.wav";
		this.winSound = "assets/audio/BANK_00_INSTR_0008_SND_0019.wav";

		this.gameOver = false;
		this.endSprite = "images/end-game.png";
	}
	update(dt) {
		// You should multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
	}

	render() {
		if (!this.collision && !this.restart && !this.end) {
			// there is no collision with a bug
			// & player didn't reach water
			// & player's life > 0
			ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		} else if (this.end) {
			// player's life = 0
			ctx.drawImage(Resources.get(this.endSprite), 0, 0);
		} else if (this.restart) {
			// player reach water
			ctx.drawImage(Resources.get(this.winSprite), this.x, this.y);
		} else {
			// there is a collision with a bug
			ctx.drawImage(Resources.get(this.collisionSprite), this.x, this.y);
		}
	}

	// manage player's move with arrow keyboard input
	// & play a step sound
	handleInput(key) {
		this.stepPlayer.src = this.stepSound;
		switch (key) {
			case "left":
				if (this.x > 0 && !this.collision) {
					this.stepPlayer.load();
					this.stepPlayer.pause();
					this.stepPlayer.currentTime = 0;
					this.stepPlayer.play();
					this.x -= 101;
				}
				break;
			case "right":
				if (this.x < 304 && !this.collision) {
					this.stepPlayer.load();
					this.stepPlayer.pause();
					this.stepPlayer.currentTime = 0;
					this.stepPlayer.play();
					this.x += 101;
				}
				break;
			case "up":
				if (this.y > 0 && !this.collision) {
					this.stepPlayer.load();
					this.stepPlayer.pause();
					this.stepPlayer.currentTime = 0;
					this.stepPlayer.play();
					this.y -= 83;
				}
				// collision water case
				if (this.y < 0 && !this.restart) {
					this.win();
				}
				break;
			case "down":
				if (this.y < 400 && !this.collision) {
					this.stepPlayer.load();
					this.stepPlayer.pause();
					this.stepPlayer.currentTime = 0;
					this.stepPlayer.play();
					this.y += 83;
				}
				break;
			default:
				return;
		}
	}

	// If the player reaches the water the game should be reset
	// by moving the player back to the initial location

	// collision with a bug
	resetPosition() {
		this.collision = true;
		this.resetGame();
		setTimeout(() => {
			this.x = 202;
			this.y = 405;
			this.collision = false;
		}, 550);
	}

	// player reach the water
	win() {
		this.restart = true;
		this.winPlayer.src = this.winSound;
		this.winPlayer.load();
		this.winPlayer.play();

		// increment the score
		document.querySelector("#score").innerHTML = ++this.score;

		// reset the player position
		setTimeout(() => {
			this.x = 202;
			this.y = 405;
			this.restart = false;
		}, 350);
	}

	resetGame() {
		// decrement life & display non-solid heart
		this.life -= 1;
		if (this.life >= 0) {
			let hp = document.querySelector(".fas");
			hp.firstElementChild.className = "far fa-heart";
			hp.className = "far";
		}

		// end of a game, display a message
		// save the score
		// & reset enemies positions, score and life
		if (this.life === 0) {
			document.querySelector("#snackBar").innerHTML = "YOU LOSE !";
			this.highScore.push(this.score);
			document.querySelector("#top").innerHTML = this.highScore.join(
				", "
			);
			this.gameOver = true;
			setTimeout(() => {
				this.gameOver = false;
				bug_1 = new Enemy(-101, 60, 150);
				bug_2 = new Enemy(-101, 142, 100);
				bug_3 = new Enemy(-101, 224, 75);

				allEnemies = [bug_1, bug_2, bug_3];
				this.score = 0;
				this.life = 5;
				document.querySelector("#snackBar").innerHTML = "";

				let heart = document.querySelector(".heart");

				// rebuild heart
				heart.innerHTML = "";
				for (let index = 0; index < this.life; index++) {
					let li = document.createElement("li");
					li.setAttribute("class", "fas");
					let i = document.createElement("i");
					i.setAttribute("class", "fas fa-heart");
					li.appendChild(i);
					heart.appendChild(li);
				}
				document.querySelector("#score").innerHTML = this.score;
			}, 3000);
		}
	}
}

// Enemies our player must avoid
// use ES5 OOP
var Enemy = function(x = -101, y = 0, speed = 100) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = "images/enemy-bug.png";
	// position for our enemies
	this.x = x;
	this.y = y;
	this.speed = speed;
	// bug size in px
	this.height = 66;
	this.width = 99;
	this.enemyAudio = new Audio();
	this.collisionSound = "assets/audio/sfx_sounds_falling3.wav";
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, witdh) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.

	// If the enemy's position is out of canvas, restart
	// position with a new speed :)
	if (this.x > witdh) {
		this.x = -101;
		this.speed = Math.random() * 250 + 15 * player.score + 50;
	} else {
		this.x += this.speed * dt;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	if (!player.end) ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.collision = function() {
	// Handles collision with the Player
	if (
		player.x < this.x + 80 &&
		player.x + 80 > this.x &&
		player.y < this.y + 60 &&
		60 + player.y > this.y &&
		!player.collision
	) {
		this.enemyAudio.src = this.collisionSound;
		this.enemyAudio.play();
		player.resetPosition();
	}
};

// Now instantiate your objects
// Place the player object in a variable called player
const player = new Player(202, 405);
// const player = new Player(0, 0);

// Place all enemy objects in an array called allEnemies
let bug_1 = new Enemy(-101, 60, 150);
let bug_2 = new Enemy(-101, 142, 100);
let bug_3 = new Enemy(-101, 224, 75);

let allEnemies = [bug_1, bug_2, bug_3];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
	var allowedKeys = {
		37: "left",
		38: "up",
		39: "right",
		40: "down"
	};

	player.handleInput(allowedKeys[e.keyCode]);
});

// Returns static NodeList of li elements in (ul with) class .char-selector
const characters = document.querySelectorAll(".char-selector li");

// Iterate through li elements, adding event listener for each. When clicked the text from p (with attribute hidden) in li item will be passed to setSprite method in Player class (causing character to change accordingly) and game will be reset
characters.forEach(character => {
	character.addEventListener("click", () => {
		// Set sprite from user selection
		player.sprite = character.querySelector("img").getAttribute("src");
		player.defaultSprite = player.sprite.substr(
			0,
			player.sprite.length - 4
		);
		player.collisionSprite = `${player.defaultSprite}-collision.png`;
		player.winSprite = `${player.defaultSprite}-winning.png`;
	});
});
