//This is the scene for the boss the Brute
//This scene creates the text of the name of the boss, the sprite of the boss and also the healthbar and textfield for damage input.
//It also looks adds the 'You won!' text in the update function if the boss's health is zero.
//The update function updates the game or reads for key controls.
//Press enter to damage boss based on the number in the textfield. Press left arrow key to change boss's prompt.
//update() also reads if it is gameOver, then the player can press right arrow to enter the dragonScene.

class Brute extends Phaser.Scene {
    constructor() {
        super("bruteScene");
        this.inputting = false; //Not used
        this.currentNumber = ""; //Not used
        this.numbersArray = []; //Not used
        this.currentNumberText = null; //Not used
        this.entryLineText = null; //Not used

        this.round = 0; //For future uses but not yet implemented or used
    }
    preload() {
        // load images/tile sprites
        this.load.image('healthbar', './assets/green.png');
        this.load.image('back', './assets/back1.png');
        // load spritesheet
        //this.load.spritesheet('', './assets/.png', {frameWidth: 0, frameHeight: 0, startFrame: 0, endFrame: 0});
    }
    create() {
        //This sets playerdmg to zero initially because the room just got created, and no damage exist yet.
        playerdmg = 0;

        //this is for checking if the game is over, so when initilized it is false.
        this.gameOver = false;

        //configuration for the boss title text
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

        //Defining bossHealth and bossMaxHealth which are the global variable number_of_players * 30
        this.bossHealth = number_of_players*30;
        this.bossMaxHealth = number_of_players*30;

        //Adding our boss title text for Brute
        this.bosstitle = this.add.text(game.config.width/2, game.config.height/2 -  4*borderUISize, 'The Brute',menuConfig).setOrigin(0.5);

        //Comments below were code for tweening that does not work.
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

        // create text objects to display current number and entry line (not important or used at all)
        this.currentNumberText = this.add.text(10, 10, this.currentNumber);
        this.entryLineText = this.add.text(10, 50, "");
    
        // add keyboard input (some fragmented code not used that I copied)
        //this.input.keyboard.on('keydown', this.handleInput, this); 

        let bossList; //Not used


        // make Brute boss
        //Making const BruteMoves a List of typed out moves of the Brute based on the rule's sheet or card.
        const BruteMoves = ["Attack: I hit a random player for 5 damage", "Savage Blow: I take no action this round: next round I hit a random player for 12 damage",  "Enrage: I deal 1 more damage when I attack.", "Brace: I gain 10 temporary HP that persists between rounds if not removed."];
        
        //create the Brute boss sprite and also pass its moves over for announce() later.
        this.Brute = new Boss(this, game.config.width/2, game.config.height/2, 'back', BruteMoves, 40,).setOrigin(0.5, 0);
        
        //Makes the bossHeathBar
        this.BosshealthBar=this.makeBar(0,0,0x2ecc71,this.bossHealth);
        this.bosslog = this.add.text(game.config.width/2, game.config.height/2 - 2* borderUISize, '').setOrigin(0.5);
        
        //this is the text that shows what the bosses's move is.
        console.log(this.Brute.announce());
        this.bosslog.text = this.Brute.announce();

        //Instruction text below the textfield tell them to edit and enter for damage.
        this.add.text(game.config.width/2, game.config.height/2 - borderPadding*2+200, 'Click grey textbox to start editing, press enter key to damage the boss').setOrigin(0.5);
        
        //Instruction text below the health bar that says to press left arrow and end turn for the boss's next announcement
        this.add.text(20, 80, 'Press left arrow to end players turn');
        
        //Adding REXUI textfield now
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

                //We turn the textfield text input the value of the global variable playerdmg.
                playerdmg = parseInt(text);
            },
            onClose: function (textObject) {
                console.log('Close text editor');
            },
            selectAll: true,
            // enterClose: false
        });

        //the comments below were code that did not work when trying to add the stateMachine or call damage from the bossObject
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

    //I found a example of a healthBar function.  It makes a retangular bar and takes x, y, color and health as arguments
    makeBar(x, y,color,health) {
        //draw the bar
        let bar = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, health*10, 50); //the height of the rectangle is 50 pixels, width is health*height
        
        //position the bar
        bar.x = x;
        bar.y = y;

        //return the bar
        return bar;
    }
    //Scales the health bar, useful for after the boss is damage.
    setValue(bar,percentage) {
        //scale the bar
        bar.scaleX = percentage;
    }

    //Our function defined in the scene that takes away the bosses health and also scales
    //It also calls setValue to scale the health bar based on the percentage (bosshealth - n)/maxbosshealth
    damage(n){
        if(this.bossHealth < 0) {
            this.bossHealth = 0;
        }
        else {
            this.bossHealth = this.bossHealth-n;
        }
        /*
        //Segment below was trying to test tweening, but errors occured
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
        //If the game is over and the input is keyRight, we move to the dragon
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start("dragonScene");
            
        }
        //Press Enter to damage the boss
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {

            
            console.log("damage");
            console.log(playerdmg);
            if (this.bossHealth >= 0 && !isNaN(playerdmg)){
                this.damage(playerdmg);
                //this.bosslog.text = this.Brute.announce();
                }
   
        }
        //Ends players' turn or shows the next boss's announcement/move
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // Ends players' turn
            
            //this.damage(4);
            //this.bossHealth -= 10;
            
            if (this.bossHealth > 0){
            console.log("Boss rolls, health now: "+ this.bossHealth);
            this.bosslog.text = this.Brute.announce();
            }
            //this.scene.start('playScene');    
        }
        //If the bossHealth is 0 or negative, add text, 'You Won' and 'Press right arrow' and set gameOver to true.
        if(this.bossHealth <= 0) {
            this.add.text(game.config.width/2, game.config.height/2, 'You Won!').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press any right arrow to move to the next boss').setOrigin(0.5);
            this.gameOver = true;
        }
    }
}






