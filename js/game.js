var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('greenFlower', 'assets/greenFlower.png');
    this.load.image('blueFlower', 'assets/blueFlower.png');
    this.load.image('goldFlower', 'assets/goldFlower.png');
    
    this.load.audio('collectSound', 'assets/sounds/collect.mp3');
    this.load.audio('missSound', 'assets/sounds/miss.mp3');
    this.load.audio('bgMusic', 'assets/sounds/bgMusic.mp3');
}

function create() {
    this.add.image(400, 300, 'greenFlower');
    this.score = 0;
    this.timer = 30;

    this.timerText = this.add.text(16, 16, 'Timer: ' + this.timer, { fontSize: '32px', fill: '#000' });
    this.scoreText = this.add.text(16, 50, 'Score: ' + this.score, { fontSize: '32px', fill: '#000' });

    this.itemsGroup = this.physics.add.group();

    this.time.addEvent({
        delay: 1000,
        callback: this.spawnItem,
        callbackScope: this,
        loop: true
    });

    this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
    });
}

function update() {
    Phaser.Actions.IncY(this.itemsGroup.getChildren(), 2);

    this.itemsGroup.children.iterate(function (item) {
        if (item.y > 600) {
            item.destroy();
        }
    });
}

function spawnItem() {
    var x = Phaser.Math.Between(50, 750);
    var itemType = Phaser.Math.Between(1, 10);

    var newItem;

    if (itemType <= 7) {
        newItem = this.itemsGroup.create(x, 0, 'greenFlower');
        newItem.points = 10;
    } else if (itemType <= 9) {
        newItem = this.itemsGroup.create(x, 0, 'blueFlower');
        newItem.points = 50;
        newItem.setScale(0.7);
    } else {
        newItem = this.itemsGroup.create(x, 0, 'goldFlower');
        newItem.points = 100;
        newItem.setScale(0.9);
        newItem.specialEffect = 'freezeTimer';
    }

    newItem.setInteractive();
    var baseSpeed = 50 + (30 - this.timer) * 5;
    var fallSpeed = Phaser.Math.Between(baseSpeed, baseSpeed + 50);
    newItem.setVelocityY(fallSpeed);

    newItem.on('pointerdown', function () {
        this.collectItem(newItem);
    }, this);
}

function collectItem(item) {
    this.score += item.points;
    this.scoreText.setText('Score: ' + this.score);

    if (item.specialEffect === 'freezeTimer') {
        this.freezeTimer();
    }

    var particles = this.add.particles('greenFlower');
    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 0.5, end: 0 },
        lifespan: 600
    });
    emitter.explode(5, item.x, item.y);

    item.destroy();
}

function updateTimer() {
    this.timer--;
    this.timerText.setText('Timer: ' + this.timer);

    if (this.timer === 0) {
        this.endGame();
    }
}

function endGame() {
    this.time.removeAllEvents();

    this.add.text(300, 250, 'Game Over!', { fontSize: '64px', fill: '#f00' });
    this.add.text(300, 320, 'Final Score: ' + this.score, { fontSize: '32px', fill: '#000' });

    this.time.delayedCall(3000, function () {
        this.scene.restart();
    }, [], this);
}

function freezeTimer() {
    this.time.addEvent({
        delay: 3000,
        callback: function () {
        },
        callbackScope: this
    });
}