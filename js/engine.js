/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/GameObject is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function (global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas element's height/width and add it to the DOM.
     */
    // canvas = doc.createElement('canvas')
    var doc = global.document,
        win = global.window,
        canvas = doc.querySelector('.game-container'),
        ctx = canvas.getContext('2d'),
        lastTime;

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your GameObject should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /**
     * @description used for 2d collision detection
     */
    function checkCollisions() {
        allEnemies.forEach(function (enemy) {
            if (player.x < enemy.x + 40 && player.x + 40 > enemy.x &&
                player.y < enemy.y + 10 && player.y + 10 > enemy.y) {
                // display blood
                bloodObject = new Blood(player.x + 10, player.y + 40);
                player.killedByEnemy();
                // hide player
                player.hide();
                setTimeout(function () {
                    bloodObject.hide();
                    player.resetPosition();
                }, 1000);
            }
        });
        collect2d(player, key);
        collect2d(player, heart);
        collect2d(player, gem);
        /* if player reach to water 10 times
         * key object will appear for 5 seconds to be collected
         * if player failed to collect key he will try again
         * to reach to water 10 times until key appear.
         * if player success to collect key he will go to next level
         */
        if (player.reachToWaterCount % 10 === 0 && player.reachToWaterCount > 0 && key.x === -900) {
            player.reachToWaterCount += 1;
            heart.hide();
            gem.hide();
            key = new Key();
            setTimeout(function () {
                key.hide();
                gem = new Gems();
            }, 5000);
            /* if player reach to water 5 times
             * heart object will appear for 5 seconds to be collected
             * if player failed to collect heart he will try again
             * to reach to water 5 times until heart appear.
             * if player success to collect heart he will get life for player object
             */
        } else if (player.reachToWaterCount % 5 === 0 && player.reachToWaterCount > 0 && heart.x === -700 && key.x === -900 && player.life < 5) {
            player.reachToWaterCount += 1;
            gem.hide();
            heart = new Heart();
            setTimeout(function () {
                heart.hide();
                gem = new Gems();
            }, 5000);
        }
    }


    /**
     * @description used for 2d collision detection between two objects
     * @param {object} object1 - first object
     * @param {object} object2 - second object
     */
    function collect2d(object1, object2) {
        if (object2.x < object1.x + 40 && object2.x + 40 > object1.x &&
            object2.y < object1.y + 50 && object2.y + 10 > object1.y) {
            object2.hide();
            switch (object2) {
                case gem:
                    object1.collectGems();
                    if (heart.x === -700 && key.x === -900) {
                        setTimeout(function () {
                            gem = new Gems();
                        }, 1000);
                    }
                    break;
                case key:
                    object1.collectKeys();
                    break;
                case heart:
                    object1.collectHearts();
                    break;
            }
        }
    }


    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();
        gem.render();
        bloodObject.render();
        heart.render();
        key.render();
        star.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/green-enemy-bug.png',
        'images/enemy-bug3.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/gem-blue.png',
        'images/gem-green.png',
        'images/gem-orange.png',
        'images/blood2.png',
        'images/heart.png',
        'images/key.png',
        'images/star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})
(this);
