// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
		this.sprite = "images/char-horn-girl.png";
		this.collisionSprite = "images/char-horn-girl-collision.png";
		this.winSprite = "images/char-horn-girl-winning.png";
		// png size in px
		this.height = 85;
		this.width = 75;
		this.touch = false;
		this.winner = false;
		this.score = 0;
		this.life = 5;
		this.top = [];
		this.audio = new Audio();
		this.step = "assets/audio/sfx_movement_footsteps5.wav";
		this.winningSound = "assets/audio/BANK_00_INSTR_0008_SND_0019.wav";
	}
	update(dt) {
		// You should multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
		// Handles collision with bugs
	}

	render() {
		if (!this.touch && !this.winner) {
			ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		} else if (this.winner) {
			ctx.drawImage(Resources.get(this.winSprite), this.x, this.y);
		} else {
			ctx.drawImage(Resources.get(this.collisionSprite), this.x, this.y);
		}
	}

	handleInput(key) {
		this.audio.src = this.step;
		switch (key) {
			case "left":
				if (this.x > 0 && !this.touch) {
					this.audio.play();
					this.x -= 101;
				}
				break;
			case "right":
				if (this.x < 304 && !this.touch) {
					this.audio.play();
					this.x += 101;
				}
				break;
			case "up":
				if (this.y > 0 && !this.touch) {
					this.audio.play();
					this.y -= 83;
				}
				// touch water case
				if (this.y < 0 && !this.winner) {
					this.win();
				}
				break;
			case "down":
				if (this.y < 400 && !this.touch) {
					this.audio.play();
					this.y += 83;
				}
				break;
			default:
				return;
		}
	}

	// If the player reaches the water the game should be reset
	// by moving the player back to the initial location
	// (you can write a separate reset Player method to handle that).
	resetPosition() {
		this.touch = true;
		this.startPosition();
		setTimeout(() => {
			this.x = 202;
			this.y = 405;
			this.touch = false;
		}, 350);
	}

	win() {
		this.winner = true;
		this.audio.src = this.winningSound;
		this.audio.play();
		document.querySelector("#score").innerHTML = ++this.score;
		setTimeout(() => {
			this.x = 202;
			this.y = 405;
			this.winner = false;
		}, 350);
	}

	startPosition() {
		this.life -= 1;
		if (this.life >= 0) {
			let hp = document.querySelector(".fas");
			hp.firstElementChild.className = "far fa-heart";
			hp.className = "far";
		}
		if (this.life === 0) {
			document.querySelector("#score").innerHTML = "YOU LOSE !";
			this.top.push(this.score);
			document.querySelector("#top").innerHTML = this.top.join(", ");
			bug_1 = new Enemy(-101, 60, 150);
			bug_2 = new Enemy(-101, 142, 100);
			bug_3 = new Enemy(-101, 224, 75);

			allEnemies = [bug_1, bug_2, bug_3];
			setTimeout(() => {
				this.score = 0;
				this.life = 5;

				let heart = document.querySelector(".heart");
				// delete old
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
			}, 1000);
		}
	}
}

// Enemies our player must avoid
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
	// Updates the Enemy location
	// ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.collision = function() {
	// Handles collision with the Player
	if (
		player.x < this.x + 80 &&
		player.x + 80 > this.x &&
		player.y < this.y + 60 &&
		60 + player.y > this.y &&
		!player.touch
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
	});
});
