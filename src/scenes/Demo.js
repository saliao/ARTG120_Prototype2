
//Ignore Demo.js, this was for testing the RexUI plugin textfield on an empty canvas.
//I was trying to learn how to add and use the textfield.
class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js';
        this.load.plugin('rexbbcodetextplugin', url, true);
      
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js';
        this.load.plugin('rextexteditplugin', url, true);
    }

    create() {           
        var printText = this.add.rexBBCodeText(400, 300, 'abc', {
            color: 'yellow',
            fontSize: '24px',
            fixedWidth: 200,
            fixedHeight: 80,
            backgroundColor: '#333333',
            valign: 'center'
        }).setOrigin(0.5)

        this.plugins.get('rextexteditplugin').add(printText, {
            onOpen: function (textObject) {
                console.log('Open text editor');
            },
            onTextChanged: function (textObject, text) {
                textObject.text = text;
                console.log(`Text: ${text}`);
            },
            onClose: function (textObject) {
                console.log('Close text editor');
            },
            selectAll: true,
            // enterClose: false
        });

        this.add.text(0, 580, 'Click text to start editing, press enter key to stop editing')
    }

    update() { }
}
/*
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    dom: {
        createContainer: true
    },
    scene: Demo
};

var game = new Phaser.Game(config);
*/