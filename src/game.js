const rand = Phaser.Math.Between;
const config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	parent: "game-tempShip",
	pixelArt: true,
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

const COLOR_PRIMARY = 0xAAAAAA;
const COLOR_LIGHT = 0x00EDFF;
const COLOR_DARK = 0x260e04;

var players = ["Jeremy","Mario","what"]
var pbinitialized = false;
var currentPlayer = null;

var content = 'Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.';

const game = new Phaser.Game(config);
let controls;
var shipGroup
var buttonGroup
var theUUID = null;

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
	this.load.path = 'assets/';
	this.load.multiatlas('ship_textures', '/ships/allships.json');
	this.load.json('ship_sheetdata', '/ships/allships.json');
	this.load.multiatlas('ui_textures', '/ui/ui.json');
	this.load.json('ui_sheetdata', '/ui/ui.json');
	this.load.image("background", "/backgrounds/starfield1.png");
	// The rexui plugin is required for the text box and other UI elements
	this.load.scenePlugin({key: 'rexuiplugin', url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', sceneKey: 'rexUI'});
	this.load.image('user', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/person.png');
	this.load.image('password', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/key.png');
}

function BackgroundScroll(theSprite, passedThis) {
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
		gameObject.tilePositionY = dragY;
	});

	passedThis.input.on('dragend', function (pointer, gameObject) {
		gameObject.clearTint();
	});
}

function create() {

	// in create()
	let ship_data = this.cache.json.get('ship_sheetdata');
	let ui_data = this.cache.json.get('ui_sheetdata');

	// Phaser supports multiple cameras, but you can access the default camera like this:
	const camera = this.cameras.main;
	shipGroup = this.make.group(groupconfig);
    //  Let's create 2 Groups
    buttonGroup = this.add.group();

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
	console.log("camera.height = " + camera.height);
	// var background = this.add.tileSprite(0, 0, camera.width*2, camera.height*2, 'background').setInteractive();
	var background = this.add.sprite(640, 360, 'background');
	background.setScale(2.5)
	// BackgroundScroll(background, this);
	var ships = ["e2 titan.png", "e1 titan.png"];
	console.log("The stuff " + ship_data.textures[0].frames[0].filename);

	// // Check for substring
	// var string = "foo",
	// substring = "oo";
	// console.log(string.includes(substring));

	this.print = this.add.text(0, 0, 'Use Arrow keys to scroll camera');

	var count = 0
	for (let i = 0; i < ships.length; i++) {
		var fileName = ship_data.textures[0].frames[i].filename
			var tempShip = this.add.sprite(0, 0, 'ship_textures', ships[i]).setInteractive();
			shipGroup.add(tempShip);
			tempShip.x = rand(1, camera.width);
			tempShip.y = rand(1, camera.height);
			tempShip.angle = parseInt(rand(0, 11) * 30);
			tempShip.setScale(.5);
			tempShip.name = "Ship " + i;

			this.input.setDraggable(tempShip);
			//  The pointer has to be held down for 500ms before it's considered a drag
			this.input.dragTimeThreshold = 250;

			this.input.on('dragstart', function (pointer, gameObject) {

				gameObject.setTint(0xff0000);
			});

			this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

				gameObject.x = dragX;
				gameObject.y = dragY;

			});

			this.input.on('dragend', function (pointer, gameObject) {
				console.log(gameObject.name)
				gameObject.clearTint();

			});


			this.print.text += count + '\n';
	}

	// Make buttons
	for (let i = 0; i < 3; i++) {
		var button = new BasicButton({
			'scene': this,
			'sheet_data': "ui_textures",
			'key': 'buttons',
			'down': "buttonOver.png",
			'up': "buttonOver2.png",
			'over': "buttonOver2.png",
			'x': 135,
			'y': 500 + (i * 50),
		});
		button.name = (i);
		console.log("Button " + button.name + " created");
		button.on('pointerup', function () {
			console.log("Button " + this.name + " pressed");
			currentPlayer = parseInt(this.name)
			console.log("currentPlayer = " + players[parseInt(this.name)]);
		});
	}

	var my_buttons = ["gui_lrotate_64.png","gui_move_64.png","gui_rrotate_64.png","gui_beam_64.png", "gui_missiles_64.png", "gui_beam_64.png"]
	// console.log("Size of fucking controls "+my_buttons.length)
	for (let i = 0; i < my_buttons.length; i++) {
		var button = new BasicButton({
			'scene': this,
			'sheet_data': "ui_textures",
			'key': 'buttons',
			'down': my_buttons[i],
			'up': my_buttons[i],
			'over': my_buttons[i],
			'x': (i*70)+32,
			'y': 685,
		});
		console.log("i = " + i);
		switch (i) {
			case 0:
				button.name = "turn left";
				break;
			case 1:
				button.name = "move forward";
				break;
			case 2:
				button.name = "turn right";
				break;
			default:
				button.name = "button " + (i+1);
				break;
		  }
		  console.log("Button " + button.name + " created");
		  button.on('pointerup', function () {
			console.log("Button " + this.name + " pressed");
			switch (this.name) {
				case "turn left":
					TurnLeft()
					break;
				case "move forward":
					MoveForward()
					break;
				case "turn right":
					TurnRight()
					break;
			}
		});
	}

	// RexUI Radio buttons for detecting presence
	var CheckboxesMode = false;  // False = radio mode

	var buttons = this.rexUI.add.buttons({
		x: 400, y: 300,
		orientation: 'y',
		background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY),
		buttons: [
			createButton(this, players[0]),
			createButton(this, players[1]),
		],
		type: ((CheckboxesMode) ? 'checkboxes' : 'radio'),
		setValueCallback: function (button, value) {
			button.getElement('icon')
				.setFillStyle((value)? COLOR_LIGHT : undefined);
		}
	}).layout()
	//.drawBounds(this.add.graphics(), 0xff0000)

	// Dump states
	var print = this.add.text(0, 0, '');
	var dumpButtonStates = function () {
		if (CheckboxesMode) { // checkboxes
			var s = '';
			buttons.data.each(function (buttons, key, value) {
				s += `${key}:${value}\n`

			})
			print.setText(s);
	
			} else { // radio
			print.setText(buttons.value);
			console.log(buttons.value)
			switch (buttons.value) {
				// jeremy UUID = 'd03e9034-c275-4241-b046-0ea2299dad02'
				// mario's UUID = '5227a8bc-9fdc-42e3-8680-979f09df879d'
				case "Jeremy":
					InitPubNub('d03e9034-c275-4241-b046-0ea2299dad02')
					break;
				case "Mario":
					InitPubNub('5227a8bc-9fdc-42e3-8680-979f09df879d')
					break;
				default:
					break;
			}
		}
	}
	buttons.on('button.click', dumpButtonStates);
	dumpButtonStates();

	
}

var createButton = function (scene, text, name) {
    if (name === undefined) {
        name = text;
    }
    var button = scene.rexUI.add.label({
        width: 100,
        height: 40,
        text: scene.add.text(0, 0, text, {
            fontSize: 18
        }),
        icon: scene.add.circle(0, 0, 10).setStrokeStyle(1, COLOR_DARK),
        space: {
            left: 10,
            right: 10,
            icon: 10
        },

        name: name
    });

    return button;
}


function InitPubNub(uuid) {

	if(pbinitialized == false){
		pbinitialized = true
		// jeremy UUID = 'd03e9034-c275-4241-b046-0ea2299dad02'
		// mario's UUID = '5227a8bc-9fdc-42e3-8680-979f09df879d'
		console.log("uuid = " + uuid);
		console.log("Initializing PubNub hypothetically")
		this.pubnub = new PubNub({
			subscribeKey: _subscribeKey,
			publishKey: _publishKey,
			uuid: uuid
		});

		this.pubnub.addListener({
			message: function (m) {
				// handle messages
				if(m.message.title=="game_turn_v1"){
					console.log("Process game turn!!!!!")
					ProcessReceivedTurn(m)
				}
			},
			presence: function (p) {
				var action = p.action;
				var channelName = p.channel;
				var occupancy = p.occupancy;
				var eventTimetoken = p.timetoken;
				var occupantUUID = p.uuid;
				var state = p.state;
				var subscribeManager = p.subscription;
				console.log("Presence response: User: "+p.uuid+" "+action)  
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


		// start, end, count are optional
		// pubnub.fetchMessages(
		// 	{
		// 		channels: ['my_channel'],
		// 		end: '1665861716860',
		
		
		// 		count: 100
		// 	},
		// 	(status, response) => {
		// 		console.log(response)
		// 	}
		// );

		this.pubnub.subscribe({
			channels: ["my_channel"],
			withPresence: true
		});

		// I think once this is done, you can comment it out. Should last for
		// The life of the channel?
		// 
		// this.pubnub.objects.setChannelMetadata({
		// 	channel: "my_channel",
		// 	data: {
		// 	  name: "Starfleet Emergency Channel",
		// 	  description: "This frequency is for Starfleet Emergency broadcasts only.",
		// 	  custom: { "owner": "Federation President" }
		// 	}
		// });

		console.log(this.pubnub.objects.getChannelMetadata({
			channel: "my_channel"
		}));
		console.log("Moist: "+this.pubnub.objects.getMemberships());


	}else{
		console.log("PubNub already initialized")
	}
}

function onDown (sprite) {
    text = "onDown: " + sprite.name;
    sprite.tint = 0x00ff00;
}

function update(time, delta) {
	// // Apply the controls to the camera each update tick of the game
	// controls.update(delta);
	// var gameObjects = shipGroup.getChildren();
	// for (let index = 0; index < gameObjects.length; index++) {
	// 	tempShip = gameObjects[index];

	// 	var speed_angle = tempShip.angle;
	// 	var speed_length = 0.25;
	// 	var tempSpeed = Phaser.Math

	// 	var speed_x = speed_length * Math.cos(Phaser.Math.DegToRad(speed_angle));
	// 	var speed_y = speed_length * Math.sin(Phaser.Math.DegToRad(speed_angle));
	// 	tempShip.x = tempShip.x + speed_x;
	// 	tempShip.y = tempShip.y + speed_y;
	// }
}

function LevelSet(){

}

function MoveForward(){
	var publishPayload = {
		channel: "my_channel",
		message: {
			title: "game_turn_v1",
			player: currentPlayer,
			type: "move forward",
			// bonus:"The WYN Star Cluster stands as a huge (50 parsecs diameter) beacon at the crossroads of the Galaxy. Marking the point where the Klingon, Lyran, and Kzinti borders meet, the cluster itself was long considered uninhabitable. Surrounded by a dense cloud of highly radioactive dust, it was assumed that the entire cluster was saturated with deadly radiation. For more than a century, no one tried to find out otherwise."
		}
	}
	this.pubnub.publish(publishPayload, function (status, response) {
		console.log(status, response);
	})
}

function TurnLeft(){
	var publishPayload = {
		channel: "my_channel",
		message: {
			title: "game_turn_v1",
			player: currentPlayer,
			type: "turn left"
		}
	}
	this.pubnub.publish(publishPayload, function (status, response) {
		console.log(status, response);
	})
}

function TurnRight(){
	var publishPayload = {
		channel: "my_channel",
		message: {
			title: "game_turn_v1",
			player: currentPlayer,
			type: "turn right"
		}
	}
	this.pubnub.publish(publishPayload, function (status, response) {
		console.log(status, response);
	})
}

function ProcessReceivedTurn(m){
	console.log(m.message)
	var tempShip = shipGroup.getChildren()[currentPlayer];
	switch (m.message.type) {
		case "move forward":
			console.log("Move forward")
			break;
		case "turn left":
			console.log("Turn left")
			break
		case "turn right":
			console.log("Turn right")
			break
		case "update location":
			console.log("update location")
			break
		default:
			console.log("No actionable turn...")
	}
	
	// var tempShip = shipGroup.getChildren()[currentPlayer];
	// // Move Forward
	// var tempShip = shipGroup.getChildren()[currentPlayer];
	// var speed_length = 30.25;
	// var speed_x = speed_length * Math.cos(Phaser.Math.DegToRad(tempShip.angle));
	// var speed_y = speed_length * Math.sin(Phaser.Math.DegToRad(tempShip.angle));
	// tempShip.x = tempShip.x + speed_x;
	// tempShip.y = tempShip.y + speed_y;	
	// this.pubnub.publish(publishPayload, function (status, response) {
	// 	console.log(status, response);
	// })

	// Turn left
	// tempShip.angle = (tempShip.angle-=30)%360;

	// Turn Right
	// tempShip.angle = (tempShip.angle+=30)%360;
}

// {
// 	"mission": "Probing the WYN Cluster",
// 	"description": "Metro City",
// 	"Created": 1231231231,
// 	"active": true,
// 	"players": [
// 	  {
// 		"name": "Mario",
// 		"ships": [
// 		  "CR Orion",
// 		  "CV Lyran",
// 		  "FF Kzinti",
// 		  "CR Orion",
// 		  "CV Lyran",
// 		  "FF Kzinti"
// 		]
// 	  },
// 	  {
// 		"name": "Jeremy",
// 		"ships": [
// 		  "DD Klingon",
// 		  "CV Klingon",
// 		  "FF Klingon",
// 		  "DD Klingon"
// 		]
// 	  }
// 	],
// 	"whose turn": "Jeremy"
//   }
