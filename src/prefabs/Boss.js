class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, moves, maxHealth, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        //this.name = name;
        this.bossHealth = 100;
        this.bossMaxHealth = maxHealth;
        this.moves = moves;
        this.selection = -1;
    }
    
    create() {
        
        //this.healthBar = this.add.sprite(game.config.width/2, game.config.height/2, 'healthBar');
        //this.healthMask = this.make.graphics();
        //this.healthMask.fillRect(x, y, 100, 10);
        //this.healthBar.mask = new Phaser.Display.Masks.GraphicsMask(this, this.healthMask);
        
    }

    damage(n) {
        
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
        this.selection = Math.floor(Math.random() * 4);
        console.log("Rolling d4: "+ this.selection);
        //console.log("Move now: "+ this.moves[this.selection]);
        let dice = this.selection+1;
        return "I rolled a " + dice +".  \n\n" + this.moves[this.selection];
    }
    turn() {
        return this.moves[this.selection][1];
    }
}