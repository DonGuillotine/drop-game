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
}

function create() {
    this.add.image(400, 300, 'greenFlower');

    this.score = 0;
    this.timer = 30;

    this.timerText = this.add.text(16, 16, 'Timer: ' + this.timer, { fontSize: '32px', fill: '#000' });
    this.scoreText = this.add.text(16, 50, 'Score: ' + this.score, { fontSize: '32px', fill: '#000' });

    
}

function update() {
    
}
