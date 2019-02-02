// Create a list that holds all of possible location for Collectibles
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
// declaring objects for player, blood and collectibles
let gem, heart, key, star, player, bloodObject;

// declaring and initialize game container canvas element
const canvasGame = document.querySelector('.game-container');

// declaring and initialize score panel elements
const scorePanel = document.querySelector('.score-panel');
const scorePanel2 = document.querySelector('.score-panel2');
const heartCountElement = document.querySelector('.game-hearts');
const gemCountElement = document.querySelector('.gem-count');
const minutesElement = document.querySelector('.minutes');
const secondsElement = document.querySelector('.seconds');
const levelCountElement = document.querySelector('.level-count');
const scoreCountElement = document.querySelector('.score-count');

// declaring and initialize modal elements
const modalHeading = document.querySelector('.modal-heading');
const modalLevel = document.querySelector('.modal-level');
const modalScore = document.querySelector('.modal-score');
const modalGemCollected = document.querySelector('.modal-gem-collected');
const modalTimer = document.querySelector('.modal-timer');
const modalButton = document.querySelector('.modal-button');

// Game Timer
let totalSeconds = 0;
let gameTimer;

// declaring and initialize Game Sound
const gameOverSound = new Audio('sound/jingle-Lose.mp3');
const gameWinSound = new Audio('sound/jingle-win.mp3');
const collectSound = new Audio('sound/collect-point.mp3');
const killSound = new Audio('sound/explosion.mp3');
const gameMusic = new Audio('sound/battle-theme.mp3');

/*
 * preload attribute with auto value Indicates that the whole audio file
 * can be downloaded, even if the user is not expected to use it.
 */
collectSound.preload = 'auto';
killSound.preload = 'auto';
gameOverSound.preload = 'auto';
gameWinSound.preload = 'auto';
gameMusic.preload = 'auto';


/** Class representing a enemy. */
class Enemy {
    /**
     * @constructor Create enemy
     * @param {number} x - The x coordinate where to place the enemy image on the canvas
     * @param {number} y - The y coordinate where to place the enemy image on the canvas
     */
    constructor(x, y) {
        this.sprite = 'images/enemy-bug.png';
        this.x = x;
        this.y = y;
        this.xPoint = x;
        this.yPoint = y;
    }

    /**
     * @description Update the enemy's position
     * @param {number} dt - the time delta to be used for smooth animation
     */
    update(dt) {
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

    /**
     * @description Reset the enemy's position
     * and do random change type of enemy
     */
    resetPosition() {
        this.x = this.xPoint;
        this.y = this.yPoint;
        const enemyLinks = ['images/enemy-bug.png', 'images/green-enemy-bug.png', 'images/enemy-bug3.png'];
        let randomEnemyLinkIndex = randomCollectibles(0, 3);
        this.sprite = enemyLinks[randomEnemyLinkIndex];
    }

    /**
     * @description Draw the enemy on the screen
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}


/** Class representing a player. */
class Player {
    /**
     * @constructor Create player
     * @param {number} x - The x coordinate where to place the player image on the canvas
     * @param {number} y - The y coordinate where to place the player image on the canvas
     * @param {string} link - file path for player character image
     */
    constructor(x, y, link) {
        this.x = x;
        this.y = y;
        this.sprite = link;
        this.gemsCollected = 0;
        this.life = 5;
        this.gameLevel = 1;
        this.reachToWaterCount = 0;
    }

    /**
     * @description Draw the player on the screen.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
     * @description handle input for control player movement direction
     * @param {string} allowedKeys - keys from keyboard that used for control player
     */
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

    /**
     * @description invoked when player collect gems to calculate no of gems collected
     * play sound for collecting
     */
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

    /**
     * @description invoked when player collect heart to update no of player lives
     * play sound for collecting
     */
    collectHearts() {
        if (this.life < 5) {
            this.life += 1;
        }
        collectSound.play();
        lifeCounter(this.life);
    }

    /**
     * @description invoked when player collect key to update game level variable
     * play sound for collecting
     */
    collectKeys() {
        this.gameLevel += 1;
        levelCountElement.textContent = this.gameLevel;
        updateScore();
        collectSound.play();
        if (this.gameLevel === 6) {
            showModal(this.gameLevel, this.gemsCollected);
        }
    }

    /**
     * @description used to hide player
     */
    hide() {
        this.x = -300;
        this.y = -300;
    }

    /**
     * @description invoked when enemy collide player to update no of player lives.
     * play sound for killed
     */
    killedByEnemy() {
        if (this.life > 0) {
            this.life -= 1;
        }
        killSound.play();
        lifeCounter(this.life);
        if (this.life === 0) {
            showModal(this.gameLevel,this.gemsCollected);
        }
    }

    /**
     * @description Reset the player's position
     */
    resetPosition() {
        this.x = 200;
        this.y = 400;
    }
}


/** Class representing a Gems */
class Gems {
    /**
     * @constructor Create a gem
     */
    constructor() {
        const gemLinks = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'];
        let randomGemLocationIndex = randomCollectibles(0, CollectiblesLocation.length);
        let randomGemLinkIndex = randomCollectibles(0, 3);
        this.x = CollectiblesLocation[randomGemLocationIndex][0];
        this.y = CollectiblesLocation[randomGemLocationIndex][1];
        this.sprite = gemLinks[randomGemLinkIndex];
    }

    /**
     * @description Draw a gem on the screen.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
    }

    /**
     * @description used to hide gem
     */
    hide() {
        this.x = -500;
        this.y = -500;
    }

}


/** Class representing blood */
class Blood {
    /**
     * @constructor Create blood
     * @param {number} x - The x coordinate where to place the blood image on the canvas
     * @param {number} y - The y coordinate where to place the blood image on the canvas
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/blood2.png';
    }

    /**
     * @description Draw a blood on the screen.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 100, 120);
    }

    /**
     * @description used to hide blood
     */
    hide() {
        this.x = -100;
        this.y = -100;
    }
}


/** Class representing a Heart. */
class Heart {
    /**
     * @constructor Create a heart
     */
    constructor() {
        let randomHeartLocationIndex = randomCollectibles(0, CollectiblesLocation.length);
        this.x = CollectiblesLocation[randomHeartLocationIndex][0];
        this.y = CollectiblesLocation[randomHeartLocationIndex][1];
        this.sprite = 'images/heart.png';
    }

    /**
     * @description Draw a heart on the screen.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
    }

    /**
     * @description used to hide heart
     */
    hide() {
        this.x = -700;
        this.y = -700;
    }
}


/** Class representing a key. */
class Key {
    /**
     * @constructor Create a key
     */
    constructor() {
        let randomKeyLocationIndex = randomCollectibles(0, CollectiblesLocation.length);
        this.x = CollectiblesLocation[randomKeyLocationIndex][0];
        this.y = CollectiblesLocation[randomKeyLocationIndex][1];
        this.sprite = 'images/key.png';
    }

    /**
     * @description Draw a key on the screen.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
    }

    /**
     * @description used to hide key
     */
    hide() {
        this.x = -900;
        this.y = -900;
    }
}


/** Class representing a star. */
class Star {
    /**
     * @constructor Create a star
     */
    constructor(score) {
        this.x = 200;
        this.y = 0;
        this.sprite = 'images/star.png';
        this.score = score;
    }

    /**
     * @description Draw a star on the screen.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.font = 'bold 30px serif';
        ctx.fillStyle = 'brown';
        ctx.fillText(`+${this.score}`, this.x + 20, this.y + 115);
        ctx.fill();

    }

    /**
     * @description used to hide star
     */
    hide() {
        this.x = -400;
        this.y = -400;
    }

}


/** Class representing a Modal. */
class Modal {
    /**
     * @constructor Create Modal
     * @param {object} overlay - modal document element
     * @param {number} level - passing game level variable to display it in modal
     * @param {number} gemCollected - passing gemCollected variable to display it in modal
     */
    constructor(overlay, level, gemCollected) {
        this.overlay = overlay;
        modalButton.addEventListener('click', this.close.bind(this));
        overlay.addEventListener('click', e => {
            if (e.srcElement.id === this.overlay.id) {
                this.close();
                resetGame();
            }
        });
        if (level > 5) {
            modalHeading.textContent = `Congratulation You Won Game`;
            modalLevel.textContent = `You reached to Final `;
            gameWinSound.play();
        } else {
            modalHeading.textContent = `Game Over`;
            modalLevel.textContent = `You reached to level ${level} `;
            gameOverSound.play();
        }
        modalScore.innerHTML = `with score ${scoreCountElement.textContent}`;
        modalGemCollected.innerHTML = `You collect ${gemCollected} <i class="fa fa-lg fa-diamond"></i>`;
        modalTimer.innerHTML = `in Time <i class="fa fa-lg fa-clock-o"></i> ${minutesElement.textContent}:${secondsElement.textContent}`
    }

    /**
     * @description used to display modal on screen
     */
    open() {
        this.overlay.classList.remove('disabled');
    }

    /**
     * @description used to close modal
     */
    close() {
        this.overlay.classList.add('disabled');
    }
}


/**
 * @description used to update hearts on score panel based on player life variable
 * @param {number} life - number of player lives
 */
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


/**
 * @description used to generate random number between min and max parameters
 * @param {number} min - min number for possible random numbers
 * @param {number} max - max number for possible random numbers
 * @return [number] - random number between min and max parameters
 */
function randomCollectibles(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


/**
* @description used to start game
*/
function startGame() {
    let choosePlayerContainer = document.querySelector('.choose-player');
    choosePlayerContainer.style.display = 'none';
    canvasGame.style.display = 'inline-block';
    scorePanel.style.display = 'flex';
    scorePanel2.style.display = 'flex';
    gameTimer = setInterval(setTime, 1000);
    gameMusic.play();
    gameMusic.volume = 0.2;
    gameMusic.loop = true;
}


/**
 * @description used to show modal after game end
 * @param {number} level - passing game level variable to display it in modal
 * @param {number} gemCollected - passing gemCollected variable to display it in modal
 */
function showModal(level,gemCollected) {
    const modal = new Modal(document.querySelector('.modal'),level,gemCollected);
    window.openModal = modal.open.bind(modal);
    window.openModal();
    clearInterval(gameTimer);
    gameMusic.pause();
    gameMusic.currentTime = 0;
    canvasGame.style.display = 'none';
    scorePanel.style.display = 'none';
    scorePanel2.style.display = 'none';

}


/**
 * @description used to reset game
 */
function resetGame() {
    window.location.reload(false);
}


/**
 * @description used to update game score
 */
function updateScore() {
    scoreCountElement.textContent = ((player.gemsCollected * 10) + (player.reachToWaterCount * 40)) * player.gameLevel;
}


/**
 * @description used to run game timer
 * Timer function from stackoverflow, https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
 */
function setTime() {
    ++totalSeconds;
    secondsElement.innerHTML = pad(totalSeconds % 60);
    minutesElement.innerHTML = pad(parseInt(totalSeconds / 60));
}


/**
 * @description used to put 0 before minutes and seconds if their string length < 2
 * Timer function from stackoverflow, https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
 * @return [string] valString - minutes or seconds
 */
function pad(val) {
    let valString = val + '';
    if (valString.length < 2) {
        return '0' + valString;
    } else {
        return valString;
    }
}

// instantiate enemies object
let enemy1 = new Enemy(-100, 225);
let enemy2 = new Enemy(-300, 140);
let enemy3 = new Enemy(-500, 60);
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
allEnemies.push(enemy1, enemy2, enemy3);

// instantiate player object
player = new Player(200, 400, 'images/char-boy.png');

// instantiate blood object
bloodObject = new Blood(-300, 800);

// instantiate gem object
gem = new Gems();

// instantiate heart object
heart = new Heart();
heart.hide();

// instantiate key object
key = new Key();
key.hide();

// instantiate star object
star = new Star(0);
star.hide();

/**
 * @description listens for key presses and sends the keys to
 * Player.handleInput() method
 */
document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


// declaring and initialize player list element
let playerList = document.querySelector('.players-list');

/**
 * @description listens for clicks and choosing player character
 * Using Event delegation by adding one event listener to
 * player list instead of adding 5 event listener to
 * 5 Elements
 */
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





