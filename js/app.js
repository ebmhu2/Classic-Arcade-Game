
// Enemies our player must avoid
class Enemy {
    constructor(x, y) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
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
        allEnemies.forEach(function (enemyV) {
            enemyV.speed = 160 ;
        });
        this.x = this.x + (this.speed * dt);

    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.



// Now instantiate your objects.
let enemy1 = new Enemy(-100,225);
let enemy2 = new Enemy(-300,140);
let enemy3 = new Enemy(-500,60);
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
allEnemies.push(enemy1,enemy2,enemy3);
// Place the player object in a ;variable called player

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
