class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, name, moves, maxHealth, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.name = name;
        this.bossHealth = 0;
        this.bossMaxHealth = maxHealth;
        this.moves = moves;
        this.selection = -1;
    }
    create() {
        this.healthBar = this.add.sprite(game.config.width/2 - 50, game.config.height - 20, 'healthBar');
        this.healthMask = this.make.graphics();
        this.healthMask.fillRect(x, y, 100, 10);
        this.healthBar.mask = new Phaser.Display.Masks.GraphicsMask(this, this.healthMask);
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
            x: x + newWidth,
            onComplete: () => {
                this.healthMask.clear();
                this.healthMask.fillRect(x, y, newWidth, height);
            },
        });
    }
    announce() {
        this.selection = Math.random() * this.moves.size;
        return this.moves[this.selection][0];
    }
    turn() {
        return this.moves[this.selection][1];
    }
}