let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    // Sets game scaling
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);
let test;