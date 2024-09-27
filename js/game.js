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
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('greenFlower', 'assets/greenFlower.png');
    this.load.image('blueFlower', 'assets/blueFlower.png');
    this.load.image('goldFlower', 'assets/goldFlower.png');
    
    this.load.audio('collectSound', 'assets/sounds/collect.wav');
    this.load.audio('missSound', 'assets/sounds/miss.wav');
    this.load.audio('bgMusic', 'assets/sounds/bgMusic.mp3');
}


function create() {
    this.muteButton = this.add.text(700, 16, 'Mute', { fontSize: '32px', fill: '#000' });
    this.muteButton.setInteractive();
    this.muteButton.on('pointerdown', function () {
        this.toggleMute();
    }, this);

    this.bgMusic = this.sound.add('bgMusic');
    this.bgMusic.play({ loop: true, volume: 0.5 });

    this.collectSound = this.sound.add('collectSound');
    this.missSound = this.sound.add('missSound');

    var greenFlower = this.add.image(400, 300, 'greenFlower');
    greenFlower.setScale(0.1);
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
    console.log("I ran very well")
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
        newItem.setDisplaySize(100, 100);
        newItem.points = 10;
    } else if (itemType <= 9) {
        newItem = this.itemsGroup.create(x, 0, 'blueFlower');
        newItem.setDisplaySize(120, 120);
        newItem.points = 50;
    } else {
        newItem = this.itemsGroup.create(x, 0, 'goldFlower');
        newItem.setDisplaySize(150, 150);
        newItem.points = 100;
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

    this.collectSound.play();

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
    this.itemsGroup.clear(true, true);

    this.add.text(300, 200, 'Game Over!', { fontSize: '64px', fill: '#f00' });
    this.add.text(300, 270, 'Your Score: ' + this.score, { fontSize: '32px', fill: '#000' });

    var highScore = localStorage.getItem('highScore') || 0;
    if (this.score > highScore) {
        highScore = this.score;
        localStorage.setItem('highScore', highScore);
    }
    this.add.text(300, 320, 'High Score: ' + highScore, { fontSize: '32px', fill: '#000' });

    var restartButton = this.add.text(300, 400, 'Restart', { fontSize: '32px', fill: '#00f' });
    restartButton.setInteractive();
    restartButton.on('pointerdown', function () {
        this.scene.restart();
    }, this);

    var shareButton = this.add.text(300, 450, 'Share', { fontSize: '32px', fill: '#00f' });
    shareButton.setInteractive();
    shareButton.on('pointerdown', function () {
        alert('Share your score: ' + this.score);
    }, this);
}

function freezeTimer() {
    this.time.addEvent({
        delay: 3000,
        callback: function () {
        },
        callbackScope: this
    });
}

function toggleMute() {
    if (this.bgMusic.isPlaying) {
        this.bgMusic.pause();
        this.collectSound.setMute(true);
        this.missSound.setMute(true);
        this.muteButton.setText('Unmute');
    } else {
        this.bgMusic.resume();
        this.collectSound.setMute(false);
        this.missSound.setMute(false);
        this.muteButton.setText('Mute');
    }
}