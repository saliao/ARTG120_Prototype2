class Beloved extends Phaser.Scene {
    constructor() {
        super("belovedScene");
        this.inputting = false;
        this.currentNumber = "";
        this.numbersArray = [];
        this.currentNumberText = null;
        this.entryLineText = null;
        this.round = 0;
    }
    preload() {
        // load images/tile sprites
        this.load.image('healthbar', './assets/green.png');
        this.load.image('back', './assets/back1.png');
        // load spritesheet
        //this.load.spritesheet('', './assets/.png', {frameWidth: 0, frameHeight: 0, startFrame: 0, endFrame: 0});
    }
    create() {
        playerdmg = 0;
        this.gameOver = false;
        let menuConfig = {
            fontFamily: 'fantasy',
            fontSize: '48px',
            backgroundColor: '#000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.bossHealth = number_of_players*30;
        this.bossMaxHealth = number_of_players*30;
        this.bosstitle = this.add.text(game.config.width/2, game.config.height/2 -  4*borderUISize, 'The Beloved',menuConfig).setOrigin(0.5);
        //this.bossHealth = 120;
        //this.bossMaxHealth = 120;
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
        //this.input.keyboard.on('keydown', this.handleInput, this);

        let bossList;
        // make Traveler boss
        
        const BelovedMoves = ["Attack: I hit two random players for 3 damage each: if I lose half of my HP, I only attack once.","Regroup: I heal for half of the damage I took this round.","Empathy: I reduce a random player’s damage dealt by 2 until I die.", "Charm: I hit a random player for 2 damage and make them attack another."];
        
        this.Beloved = new Boss(this, game.config.width/2, game.config.height/2, 'back', BelovedMoves, 40,).setOrigin(0.5, 0);
        
        this.BosshealthBar=this.makeBar(0,0,0x2ecc71,this.bossHealth);
        this.bosslog = this.add.text(game.config.width/2, game.config.height/2 - 2* borderUISize, '').setOrigin(0.5);
        console.log(this.Beloved.announce());
        this.bosslog.text = this.Beloved.announce();
        this.add.text(game.config.width/2, game.config.height/2 - borderPadding*2+200, 'Click grey textbox to start editing, press enter key to damage the boss').setOrigin(0.5);
        this.add.text(20, 80, 'Press left arrow to end players turn');
        game.config.dom = true;
        game.config.parent = this;
        var printText = this.add.rexBBCodeText(game.config.width/2, game.config.height/2 - borderPadding*2, '0', {
            color: 'white',
            fontSize: '24px',
            //fontFamily: 'fantasy',
            align: 'center',
            fixedWidth: 200,
            fixedHeight: 40,
            backgroundColor: '#333333',
            valign: 'center'
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', function () {
            var config = {
                type: 'number',
                onTextChanged: function (textObject, text) {
                    // Check input text here.
                    textObject.text = text;
                }
            };               
            this.plugins.get('rextexteditplugin').edit(printText, config);
        }, this);
        this.warning = this.add.text(game.config.width/2, game.config.height/2 + borderUISize +80, '').setOrigin(0.5);
        this.plugins.get('rextexteditplugin').add(printText, {
            onOpen: function (textObject) {
                console.log('Open text editor');
            },
            onTextChanged: function (textObject, text) {
                textObject.text = text;
                console.log(`Text: ${text}`);
                playerdmg = parseInt(text);
            },
            onClose: function (textObject) {
                console.log('Close text editor');
            },
            selectAll: true,
            // enterClose: false
        });
        //this.setValue(this.BosshealthBar,1);
        //this.damage(healthBar,60);
        


        //let powerBar=this.makeBar(140,200,0xe74c3c);
        //this.setValue(powerBar,50);


        //let magicBar=this.makeBar(140,300,0x2980b9);
        //this.setValue(magicBar,33);
        //test.damage(5);
        //bossList[0] = test;
        /*
        this.rounds = new StateMachine('new', {
            newRound: new NewRoundState(),
            announcment: new AnnoucmentState(),
            player: new PlayerState(),
            boss: new BossState(),
            victory: new VictoryState(),
        }, [this, bossList[round]]);
        */
    }
    makeBar(x, y,color,health) {
        //draw the bar
        let bar = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, health*10, 50);
        
        //position the bar
        bar.x = x;
        bar.y = y;

        //return the bar
        return bar;
    }
    
    setValue(bar,percentage) {
        //scale the bar
        bar.scaleX = percentage;
    }
    damage(n){
        if(this.bossHealth < 0) {
            this.bossHealth = 0;
        }
        else {
            this.bossHealth = this.bossHealth-n;
        }
        /*
        
        let newWidth = this.bossMaxHealth*10 * (this.bossHealth / this.bossMaxHealth);
        let height = 80;
        this.tweens.add({

            targets: this.BosshealthBar,
            duration: 300, // Replace with desired duration of animation in milliseconds
            ease: Phaser.Math.Easing.Linear,
            x: this.bossMaxHealth*10-newWidth,
            onComplete: () => {
                //this.BosshealthBar.clear();
                //this.BosshealthBar.clearMask();
                //this.BosshealthBar.fillRect(0, 0, newWidth, height);
            
            },
        });
        */
        this.setValue(this.BosshealthBar,((this.bossHealth)/this.bossMaxHealth));
    }
    update() {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start("bruteScene");
            //this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            // enter to damage the boss
            
            console.log("damage");
            console.log(playerdmg);
            if (this.bossHealth >= 0 && !isNaN(playerdmg)){
                this.damage(playerdmg);
                //this.bosslog.text = this.Beloved.announce();
                }
   
        }
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // Ends players' turn
            
            //this.damage(4);
            //this.bossHealth -= 10;
            
            if (this.bossHealth > 0){
            console.log("Boss rolls, health now: "+ this.bossHealth);
            this.bosslog.text = this.Beloved.announce();
            }
            //this.scene.start('playScene');    
        }
        if(this.bossHealth <= 0) {
            this.add.text(game.config.width/2, game.config.height/2, 'You Won!').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press any right arrow to move to the next boss').setOrigin(0.5);
            this.gameOver = true;
        }
    }
}






