//Boss object that is not fully done.
//The damage() function in this file does not work.  
//Instead I made a seperate damage(n) function for every boss scene.
//As of right now this only makes a sprite object and also an announce function that return what move the boss randomly picked.

class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, moves, maxHealth, name, frame) {
        super(scene, x, y, texture, frame);
        this.name = name;
        scene.add.existing(this);
        //this.name = name;
        this.bossHealth = maxHealth; //Not used
        this.bossMaxHealth = maxHealth; //Not used
        this.healthBar = this.makeBar(0,0,0x2ecc71,this.bossHealth);
        //Defines moves as the passed in list of moves
        this.moves = moves;
        this.selection = -1;
    }
    makeBar(x, y,color) {
        //draw the bar
        let bar = this.scene.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, game.config.width, 50);//the height of the rectangle is 50 pixels, width is health*height
        
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
    create() {
        //This cannot create a health bar so some reason..

     
        
        
    }

    damage(n) {
        //Ignore this function and the rest of it.  The tweening does not work.
        this.bossHealth -= n;
        if(this.bossHealth < 0)
            this.bossHealth = 0;
        //let newWidth = 100 * (this.bossHealth / this.bossMaxHealth);
      /*  this.scene.tweens.add(this,{
            targets: this.healthMask,
            duration: 200, // Replace with desired duration of animation in milliseconds
            ease: Phaser.Math.Easing.Linear,
            x: this.x + newWidth,
            onComplete: () => {
                this.healthMask.clear();
                this.healthMask.fillRect(x, y, newWidth, height);
            },
        });*/
        this.setValue(this.healthBar,((this.bossHealth)/this.bossMaxHealth));
    }
    announce() {
        //It randomly selects a move.  this.moves is a list of moves passed into the parameter.
        //It will return the message of the boss. 

        this.selection = Math.floor(Math.random() * 4); //Number between 0-3
        //console.log("Rolling d4: "+ this.selection);
        //console.log("Move now: "+ this.moves[this.selection]);
        //let dice = this.selection+1;
        let type = this.moves[this.selection][0];
        currentBossmove = this.moves[this.selection][1];
        return type; 
    }
    turn() {
        //For future implmentation for return the turn number and what type of move the boss is doing.
        return this.moves[this.selection][1];
    }
    heal(n){
        if(this.bossHealth < 0) {
            this.bossHealth = 0;
        }
        else {
            this.bossHealth = this.bossHealth+n;
        }

        this.setValue(this.BosshealthBar,((this.bossHealth)/this.bossMaxHealth));
    }
}