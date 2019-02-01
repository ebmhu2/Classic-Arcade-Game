let gem;
let player;
let bloodObject;
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
        if (this.x===-100){
            allEnemies.forEach(function (enemyV) {
                enemyV.speed = Enemy.variableSpeed(300,1000);
            });
        }


        this.x = this.x + (this.speed * dt);
        //reset enemy's position
        if (this.x >= 500) {
            this.resetPosition();
        }
        this.detectCollision2d();

    }

    static variableSpeed(min,max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    //reset position for enemy
    resetPosition() {
        this.x = this.xPoint;
        this.y = this.yPoint;
        this.speed =  Enemy.variableSpeed(300,1000);
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    detectCollision2d(){
        if (player.x < this.x + 40 && player.x + 40  > this.x &&
            player.y < this.y + 10 && player.y + 10 > this.y) {
        // The objects are touching
            // hide player
            bloodObject = new blood(player.x+10,player.y + 40);
            player.x = -300;
            setTimeout(function () {
                bloodObject.x=-300;
                player.x=200;
                player.y=400;
           },1000);
        }
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(x, y ,link){
        this.x = x;
        this.y = y;
        this.sprite = link;
    }
    update(){

    }

    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(allowedKeys){
        if(allowedKeys === 'left' && this.x > 0){
            this.x -= 100;
        }
        if(allowedKeys === 'right' && this.x <400){
            this.x += 100;
        }
        if(allowedKeys === 'up' && this.y > 0){
            this.y -= 85;
        }
        if(allowedKeys === 'down' && this.y <400){
            this.y += 85;
        }
        gem.detectCollect2d();
        if (player.y <0){
            player.x=200;
            player.y=400;
        }
    }
}


class Collectibles {
    constructor(){
        const gemLinks = ['images/Gem-Blue.png', 'images/Gem-Green.png', 'images/Gem-Orange.png'];
        //gem locations
        const gemLocation = [
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
        let randomGemLocationIndex = this.randomGem(0,gemLocation.length);
        let randomGemLinkIndex = this.randomGem(0,3);
        this.x = gemLocation[randomGemLocationIndex][0];
        this.y = gemLocation[randomGemLocationIndex][1];
        this.sprite = gemLinks[randomGemLinkIndex];
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y,80,100);
    }
    update(){

    }
    detectCollect2d(){
        if (this.x < player.x + 40 && this.x + 40  > player.x &&
           this.y < player.y + 50 && this.y + 10 > player.y) {
            // The objects are touching
            // hide gem
            this.x -= 30;
            setTimeout(()=> gem.x = -300,100);
            setTimeout(()=> gem = new Collectibles(),1000);
        }
    }
    randomGem(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

class blood{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/blood2.png';
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y,100,120);
    }
}
// Now instantiate your objects.
let enemy1 = new Enemy(-100,225);
let enemy2 = new Enemy(-300,140);
let enemy3 = new Enemy(-500,60) ;
bloodObject = new blood(-300,800);
gem = new Collectibles();
player = new Player(200,400,'images/char-boy.png');
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

let playerList = document.querySelector('.players-list');
let canvasGame = document.querySelector(".game-container");
let choosePlayerContainer = document.querySelector('.choose-player');
playerList.addEventListener('click', function (evt) {
    if (evt.target.nodeName ==='IMG'){
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
        player = new Player(200,400, characterLink);
        choosePlayerContainer.style.display = 'none';
        canvasGame.style.display = 'inline-block';
    }
});





