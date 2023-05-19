//Boss object that is not fully done.
//The damage() function in this file does not work.  
//Instead I made a seperate damage(n) function for every boss scene.
//As of right now this only makes a sprite object and also an announce function that return what move the boss randomly picked.

class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, moves, maxHealth, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        //this.name = name;
        this.bossHealth = 100; //Not used
        this.bossMaxHealth = maxHealth; //Not used

        //Defines moves as the passed in list of moves
        this.moves = moves;
        this.selection = -1;
    }
    
    create() {
        //This cannot create a health bar so some reason..

        //this.healthBar = this.add.sprite(game.config.width/2, game.config.height/2, 'healthBar');
        //this.healthMask = this.make.graphics();
        //this.healthMask.fillRect(x, y, 100, 10);
        //this.healthBar.mask = new Phaser.Display.Masks.GraphicsMask(this, this.healthMask);
        
    }

    damage(n) {
        //Ignore this function and the rest of it.  The tweening does not work.
        this.bossHealth -= n;
        if(this.bossHealth < 0)
            this.bossHealth = 0;
        let newWidth = 100 * (this.bossHealth / this.bossMaxHealth);
        this.scene.tweens.add({
            targets: this.healthMask,
            duration: 200, // Replace with desired duration of animation in milliseconds
            ease: Phaser.Math.Easing.Linear,
            x: this.x + newWidth,
            onComplete: () => {
                //this.healthMask.clear();
                this.healthMask.fillRect(x, y, newWidth, height);
            },
        });
    }
    announce() {
        //It randomly selects a move.  this.moves is a list of moves passed into the parameter.
        //It will return the message of the boss. 

        this.selection = Math.floor(Math.random() * 4); //Number between 0-3
        console.log("Rolling d4: "+ this.selection);
        //console.log("Move now: "+ this.moves[this.selection]);
        let dice = this.selection+1;
        return "I rolled a " + dice +".  \n\n" + this.moves[this.selection]; 
    }
    turn() {
        //For future implmentation for return the turn number and what type of move the boss is doing.
        return this.moves[this.selection][1];
    }
}