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

	

	pubnub = new PubNub({
		subscribeKey: "sub-c-145f75fb-ad86-47bb-b8cb-daefe1fd6a0c",
		publishKey: "pub-c-c09f0e14-9b62-451b-abfa-bd0830adc01c",
		uuid: "player1"
	  });

	const newMessage = {
		text: "Hi There!",
	};
	
	pubnub.publish({
		message: newMessage,
		channel: "my_channel",
	});

	// paste below "add listener" comment
	const listener = {
		status: (statusEvent) => {
			if (statusEvent.category === "PNConnectedCategory") {
				// Help text that has a "fixed" position on the screen
				this.add
				.text(16, 16, "Connected to dem sweet sweet PubNubbery", {
					font: "18px monospace",
					fill: "#ffffff",
					padding: { x: 60, y: 10 },
					backgroundColor: "#00000000"
				})
				console.log("Damn you sir: ", result);
			}
		},
		message: (messageEvent) => {
			showMessage(messageEvent.message.description);
			console.log("message published w/ server response: ", result);
		},
		presence: (presenceEvent) => {
			// handle presence
		}
	};
	pubnub.addListener(listener);


	var background = this.add.tileSprite(0, 0, camera.width, camera.height, 'background').setInteractive();
	BackgroundScroll(background,this);
	var ships = ["e2 titan.png","e3 destroyer.png"];
	console.log("The stuff "+data.textures[0].frames[0].filename);
	var string = "foo",
    substring = "oo";
	console.log(string.includes(substring));
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

