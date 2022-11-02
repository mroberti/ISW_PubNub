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

const channel_name =""

const COLOR_PRIMARY = 0xAAAAAA;
const COLOR_LIGHT = 0x00EDFF;
const COLOR_DARK = 0x260e04;

// var players = ["Craig","Mario","Marcus","Jeremy"]
var players = ["Craig","Mario"]
var pbinitialized = false;
var currentPlayer = null;
var ship_types=["scout","fighters","transport","destroyer","dreadnought","heavy cruiser","titan","light carrier","starbase","strike carrier","assault carrier",
"super dreadnought"]

var gameBoard = {}
gameBoard.players = players;



const game = new Phaser.Game(config);
let controls;
var shipGroup
var theUUID = null;
var ship_stats = null

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
	this.load.json('ship_stats', 'data/shipdata.json');
	this.load.json('federation_ship_names', '/data/federation_ship_names.json');
	this.load.json('klingon_ship_names', '/data/klingon_ship_names.json');
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

function create() {
	ship_stats = this.cache.json.get('ship_stats');
	var federation_ship_names = this.cache.json.get('federation_ship_names');
	var klingon_ship_names = this.cache.json.get('klingon_ship_names');

	console.log(ship_stats[random_item(ship_types)]);	//console.log(ship_stats["assault carrier"]);


	// Phaser supports multiple cameras, but you can access the default camera like this:
	const camera = this.cameras.main;
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
	shipGroup = this.make.group(groupconfig);

	var background = this.add.sprite(640, 360, 'background');
	background.setScale(2.5)


	this.print = this.add.text(0, 0, 'Use Arrow keys to scroll camera');

	// My empire graphics are for ships from empires e1,e2, and e7
	// so I gotta do some skulduggery here. Create ships for the 4 players.
	for (let i = 0; i < players.length; i++) {
		gameBoard.players[i].ships = {}
		for (let j = 0; j < 2; j++) {
			var shipName = ""
			if(i==0){
				empireNumber = 1
				shipName="USS "+random_item(federation_ship_names);
			}
			if(i==1){
				empireNumber = 2
				shipName="IKV "+random_item(klingon_ship_names);
			}
			if(i==2){
				empireNumber = 7
				shipName="USS "+random_item(federation_ship_names);
			}
			if(i==3){
				empireNumber = 1
				shipName="IKV "+random_item(klingon_ship_names);
			}
			var tempShip = new GamePiece(this, 1280,720);
			var data = ship_stats[random_item(ship_types)]
			// console.log(data)
			data.name = shipName
			data.owner = players[i]
			// console.log("Attempting to use graphic "+data.shipclass)
			// console.log("URL composition "+"e"+empireNumber+" "+data.shipclass+".png")
			tempShip.InitializePiece('ship_textures', "e"+empireNumber+" "+data.shipclass+".png",data)
			console.log(data)
			tempShip.setSize(100,100);
			shipGroup.add(tempShip);
			tempShip.x = rand(1, camera.width);
			tempShip.y = rand(1, camera.height);
			tempShip.list[0].angle = parseInt(rand(0, 11) * 30);

			tempShip.setSize(100,100);
			tempShip.setInteractive({ draggable: true });
			//  The pointer has to be held down for 500ms before it's considered a drag
			this.input.dragTimeThreshold = 50;

			this.input.on('dragstart', function (pointer, gameObject) {
				gameObject.list[0].setTint(0xff0000);
				this.scene.tweens.add({
					targets: gameObject,
					scale: .75,
					duration: 100,
					ease: 'Sine.easeInOut',
					completeDelay: 1000,
					yoyo: true
				});
			});
		}
	}

	this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
		gameObject.x = dragX;
		gameObject.y = dragY;
	});

	this.input.on('dragend', function (pointer, gameObject) {
		console.log(gameObject.name)
		gameObject.list[0].clearTint();
	});

	InitLoginButtons(this)

}

function random_item(items)
{
	return items[Math.floor(Math.random()*items.length)];
}

function InitLoginButtons(scene){
	// RexUI Radio buttons for detecting presence
	var CheckboxesMode = false;  // False = radio mode
	console.log("Bonus "+PubNub.generateUUID())
	var buttons = scene.rexUI.add.buttons({
		x: 400, y: 300,
		orientation: 'y',
		// background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY),
		background: scene.add.sprite(0, 0, "ui_textures", "shipPanel.png").setScale(2.5),
		buttons: [
			createButton(scene, players[0]),
			createButton(scene, players[1]),
		],
		type: ((CheckboxesMode) ? 'checkboxes' : 'radio'),
		setValueCallback: function (button, value) {
			button.getElement('icon')
				.setFillStyle((value)? COLOR_LIGHT : undefined);
		},
	}).layout()
	//.drawBounds(this.add.graphics(), 0xff0000)

	// Dump states
	var print = scene.add.text(0, 0, '');
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
				// Observer's UUID = 'e91f6ebc-52f8-11ed-bdc3-0242ac120002'
				case "Marcus":
					InitPubNub('d03e9034-c275-4241-b046-0ea2299dad02')
					currentPlayer = 0
					break;
				case "Mario":
					InitPubNub('5227a8bc-9fdc-42e3-8680-979f09df879d')
					currentPlayer = 1
					break;
				case "Jeremy":
					InitPubNub('e91f6ebc-52f8-11ed-bdc3-0242ac120002')
					currentPlayer = 2
					break;
				case "Craig":
					InitPubNub('ea409541-44f1-401d-8afa-833fe2e9b580')
					currentPlayer = 2
					break;
				default:
					break;
			}
		}
	}
	buttons.on('button.click', dumpButtonStates);
	dumpButtonStates();
	// Create the GUI buttons
	var my_buttons = ["gui_lrotate_64.png","gui_move_64.png","gui_rrotate_64.png","gui_beam_64.png", "gui_missiles_64.png", "gui_beam_64.png"]
	for (let i = 0; i < my_buttons.length; i++) {
		var button = new BasicButton({
			'scene': scene,
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
				if(m.message.title=="update channel metadata"){
					console.log(this.pubnub.objects.getChannelMetadata({
						channel: "my_channel"
					}));
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

		// console.log(this.pubnub.objects.getChannelMetadata({
		// 	channel: "my_channel"
		// }));
		console.log("getMemberships: "+this.pubnub.objects.getMemberships());

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
	controls.update(delta);
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

	this.pubnub.hereNow(
		{
		  channels: ["my_channel"],
		  includeState: true
		},
		function (status, response) {
		  console.log(status, response);
		  console.log(response.channels.my_channel.occupants)
		  for (let i = 0; i < response.channels.my_channel.occupants.length; i++) {
			console.log("UUID #"+i+":"+response.channels.my_channel.occupants[i].uuid);
		  }
		}
	);
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
	console.log("Random UUID: "+PubNub.generateUUID());
}

function TurnRight(){
	// var publishPayload = {
	// 	channel: "my_channel",
	// 	message: {
	// 		title: "game_turn_v1",
	// 		player: currentPlayer,
	// 		type: "turn right"
	// 	}
	// }
	// this.pubnub.publish(publishPayload, function (status, response) {
	// 	console.log(status, response);
	// })

	// I think once this is done, you can comment it out. Should last for
	// The life of the channel?
	// 
	
	this.pubnub.objects.setChannelMetadata({
		channel: "my_channel",
		title: "update channel metadata",
		data: {
			name: "Ermagherd Starfleet Emergency Channel",
			description: "This frequency is for Starfleet Emergency broadcasts only.",
			moisture: "wet",
			sandwich: "tuna",
			custom: { "owner": "Federation President",
					  "location": "Earth",
					  "purpose": "Emergency",
					  "ship": JSON.stringify(ship_stats[random_item(ship_types)])
		}
	}
	},function (status, response) {
		console.log(status, response.data.custom.ship);
	});
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
