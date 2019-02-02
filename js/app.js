const CollectiblesLocation = [
    [10, 107],
    [111, 107],
    [212, 107],
    [313, 107],
    [414, 107],
    [10, 190],
    [111, 190],
    [212, 190],
    [313, 190],
    [414, 190],
    [10, 275],
    [111, 275],
    [212, 275],
    [313, 275],
    [414, 275],
];
let gem, heart, key, star;
let player;
let bloodObject;
const heartCountElement = document.querySelector('.game-hearts');
const gemCountElement = document.querySelector('.gem-count');
const minutesElement = document.querySelector('.minutes');
const secondsElement = document.querySelector('.seconds');
const levelCountElement = document.querySelector('.level-count');
const scoreCountElement = document.querySelector('.score-count');
const modalHeading = document.querySelector('.modal-heading');
const modalScoreHeading = document.querySelector('.modal-score-heading');
const modalLevel = document.querySelector('.modal-level');
const modalScore = document.querySelector('.modal-score');
const modalGemCollected = document.querySelector('.modal-gem-collected');
const modalTimer = document.querySelector('.modal-timer');
const modalButton = document.querySelector('.modal-button');
const canvasGame = document.querySelector(".game-container");
const scorePanel = document.querySelector(".score-panel");
const scorePanel2 = document.querySelector(".score-panel2");
const gameOverSound = new Audio('sound/jingle-Lose.mp3');
const gameWinSound = new Audio('sound/jingle-win.mp3');
const collectSound = new Audio('sound/collect-point.mp3');
const killSound = new Audio('sound/explosion.mp3');
const gameMusic = new Audio('sound/battle-theme.mp3');
let totalSeconds = 0;
let gameTimer;

collectSound.preload = 'auto';
killSound.preload = 'auto';
gameOverSound.preload = 'auto';
gameWinSound.preload = 'auto';
gameMusic.preload = 'auto';

// Enemies our player must avoid
class Enemy {
    constructor(x, y) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        const enemyLinks = ['images/enemy-bug.png', 'images/enemy-bug2.png', 'images/enemy-bug3.png'];
        let randomEnemyLinkIndex = randomCollectibles(0, 3);
        this.sprite = enemyLinks[randomEnemyLinkIndex];
        this.x = x;
        this.y = y;
        this.xPoint = x;
        this.yPoint = y;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        if (this.x === -100) {
            allEnemies.forEach(function (enemyV) {
                let minSpeed = 100 * player.gameLevel;
                let maxSpeed = 200 * player.gameLevel;
                enemyV.speed = randomCollectibles(minSpeed, maxSpeed);
            });
        }

        this.x = this.x + (this.speed * dt);
        //reset enemy's position
        if (this.x >= 500) {
            this.resetPosition();
        }
    }

    //reset position for enemy
    resetPosition() {
        this.x = this.xPoint;
        this.y = this.yPoint;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(x, y, link) {
        this.x = x;
        this.y = y;
        this.sprite = link;
        this.gemsCollected = 0;
        this.life = 5;
        this.gameLevel = 1;
        this.reachToWaterCount = 0;
    }

    update() {

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(allowedKeys) {
        if (allowedKeys === 'left' && this.x > 0) {
            this.x -= 100;
        }
        if (allowedKeys === 'right' && this.x < 400) {
            this.x += 100;
        }
        if (allowedKeys === 'up' && this.y > 0) {
            this.y -= 85;
        }
        if (allowedKeys === 'down' && this.y < 400) {
            this.y += 85;
        }
        if (player.y < 0) {
            this.resetPosition();
            player.reachToWaterCount += 1;
            star = new Star(this.gameLevel * 40);
            updateScore();
            setTimeout(function () {
                star.hide();
            }, 1000);
        }
    }

    collectGems() {
        this.gemsCollected += 1;
        collectSound.play();
        gemCountElement.innerHTML = (this.gemsCollected < 10) ? `0${this.gemsCollected}` : `${this.gemsCollected}`;
        star = new Star(this.gameLevel * 10);
        updateScore();
        setTimeout(function () {
            star.hide();
        }, 1000);

    }

    collectHearts() {
        if (this.life < 5) {
            this.life += 1;
        }
        collectSound.play();
        lifeCounter(this.life);
    }

    collectKeys() {
        if (this.gameLevel < 5) {
            this.gameLevel += 1;
            levelCountElement.textContent = this.gameLevel;
            updateScore();
            collectSound.play();

        }
    }

    hide() {
        this.x = -300;
        this.y = -300;
    }

    killedByEnemy() {
        if (this.life > 0) {
            this.life -= 1;
        }
        killSound.play();
        lifeCounter(this.life);
        if (this.life === 0) {
            showModal(this.gameLevel, this.gemsCollected, this.reachToWaterCount);
        }
    }

    resetPosition() {
        this.x = 200;
        this.y = 400;
    }
}


class Gems {
    constructor() {
        const gemLinks = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'];
        let randomGemLocationIndex = randomCollectibles(0, CollectiblesLocation.length);
        let randomGemLinkIndex = randomCollectibles(0, 3);
        this.x = CollectiblesLocation[randomGemLocationIndex][0];
        this.y = CollectiblesLocation[randomGemLocationIndex][1];
        this.sprite = gemLinks[randomGemLinkIndex];
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
    }

    update() {

    }

    hide() {
        this.x = -500;
        this.y = -500;
    }

}

class Blood {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/blood2.png';
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 100, 120);
    }

    hide() {
        this.x = -100;
        this.y = -100;
    }

}

class Heart {
    constructor() {
        let randomHeartLocationIndex = randomCollectibles(0, CollectiblesLocation.length);
        this.x = CollectiblesLocation[randomHeartLocationIndex][0];
        this.y = CollectiblesLocation[randomHeartLocationIndex][1];
        this.sprite = 'images/heart.png';
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
    }

    hide() {
        this.x = -700;
        this.y = -700;
    }
}

class Key {
    constructor() {
        let randomKeyLocationIndex = randomCollectibles(0, CollectiblesLocation.length);
        this.x = CollectiblesLocation[randomKeyLocationIndex][0];
        this.y = CollectiblesLocation[randomKeyLocationIndex][1];
        this.sprite = 'images/key.png';
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
    }

    hide() {
        this.x = -900;
        this.y = -900;
    }
}

class Star {
    constructor(score) {
        this.x = 200;
        this.y = 0;
        this.sprite = 'images/star.png';
        this.score = score;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.font = 'bold 30px serif';
        ctx.fillStyle = 'brown';
        ctx.fillText(`+${this.score}`, this.x + 20, this.y + 115);
        ctx.fill();

    }

    hide() {
        this.x = -400;
        this.y = -400;
    }

}

class Modal {
    constructor(overlay, level, gemCollected, reachToWater) {
        this.overlay = overlay;
        modalButton.addEventListener('click', this.close.bind(this));
        overlay.addEventListener('click', e => {
            if (e.srcElement.id === this.overlay.id) {
                this.close();
                resetGame();
            }
        });
        if (level > 4 && reachToWater > 10) {
            modalHeading.textContent = `Congratulation You Won Game`;
            gameWinSound.play();
        } else {
            modalHeading.textContent = `Game Over`;
            gameOverSound.play();
        }
        modalScoreHeading.textContent = ``;
        modalLevel.textContent = `You reached to level ${level} `;
        modalScore.innerHTML = `with Final score ${scoreCountElement.textContent}`;
        modalGemCollected.innerHTML = `You collect ${gemCollected} <i class="fa fa-lg fa-diamond"></i>`;
        modalTimer.innerHTML = `in Time <i class="fa fa-lg fa-clock-o"></i> ${minutesElement.textContent}:${secondsElement.textContent}`
    }

    open() {
        this.overlay.classList.remove('disabled');
    }

    close() {
        this.overlay.classList.add('disabled');
    }
}

function lifeCounter(life) {
    switch (life) {
        case 5:
            heartCountElement.innerHTML = '<i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i>';
            break;
        case 4:
            heartCountElement.innerHTML = '<i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart-o"></i>';
            break;
        case 3:
            heartCountElement.innerHTML = '<i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i>';
            break;
        case 2:
            heartCountElement.innerHTML = '<i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i>';
            break;
        case 1:
            heartCountElement.innerHTML = '<i class="fa fa-lg fa-heart"></i><i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i>';
            break;
        case 0:
            heartCountElement.innerHTML = '<i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i><i class="fa fa-lg fa-heart-o"></i>';
            break;
    }
}

function randomCollectibles(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function startGame() {
    let choosePlayerContainer = document.querySelector('.choose-player');
    choosePlayerContainer.style.display = 'none';
    canvasGame.style.display = 'inline-block';
    scorePanel.style.display = 'flex';
    scorePanel2.style.display = 'flex';
    gameTimer = setInterval(setTime, 1000);
    gameMusic.play();
    gameMusic.volume=0.2;
    gameMusic.loop = true;
}

function showModal(level, gemCollected, reachToWater) {
    const modal = new Modal(document.querySelector('.modal'), level, gemCollected, reachToWater);
    window.openModal = modal.open.bind(modal);
    window.openModal();
    clearInterval(gameTimer);
    gameMusic.pause();
    gameMusic.currentTime = 0;
    canvasGame.style.display = 'none';
    scorePanel.style.display = 'none';
    scorePanel2.style.display = 'none';

}

function resetGame() {
    window.location.reload(false);
}

function updateScore() {
    scoreCountElement.textContent = ((player.gemsCollected * 10) + (player.reachToWaterCount * 40)) * player.gameLevel;
}

// Timer from stackoverflow, https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
function setTime() {
    ++totalSeconds;
    secondsElement.innerHTML = pad(totalSeconds % 60);
    minutesElement.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    let valString = val + '';
    if (valString.length < 2) {
        return '0' + valString;
    } else {
        return valString;
    }
}

// Now instantiate your objects.
let enemy1 = new Enemy(-100, 225);
let enemy2 = new Enemy(-300, 140);
let enemy3 = new Enemy(-500, 60);
bloodObject = new Blood(-300, 800);
gem = new Gems();
heart = new Heart();
heart.hide();
key = new Key();
key.hide();
star = new Star(0);
star.hide();
player = new Player(200, 400, 'images/char-boy.png');
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
allEnemies.push(enemy1, enemy2, enemy3);
// Place the player object in a ;variable called player


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

let playerList = document.querySelector('.players-list');
playerList.addEventListener('click', function (evt) {
    if (evt.target.nodeName === 'IMG') {
        let characterVariable = evt.target.className;
        let characterLink;
        switch (characterVariable) {
            case 'char-boy':
                characterLink = 'images/char-boy.png';
                break;
            case 'char-cat':
                characterLink = 'images/char-cat-girl.png';
                break;
            case 'char-horn':
                characterLink = 'images/char-horn-girl.png';
                break;
            case 'char-pink':
                characterLink = 'images/char-pink-girl.png';
                break;
            case 'char-princess':
                characterLink = 'images/char-princess-girl.png';
                break;
        }
        player = new Player(200, 400, characterLink);
        startGame();

    }
});





