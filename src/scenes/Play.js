class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.inputting = false;
        this.currentNumber = "";
        this.numbersArray = [];
        this.currentNumberText = null;
        this.entryLineText = null;
        this.round = 0;
    }
    preload() {
        // load images/tile sprites
        this.load.image('back', './assets/back1.png');
        // load spritesheet
        //this.load.spritesheet('', './assets/.png', {frameWidth: 0, frameHeight: 0, startFrame: 0, endFrame: 0});
    }
    create() {
        // place title sprite
        //this.sheetPlaceHolder = this.add.tileSprite(0, 0, 640, 480, '').setOrigin(0, 0);
        // animation config
        // this.anims.create({
        //     key: '',
        //     frames: this.anims.generateFrameNumbers('', { start: 0, end: 0, first: 0}),
        //     frameRate: 30
        // });

        // create text objects to display current number and entry line
        this.currentNumberText = this.add.text(10, 10, this.currentNumber);
        this.entryLineText = this.add.text(10, 50, "");
    
        // add keyboard input
        this.input.keyboard.on('keydown', this.handleInput, this);

        let bossList;
        // make test boss
        let testMoves = [ ["type1", "move1"], ["type2", "move2"], ["type3", "move3"], ["type4", "move4"] ];
        test = new Boss(this, game.config.width/2, game.config.height, 40, 'back', testMoves, "test", 40).setOrigin(0.5, 0);
        bossList[0] = test;
        
        this.rounds = new StateMachine('new', {
            newRound: new NewRoundState(),
            announcment: new AnnoucmentState(),
            player: new PlayerState(),
            boss: new BossState(),
            victory: new VictoryState(),
        }, [this, bossList[round]]);
    }
    update() {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown()) {
            this.scene.start("menuScene");
        }
        if(test.bossHealth == 0) {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press any key to return to menu').setOrigin(0.5);
            this.gameOver = true;
        }
    }
}

class NewRoundState extends State {
    enter(scene, boss) {
        // displays text annoucing what round it is
        // displays text telling player to press enter to continue
        let roundText = scene.add.text(10, 10, `Round: ${this.round}`);
        roundText.setStyle({
            font: '32px Arial',
            fill: '#fff'
        });

        let continueText = this.add.text(10, 50, 'Press enter to continue');
        continueText.setStyle({
            font: '24px Arial',
            fill: '#fff'
        });
    }

    execute(scene) {
        const { enter } = scene.keys;

        if(Phaser.Input.Keyboard.JustDown(enter)) {
            this.stateMachine.transition('announcement');
            return;
        }
    }
}

class AnnoucmentState extends State {
    enter(scene, boss) {
        let move = boss.announcment();
        // displays text saying: "$boss.name is going to $move!"
        // displays text telling player to press enter to continue
        let annoucingText = scene.add.text(10, 10, `${boss.name} is going to ${move}!`);
        annoucingText.setStyle({
            font: '32px Arial',
            fill: '#fff'
        });

        let continueText = this.add.text(10, 50, 'Press enter to continue');
        continueText.setStyle({
            font: '24px Arial',
            fill: '#fff'
        });
    }

    execute(scene, boss) {
        const { enter } = scene.keys;
        
        if(Phaser.Input.Keyboard.JustDown(enter)) {
            this.stateMachine.transition('player');
            return;
        }
    }
}

class PlayerState extends State {
    enter(scene, boss) {
        // displays text "Player Turn"
        // "Enter each damage value then press enter"
        // "Press Enter twice to end players' turn"
        // creates text box next to boss sprite for live updating typed value
        let playerTurnText = scene.add.text(10, 10, `Player Turn`);
        playerTurnText.setStyle({
            font: '32px Arial',
            fill: '#fff'
        });

        let continueText = this.add.text(10, 50, 'Enter each damage value then press enter\nPress Enter twice to end players\' turn');
        continueText.setStyle({
            font: '24px Arial',
            fill: '#fff'
        });
    }

    execute(scene, boss) {
        const { enter } = scene.keys;
         value;
        // player inputs numerical value which is displayed in text box
        // Create a new text input field using the DOMElement plugin
        const input = this.add.dom(400, 300).createFromHTML(`
        <input type="number" id="input" value="0" style="font-size: 32px; width: 200px; text-align: center;">`);
        // Set the focus to the input field so the player can start typing right away
        input.getChildByID('input').focus();
        
        // Add an event listener to the input field for the "keydown" event
        input.getChildByID('input').addEventListener('keydown', event => {
            // Check if the key pressed was the "Enter" key
            if (event.key === 'Enter') {
                // Get the value of the input field
                const value = parseInt(event.target.value);

                // Check if the input field is empty
                if (isNaN(value)) {
                    // If the input field is empty, transition to the "boss" state
                    this.stateMachine.transition('boss');
                    return;
                }

                // If the input field is not empty, update the text object with the entered value
                text.setText(`You entered: ${value}`);
                boss.damage(value);
                if(boss.bossHealth == 0) {
                    this.stateMachine.transition('victory');
                    return;
                }
                boss.damage(value);
                if(boss.bossHealth == 0) {
                    this.stateMachine.transition('victory');
                    return;
                }
            }
        });
    }
}

class BossState extends State {
    enter(scene, boss) {
        let action = boss.turn();
        // displays text saying: "$boss.name $action"
        // displays text telling player to press enter to continue
        let annoucingText = scene.add.text(10, 10, `${boss.name} ${action}!`);
        annoucingText.setStyle({
            font: '32px Arial',
            fill: '#fff'
        });

        let continueText = this.add.text(10, 50, 'Press enter to continue');
        continueText.setStyle({
            font: '24px Arial',
            fill: '#fff'
        });
    }

    execute(scene, boss) {
        const { enter } = scene.keys;
        
        if(Phaser.Input.Keyboard.JustDown(enter)) {
            this.stateMachine.transition('new');
            return;
        }
    }
}

class VictoryState extends State {
    enter(scene, boss) {
        // displays text saying: "You have slain $boss.name!"
        // displays text telling player to press enter to continue
        // sets rounds object value to the next boss in bossList
        let annoucingText = scene.add.text(10, 10, `You have slain ${boss.name}!`);
        annoucingText.setStyle({
            font: '32px Arial',
            fill: '#fff'
        });

        let continueText = this.add.text(10, 50, 'Press enter to continue');
        continueText.setStyle({
            font: '24px Arial',
            fill: '#fff'
        });
        //[this, bossList[round]])
        scene.round++;
        this.object = bossList[this.round]
    }

    execute(scene) {
        const { enter } = scene.keys;
        
        if(Phaser.Input.Keyboard.JustDown(enter)) {
            this.stateMachine.transition('new');
            return;
        }
    }
}