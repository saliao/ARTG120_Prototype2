class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload(){
        this.load.image('traveler', './assets/traveler.png');
        this.load.image('beloved', './assets/beloved.png');
        this.load.image('brute', './assets/brute.png');
        this.load.image('dragon', './assets/dragon.png');
        this.load.image('back', './assets/back1.png');
        this.load.image('healthbar', './assets/green.png');


    }
    create(){
        this.round=0;
        this.add.text(20, 110, 'Click grey textbox to start editing\ndamage calculation.');
        this.add.text(20, 70, 'Press right arrow to move\nto the next turn');
        this.add.text(20, 150, 'press enter key to damage the boss. \n*note that this is for players turn only.');
        this.actionPhase = false;
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

        this.roundtext = this.add.text(20, game.config.height -  1.5*borderUISize, 'Round: '+this.round,menuConfig);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.DragonMoves2 = [["Attack", ["Attack", "I hit a random player for 8 damage"]],
                            ["Perform a Special Attack", ["Fire Breath", "I bellow fire to hit all players for 6 damage"]],
                            ["Perform a Special Attack", ["Cave-In", "I smash the ground dealing 2 damage to all players\ncausing rubble to fall on \n 3 random players for 2 damage each round"]],
                            ["Buff myself", ["Scale Armor", "Whenever I take damage, \nreduce it by 2, this stacks."]]];
        //create the Dragon boss sprite and also pass its moves over for announce() later.
        this.BelovedMoves2 = [["Attack", ["Attack", "I hit two random players for 3 damage each: \nif I lose half of my HP, \nI only attack once."]],
                            ["Buff myself", ["Regroup", "I heal for half of the damage I took this round."]],
                            ["Debuff a player", ["Empathy", "I reduce a random player's damage \ndealt by 2 until I die."]],
                            ["perform a Special Attack", ["Charm", "I hit a random player for 2 damage \nand make them Attack another."]]];
        this.BruteMoves2 = [["Attack", ["Attack", "I hit a random player for 5 damage"]],
                            ["perform a Special Move", ["Savage Blow", "I take no action this round: \nnext round I hit a random player for 12 damage"]],
                            ["Buff myself", ["Enrage", "I deal 1 more damage when I attack."]],
                            ["Buff myself", ["Brace", "I heal for 10 HP that persists between rounds if not removed."]]];
        this.TravelerMoves2 = [["Attack", ["Attack", "I hit a random player for 3 damage"]],
                            ["perform a Special Attack", ["Flurry", "I attack each player for 3 damage twice\n+1 for each time I was hit the last turn."]],
                            ["Buff myself", ["Purity", "I remove all debuffs placed on me"]],
                            ["Buff myself", ["Parry", "Next time I would take damage,\nI reduce it to 0 and deal 2 damage to the attacker."]]];
        this.bosses = [0,0,0,0];

        this.bosses[0] = new Boss(this, game.config.width/2, game.config.height/3, 'traveler', this.TravelerMoves2, number_of_players*30, "Traveler",).setOrigin(0.5, 0).setScale(0.35);

        this.bosstitle = this.add.text(game.config.width/2, game.config.height/2 -  5.5*borderUISize, 'The ' + this.bosses[this.round].name,menuConfig).setOrigin(0.5);
        this.bosslog = this.add.text(game.config.width/2, game.config.height/2 - 3* borderUISize, '').setOrigin(0.5);
        menuConfig.fontSize = '24px';
        this.phase = this.add.text(game.config.width/2, game.config.height/2 -  4*borderUISize, 'Announcement',menuConfig).setOrigin(0.5);
        this.rounds = new StateMachine('newRound', {
            newRound: new NewRoundState(),
            announcement: new AnnoucementState(),
            player: new PlayerState(),
            boss: new BossState(),
            victory: new VictoryState(),
        }, [this, this.bosses[this.round]]);
        var printText = this.add.rexBBCodeText(game.config.width/9, game.config.height/2 - borderPadding*2, '0', {
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
                textObject.text = 0;
            },
            selectAll: true,
            // enterClose: false
        });
        this.rounds.step();
    }
    update(){
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            console.log("damage");
            console.log(playerdmg);
            console.log(this.actionPhase == true);
            if ( this.bosses[this.round].bossHealth >= 0 && !isNaN(playerdmg) && this.actionPhase == true){
                this.bosses[this.round].damage(playerdmg);
                console.log("yipeeee");
                //this.bosslog.text = this.Traveler.announce();
                playerdmg = 0;
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            this.rounds.step();
        }
        if(this.bosses[3].bossHealth <= 0 && this.gameOver == false) {
            
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT) && !this.gameOver){
            this.rounds.step();
        }
        else if(this.gameOver){
            console.log("brug");
            this.scene.start("menuScene");
        }
    }
}
    class NewRoundState extends State {
        enter(scene, boss) {
            this.stateMachine.transition('announcement');
        }
    
        execute(scene) {
            this.stateMachine.transition('announcement');
        }
    }
    
    class AnnoucementState extends State {
        enter(scene, boss) {
            scene.bosslog.text = "I am going to " + boss.announce();
            scene.phase.text = "Announcement";
            scene.phase.color = '#880808';
        }
    
        execute(scene, boss) {
            this.stateMachine.transition('player');
        }
    }
    
    class PlayerState extends State {
        enter(scene, boss) {
            // displays text "Player Turn"
            // "Enter each damage value then press enter"
            // "Press Enter twice to end players' turn"
            // creates text box next to boss sprite for live updating typed value
            scene.phase.text = "Players' Turn"
            scene.bosslog.text = 'players now input their damage on the grey box'
            scene.actionPhase = true;
        }
    
        execute(scene, boss) {
            this.actionPhase = false;
            if(scene.bosses[scene.round].bossHealth <=0){
                this.stateMachine.transition('victory');
            }
            else{
                this.stateMachine.transition('boss');
            }
        }
    }

    class BossState extends State {
        enter(scene, boss) {
            scene.phase.text = "Boss' turn";
            scene.bosslog.text = currentBossmove;
            
            // displays text saying: "$boss.name $action"
            // displays text telling player to press enter to continue
        }
    
        execute(scene, boss) {
            this.stateMachine.transition('newRound');
        }
    }
    
    class VictoryState extends State {
        enter(scene, boss) {
            // displays text saying: "You have slain $boss.name!"
            // displays text telling player to press enter to continue
            // sets rounds object value to the next boss in bossList
            scene.round+= 1;
            scene.roundtext.text = 'Round: ' + scene.round;
            switch(scene.round){
                case 1:
                    scene.bosses[1] = new Boss(scene, game.config.width/2, game.config.height/3, 'beloved', scene.BelovedMoves2, number_of_players*30, "Beloved",).setOrigin(0.5, 0).setScale(0.35);
                    scene.bosstitle.text = 'The ' + scene.bosses[scene.round].name;
                    this.stateMachine.stateArgs = [scene, scene.bosses[scene.round]];
                    break;
                case 2:
                    scene.bosses[2] = new Boss(scene, game.config.width/2, game.config.height/3, 'brute', scene.BruteMoves2, number_of_players*30,"Brute",).setOrigin(0.5, 0).setScale(0.35);
                    scene.bosstitle.text = 'The ' + scene.bosses[scene.round].name;
                    this.stateMachine.stateArgs = [scene, scene.bosses[scene.round]];
                    break;
                case 3:
                    scene.bosses[3] = new Boss(scene, game.config.width/2, game.config.height/3, 'dragon', scene.DragonMoves2, number_of_players*40,"Dragon",).setOrigin(0.5, 0).setScale(0.35);
                    scene.bosstitle.text = 'The ' + scene.bosses[scene.round].name;
                    this.stateMachine.stateArgs = [scene, scene.bosses[scene.round]];
                    break;
                case 4:
                    scene.add.text(game.config.width/2, game.config.height/2, 'You Won!').setOrigin(0.5);
                    scene.add.text(game.config.width/2, game.config.height/2 + 64, 'Press the right arrow to move back to the main menu.').setOrigin(0.5);
                    scene.gameOver = true;
                    break;
            }
            if(scene.round < 4){
                this.stateMachine.transition('newRound');
            }
        }
    
        execute(scene) {
            if(scene.round < 4){
                this.stateMachine.transition('newRound');
            }
        }
}