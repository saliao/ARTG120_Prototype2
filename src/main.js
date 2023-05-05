//import Phaser from './';
//import RexUIPlugin from './libphaser3-rex-plugins/templates/ui/ui-plugin.js';


let config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 1280,
    height: 720,
    // Sets game scaling
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
        createContainer: true
    },
    
    scene: [ Menu, Demo, Traveler, Beloved, Brute, Dragon ]
}
let game = new Phaser.Game(config);
let keyF, keyR, keyLEFT, keyRIGHT, keyENTER;

let test;
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
var number_of_players = 1;
let angel_health = 0;
let dragon_health = 0;
let traveler_health = 0;
let brute_health = 0;
var playerdmg = 0;
bossList = ['Traveler','Angel','Brute','Dragon']
clearedBoss = [];