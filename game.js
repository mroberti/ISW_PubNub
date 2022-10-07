const rand = Phaser.Math.Between;

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  pixelArt: true,
  scene: {
	preload: preload,
	create: create,
	update: update
  }
};

const game = new Phaser.Game(config);
let controls;
var ships = []
var shipGroup
var groupconfig = {
    classType: Phaser.GameObjects.Sprite,
    defaultKey: null,
    defaultFrame: null,
    active: true,
    maxSize: -1,
    runChildUpdate: true,
    createCallback: null,
    removeCallback: null,
    createMultipleCallback: null
}

function preload() {
	this.load.multiatlas('allships', '/assets/ships/allships.json', 'assets');
	this.load.image("background", "/assets/backgrounds/background2.jpg");
	// in preload()
	this.load.json('sheetdata', '/assets/ships/allships.json');
}

function MakeDraggable(theSprite,passedThis,passedCamera){
	// Let's put them randomly somewhere for now...

	theSprite.x = rand(1,passedCamera.width);
	theSprite.y = rand(1,passedCamera.height);
	theSprite.angle = rand(0,359);
	theSprite.setScale(.5);
	theSprite.on('pointerover', function () {
		this.setTint(0x00ff00);
	});

	theSprite.on('pointerout', function () {
		this.clearTint();
	});

	passedThis.input.setDraggable(theSprite);
	passedThis.input.on('dragstart', function (pointer, gameObject) {
		gameObject.setTint(0xff0000);
	});

	passedThis.input.on('drag', function (pointer, gameObject, dragX, dragY) {
		gameObject.x = dragX;
		gameObject.y = dragY;
	});

	passedThis.input.on('dragend', function (pointer, gameObject) {
		gameObject.clearTint();
	});
}

function BackgroundScroll(theSprite,passedThis){
	theSprite.setScale(.5);
	theSprite.on('pointerover', function () {
		this.setTint(0x00ff00);
	});

	theSprite.on('pointerout', function () {
		this.clearTint();
	});

	passedThis.input.setDraggable(theSprite);
	passedThis.input.on('dragstart', function (pointer, gameObject) {
		gameObject.setTint(0xff0000);
	});

	passedThis.input.on('drag', function (pointer, gameObject, dragX, dragY) {
		gameObject.tilePositionX = dragX;
		gameObject.tilePositionY  = dragY;
	});

	passedThis.input.on('dragend', function (pointer, gameObject) {
		gameObject.clearTint();
	});
}

function create() {
	InitPubNub();

	const helloButton = this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
    helloButton.setInteractive();

    helloButton.on('pointerover', () => { console.log('pointerover'); });
	helloButton.up('button up', () => { console.log('button up'); });

	// in create()
	let data = this.cache.json.get('sheetdata');
	

	// Phaser supports multiple cameras, but you can access the default camera like this:
	const camera = this.cameras.main;
	shipGroup = this.make.group(groupconfig);


	// Set up the arrows to control the camera
	const cursors = this.input.keyboard.createCursorKeys();
	controls = new Phaser.Cameras.Controls.FixedKeyControl({
		camera: camera,
		left: cursors.left,
		right: cursors.right,
		up: cursors.up,
		down: cursors.down,
		speed: 0.5
	});

	var background = this.add.tileSprite(0, 0, camera.width, camera.height, 'background').setInteractive();
	BackgroundScroll(background,this);
	var ships = ["e2 titan.png","e3 destroyer.png"];
	console.log("The stuff "+data.textures[0].frames[0].filename);

	// // Check for substring
	// var string = "foo",
    // substring = "oo";
	// console.log(string.includes(substring));

	for (let index = 0; index < data.textures[0].frames.length; index++) {
		var fileName = data.textures[0].frames[index].filename
		if(fileName.includes("e2")){
			var tempShip = this.add.sprite(0, 0, 'allships', fileName).setInteractive();
			MakeDraggable(tempShip,this,camera);
			shipGroup.add(tempShip);
			// group.add(gameObject, true);  // add this game object to display and update list of scene
		}
	}	
	
	// Help text that has a "fixed" position on the screen
	this.add
	.text(16, 16, "Arrow keys to scroll", {
		font: "18px monospace",
		fill: "#ffffff",
		padding: { x: 20, y: 10 },
		backgroundColor: "#00000000"
	})
	.setScrollFactor(0);
}

function InitPubNub(){
	console.log("Initializing PubNub hypothetically")
	this.pubnub = new PubNub({
		subscribeKey: _subscribeKey,
		publishKey: _publishKey,
		uuid: "player1"
	  });

	this.pubnub.addListener({
		message: function (m) {
		  // handle messages
		   console.log(m.message.description)
		},
		presence: function (p) {
		  // handle presence  
		},
		signal: function (s) {
		  // handle signals
		},
		objects: (objectEvent) => {
		  // handle objects
		},
		messageAction: function (ma) {
		  // handle message actions
		},
		file: function (event) {
		  // handle files  
		},
		status: function (s) {
		// handle status  
		},
	  });

	  
	Date.prototype.toUnixTime = function() { return this.getTime()/1000|0 };
	Date.time = function() { return new Date().toUnixTime(); }
	console.log("Date: "+Date.time());
	  // start, end, count are optional
	pubnub.fetchMessages(
		{
			channels: ['my_channel'],
			end: '1664910000000',
			count: 100
		},
		(status, response) => {
			console.log(response)
		}
	);

	  var publishPayload = {
		channel : "my_channel",
		message: {
			title: "greeting",
			description: "This is my first message!"
		}
	}

	var gameBoard = {
		"name":"Kobayashi Maru",
		"subject vessels": ["FR DD Reliant","FR DD Reliant"

		],
		"location": "3 points from Altair 6"
	}
		
	this.pubnub.subscribe({
		channels: ["my_channel"]
	});

	this.pubnub.publish(publishPayload, function(status, response) {
		console.log(status, response);
	})
}

function update(time, delta) {
	// Apply the controls to the camera each update tick of the game
	controls.update(delta);
	var gameObjects = shipGroup.getChildren();  // array of game objects
	for (let index = 0; index < gameObjects.length; index++) {
		tempShip = gameObjects[index];

		var speed_angle = tempShip.angle;
		var speed_length = 0.25;
		var tempSpeed = Phaser.Math

		var speed_x = speed_length * Math.cos(Phaser.Math.DegToRad(speed_angle));
		var speed_y = speed_length * Math.sin(Phaser.Math.DegToRad(speed_angle));
		tempShip.x = tempShip.x + speed_x;
		tempShip.y = tempShip.y + speed_y;

		
	}
}

