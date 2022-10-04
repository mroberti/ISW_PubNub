const gameState = {
	score: 0
}

function preload () {
	this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
	this.load.image('codey', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/codey.png');
	this.load.multiatlas('ships', 'assets/ships.json', 'assets');
}

function create () {
	pubnub.PubNub({
		subscribeKey: string,
		publishKey: string,
		cipherKey: string,
		authKey: string,
		logVerbosity: boolean,
		userId: string
		ssl: boolean,
		origin: string,
		presenceTimeout: number,
		heartbeatInterval: number,
		restore: boolean,
		keepAlive: boolean,
		keepAliveSettings: any,
		useInstanceId: boolean,
		suppressLeaveEvents: boolean,
		requestMessageCountThreshold: number,
		autoNetworkDetection: boolean,
		listenToBrowserNetworkEvents: boolean
		// Deprecated, use userId instead
		userId: string,
	  });
	  
	const platforms = this.physics.add.staticGroup();
 
	platforms.create(320, 350, 'platform').setScale(2, 0.5).refreshBody();

	gameState.scoreText = this.add.text(320, 340, 'Score: 0', { fontSize: '15px', fill: '#000' })

	this.player = this.physics.add.sprite(320, 300, 'ships', 'e7 titan.png').setScale(.15);
	
	this.player.setCollideWorldBounds(true);

	this.physics.add.collider(this.player, platforms)

	const bugs = this.physics.add.group();

	const bugList = ['e7 titan.png', 'e2 titan.png', 'e1 titan.png']

	const bugGen = () => {
		const xCoord = Math.random() * 640
		let randomBug = bugList[Math.floor(Math.random() * 3)]
		bugs.create(xCoord, 10, randomBug)
	}

	const bugGenLoop = this.time.addEvent({
		delay: 100,
		callback: bugGen,
		loop: true,
	});


	this.physics.add.collider(bugs, platforms, function (bug){
		bug.destroy();
		gameState.score += 10;
		gameState.scoreText.setText(`Score: ${gameState.score}`)		
	})

	this.physics.add.collider(this.player, bugs, () => {
			bugGenLoop.destroy();
			this.physics.pause();

			this.add.text(280, 150, 'Game Over \n Click to Restart', { fontSize: '15px', fill: '#000' })
			gameState.score = 0

			this.input.on('pointerdown', () => {
				this.scene.restart();
			})
	})

}

function update () {
	const cursors = this.input.keyboard.createCursorKeys();

	if(cursors.left.isDown){
		this.player.setVelocityX(-200)
	} else if (cursors.right.isDown) {
		this.player.setVelocityX(200)
	} else {
		this.player.setVelocityX(0);
	}

}

const config = {
  type: Phaser.AUTO,
  width: 1280,
	height: 800,
	backgroundColor: "b9eaff",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 200},
			enableBody: true,
			debug: false,
		}
	},
  scene: {
		preload,
		create,
		update
	}
}

const game = new Phaser.Game(config)
