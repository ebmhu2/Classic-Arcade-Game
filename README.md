# Classic Arcade Game Project
 This is browser-based arcade game, created as a project for Udacity FEND Nanodegree.
## Table of Contents
 * [Getting started](#Getting-started)
 * [Project-Dependencies](#Project-Dependencies)
 * [Rules of the game](#Rules-of-the-game)
 * [Additional Functionality](#Additional-Functionality)

## Instructions
 How to run the Game ?
 - You can run the game locally by Open the `index.html` file on the browser.
## Getting-started
 In this game You have a Player and Enemies(bugs).
 To play the game use arrow keys :arrow_up: :arrow_down: :arrow_right: :arrow_left: 
 try to cross the road reach to the water and collect gems :gem: without colliding 
 into any of the enemies.
## Technologies-used
 * HTML and HTML5
 * CSS and CSS3 
 * JAVASCRIPT and ES6
## Project-Dependencies
 * Icons that used in project from fontawesome.com
  ```
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  ```
 * Google Fonts
  ```
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Press+Start+2P">
  ```
## Rules-of-the-game

 * Player selection : allow the user to select the image for player GameObject before starting the game.
 * The player can move left , right, up and down.
 * The player has 5 lives.
 * The enemies move at varying speed on the paved block portion of the game board.
 * Once player collides with an enemy, player lose one of his lives and he moves back to the starting square.
 * Once the player reaches the water 5 times and player lives < 5 heart :heart: will appear for 5 seconds to be collected.
 * If player failed to collect heart he will try again to reach to water 5 times until heart appear.
 * If player success to collect heart he will get life for player object .
 * Once the player reaches the water 10 times, key object :key: will appear for 5 seconds to be collected
 * If player failed to collect key he will try again to reach to water 10 times until key appear.
 * If player success to collect key he will go to next level.
 * Game Score 
    - Once player collect gem :gem:, score increased by (10 * Game Level).
    - Once the player reaches the water, score increased by (40 * Game Level).
    - Collision with an enemy has not Effect on your Score.
    - Game Timer :clock1: has not Effect on your Score.
 * Game Lives
    - Once player collect heart :heart:, player lives increased by one if his lives < 5
    - Collision with an enemy decrease player lives by one
 * Game End
    - Player win the game when he reach to level 5 and collect key after reach to water 10 times.
    - Player lose when he lose all lives.
    - Once the game ends a modal will appear, containing the total timer, scores , level and Gems collected.
 *Game Level
    - Game consist of 5 Level , speed of enemies multiplied by game level
    - Once player collect a key :key: , he will go to next level
    - In level 5 when he collect key , he won the game
 * In Modal pop-up
   - The user can click the play again button to restart the game.
 
## Additional-Functionality
 * Player Selection at game start
 * Score calculated from reaching to water and collecting gems and multiplied by game level
 * Collectibles : add gems ,hearts and level keys allowing player to collect them .
 * Game timer
 * Multiple type of vehicle 
 * Blood appear on collision
 * Add Game sound
 * Add star object that indicate score value that added to total score when collect gem or reach to water.
 
 ## Resources
 * Sounds are from [8-Bit Sound Effects Library](https://opengameart.org/content/8-bit-sound-effects-library) on [Open Game Art](https://opengameart.org/)
 * Blood splatters are from [clipart](http://clipart-library.com) 
