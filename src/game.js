const rand = Phaser.Math.Between;
const config = {
	type: Phaser.AUTO,
	width: 1800,
	height: 1080,
	parent: "game",
	pixelArt: false,
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};
// this.data = data
// this.uuid = this.data.uuid
// this.empire = this.data.empire
// this.name = this.data.name
const channel_name =""

var presence_panel

const COLOR_PRIMARY = 0xAAAAAA;
const COLOR_LIGHT = 0x77FF22;
const COLOR_DARK = 0x260e04;
const ONLINE = 0x77FF22;
const OFFLINE = 0xFF2200;

var players = ["Mukul","Mario","Marcus","Jeremy"]
var players2 = {"d03e9034-c275-4241-b046-0ea2299dad02":"Marcus","5227a8bc-9fdc-42e3-8680-979f09df879d":"Mario","e91f6ebc-52f8-11ed-bdc3-0242ac120002":"Jeremy","ea409541-44f1-401d-8afa-833fe2e9b580":"Mukul"}

var pbinitialized = false;
var currentPlayer = null;
var ship_types=["scout","transport","destroyer","dreadnought","heavy cruiser","titan","light carrier","strike carrier","assault carrier",
"super dreadnought"]

const game = new Phaser.Game(config);
let controls;
var shipGroup
var theUUID = null;
var ship_stats = null
var gameBoard = null;
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
	this.load.image("background", "/backgrounds/background2.jpg");
	this.load.image("romulan", "/ui/romulan.png");
	// The rexui plugin is required for the text box and other UI elements
	this.load.scenePlugin({key: 'rexuiplugin', url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', sceneKey: 'rexUI'});
	this.load.plugin('rexninepatch2plugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatch2plugin.min.js', true);
	this.load.image('user', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/person.png');
	this.load.image('password', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/key.png');
	this.load.image("bg2", "/ui/theme 4/9slicewindow1.png");
	this.load.image("radio on", "/ui/radio button on.png");
	this.load.image("radio off", "/ui/radio button off.png");
}

function create() {
	ship_stats = this.cache.json.get('ship_stats');
	var federation_ship_names = this.cache.json.get('federation_ship_names');
	var klingon_ship_names = this.cache.json.get('klingon_ship_names');

	gameBoard = new GameBoard(new Date(),"d03e9034-c275-4241-b046-0ea2299dad02","Who invited the Romulans?","Several galactic powers are meeting to decide how to deal with the threat of Romulan Aggression. Each player sends out [bold]one[/bold] ship to the meeting, but the Romulans launch a surprise raid. You negotiate a quick alliance and respond to the attack.");
	// Begin test of Gameboard and Player classes
	for (const [uuid, name] of Object.entries(players2)) {
		// console.log(uuid, name);
		var data = {}
		data.name = name
		data.uuid = uuid
		data.empire = Math.floor(Math.random()*3)+1
		if(data.empire==3){
			data.empire = 7
		}
		var tempPlayer = new Player(data);
		gameBoard.AddPlayer(tempPlayer);
	}

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

	var background = this.add.sprite(0, 0, 'background');
	background.setScale(3.0)


	this.print = this.add.text(0, 0, 'Use Arrow keys to scroll camera');

	// My empire graphics are for ships from empires e1,e2, and e7
	// so I gotta do some skulduggery here. Create ships for the 4 players.
	for (let i = 0; i < players.length; i++) {
		for (let j = 0; j < 2; j++) {
			var shipName = ""
			switch (i) {
				case 0:
					empireNumber = 1
					shipName="USS "+random_item(federation_ship_names);					
					break;
				case 1:
					empireNumber = 2
					shipName="IKV "+random_item(klingon_ship_names);				
					break;
				case 2:
					empireNumber = 7
					shipName="USS "+random_item(federation_ship_names);				
					break;
				case 3:
					empireNumber = 1
					shipName="IKV "+random_item(klingon_ship_names);					
					break;
									
				default:
					break;
			}
			var tempShip = new Ship(this, 1280,720);
			var data = ship_stats[random_item(ship_types)]
			data.name = shipName
			data.owner = players[i]
			tempShip.InitializePiece('ship_textures', "e"+empireNumber+" "+data.shipclass+".png",data)
			tempShip.setSize(100,100);
			shipGroup.add(tempShip);
			tempShip.x = rand(1, camera.width);
			tempShip.y = rand(1, camera.height);
			tempShip.list[0].angle = parseInt(rand(0, 11) * 30);
			tempShip.setSize(100,100);
			tempShip.setInteractive({ draggable: true });
			//  The pointer has to be held down for 500ms before it's considered a drag
			this.input.dragTimeThreshold = 50;
			gameBoard.players[i].AddShip(tempShip)
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
	console.log(gameBoard.Serialize())

	this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
		gameObject.x = dragX;
		gameObject.y = dragY;
	});

	this.input.on('dragend', function (pointer, gameObject) {
		console.log(gameObject.name)
		console.log("X,Y = "+gameObject.x+","+gameObject.y)
		gameObject.list[0].clearTint();
	});

	presence_panel = DisplayPlayerPresence(this)
	// console.log("Presence panel "+presence_panel.buttons[0].getElement('icon').setFillStyle(ONLINE))
	InitLogonButtons(this)
	InitGUIButtons(this)  
	var tempBox = createTextBox(this, 1200, 800, 500, 200, {
		wrapWidth: 500,
		fixedWidth: 500,
		fixedHeight: 65,
	})
	.start("[weight=900][color=orange]Mission:[/color][/weight] [weight=900][color=turquoise]Who invited the Romulans?[img=romulan][/color][/weight]\n\nSeveral galactic powers are meeting to decide how to deal with the threat of [weight=900][color=lime][shadow]Romulan Aggression[/shadow][/color][/weight]. \n\nEach player sends out [weight=900]one[/weight] ship to the meeting, but the Romulans launch a surprise raid. You negotiate a quick alliance and respond to the attack.", 50);

	// var timedEvent = this.time.delayedCall(3000, EndYou, [], this);
	
	// function EndYou(){
	// 	tempBox.destroy()
	// }
}

var createTextBox = function (scene, x, y, width, height, config) {
    var wrapWidth = width;
    var fixedWidth = width;
    var fixedHeight = height;
    var textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 2, 0x000000)
                .setStrokeStyle(2, COLOR_LIGHT),

            // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
            text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

            action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            }
        })
        .setOrigin(0)
        .layout();

    textBox
        // .setInteractive({ draggable: true })
        .on('pointerdown', function () {
            var icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                return;
            }

            var icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            icon.y -= 30;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)
    //.on('type', function () {
    //})

    return textBox;
}

var getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add.text(0, 0, '', {
            fontSize: '20px',
            wordWrap: {
                width: wrapWidth
            },
            maxLines: 3
        })
        .setFixedSize(fixedWidth, fixedHeight);
}

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '16px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 30
    })
}

function random_item(items)
{
	return items[Math.floor(Math.random()*items.length)];
}

function InitLogonButtons(scene){
	var buttons = scene.rexUI.add.buttons({
		x: 100, y: 300,
		orientation: 'y',
		background: 	// console.log("Testing UUID key: "+players2["d03e9034-c275-4241-b046-0ea2299dad02"])
		scene.add.rexNinePatch2({
			x: 500, y: 450,
			key: "bg2",
			columns: [20, undefined, 20],
			rows: [20, undefined, 20],
		}),
		buttons: [
			createButton(scene, 'Mukul'),
			createButton(scene, 'Mario'),
			createButton(scene, 'Marcus'),
			createButton(scene, 'Jeremy'),
		],

		space: { item: 8 }

	})
	// Add a header child, which is not part of buttons
	.add(createButton(scene, 'Choose a player'),
		{
			index: 0
		}
	)
	// Add a footer child, which is not part of buttons
	.add(createButton(scene, 'Footer'))
	.layout()
	buttons
		.on('button.click', function (button, index, pointer, event) {
			console.log("Click button: "+ button.text)
			switch (button.text) {
				// jeremy UUID = 'd03e9034-c275-4241-b046-0ea2299dad02'
				// mario's UUID = '5227a8bc-9fdc-42e3-8680-979f09df879d'
				// Observer's UUID = 'e91f6ebc-52f8-11ed-bdc3-0242ac120002'
				case "Marcus":
					InitPubNub('d03e9034-c275-4241-b046-0ea2299dad02',scene)
					currentPlayer = 0
					buttons.destroy();
					break;
				case "Mario":
					InitPubNub('5227a8bc-9fdc-42e3-8680-979f09df879d',scene)
					currentPlayer = 1
					buttons.destroy();
					break;
				case "Jeremy":
					InitPubNub('e91f6ebc-52f8-11ed-bdc3-0242ac120002',scene)
					currentPlayer = 3
					buttons.destroy();
					break;
				case "Mukul":
					InitPubNub('ea409541-44f1-401d-8afa-833fe2e9b580',scene)
					currentPlayer = 4
					buttons.destroy();
					break;
				default:
					break;
			}
		})
}

function InitGUIButtons(scene){
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
			'x': (i*70)+34,
			'y': config.height-34,
		});

		// console.log("i = " + i);
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
			// console.log("Button " + button.name + " created");
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

function DisplayPlayerPresence(scene){
	// RexUI Radio buttons for detecting presence
	var CheckboxesMode = true;  // False = radio mode
	var thePanel = scene.add.rexNinePatch2({
		x: 100, y: 0,
		width:500,
		height:300,
		key: 'bg2',
		columns: [116, undefined, 115],
		rows: [105, undefined, 105],
		stretchMode: {
			edge: 'scale',
			internal: 'scale'
		}
		// maxFixedPartScale: 1
	})
	var buttons = scene.rexUI.add.buttons({
		x: 1441, y: 150,
		orientation: 'y',
		width:700,
		height:300,
		align: 'center',
		background:thePanel,
		buttons: [
			createRadioButton(scene, players[0]),
			createRadioButton(scene, players[1]),
			createRadioButton(scene, players[2]),
			createRadioButton(scene, players[3]),
		],
		type: ((CheckboxesMode) ? 'checkboxes' : 'radio'),
		draggable:true
	}).layout()
	//.drawBounds(this.add.graphics(), 0xff0000)
	thePanel.resize(700,300)

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
		}
	}
	// console.log("Testing state of buttons: "+buttons.buttons[1].name)
	// buttons.buttons[0].getElement('icon')
	// buttons.buttons[1].getElement('icon')
	// buttons.buttons[2].getElement('icon')
	// buttons.buttons[3].getElement('icon')
	return buttons
}

var createButton = function (scene, text) {
	return scene.rexUI.add.label({
		width: 100,
		height: 40,
		background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_DARK),
		text: scene.add.text(0, 0, text, {
			fontSize: 18
		}),
		space: {
			left: 10,
			right: 10,
		}
	});
}

var createRadioButton = function (scene, text, name) {
    if (name === undefined) {
        name = text;
    }
    var button = scene.rexUI.add.label({
        width: 100,
        height: 40,
        text: scene.add.text(0, 0, text, {
            fontSize: 18
        }),
        // icon: scene.add.circle(0, 0, 10).setStrokeStyle(1, COLOR_DARK),
		icon: scene.add.sprite(0, 0, "radio off").setScale(.5),
        space: {
            left: 10,
            right: 10,
            icon: 10
        },

        name: name
    });

    return button;
}

function InitPubNub(uuid,scene) {
	if(pbinitialized == false){
		pbinitialized = true
		console.log("uuid = " + uuid);
		console.log("Initializing PubNub")
		this.pubnub = new PubNub({
			subscribeKey: _subscribeKey,
			publishKey: _publishKey,
			uuid: uuid
		});

		this.pubnub.subscribe({
			channels: ["my_channel"],
			withPresence: true
		},  function(status) {
			console.log(status);
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
				switch (action) {
					case 'join':
						UpdatePresencePanel(scene)
						break;
					case 'timeout':
						UpdatePresencePanel(scene)
						break;	
					case 'leave':
						UpdatePresencePanel(scene)
						break;				
					default:
						break;
				}
				// console.log("getMemberships: "+this.pubnub.objects.getMemberships());
				// https://www.pubnub.com/docs/sdks/javascript/api-reference/presence

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


		UpdatePresencePanel(scene)		
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

		// console.log(this.pubnub.objects.getChannelMetadata({
		// 	channel: "my_channel"
		// }));
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

function UpdatePresencePanel(scene){
	console.log("UpdatePresencePanel")
	for (let h = 0; h < presence_panel.buttons.length; h++) {
		presence_panel.buttons[h].setTexture("radio off")
	}
	this.pubnub.hereNow(
		{
		  channels: ["my_channel"],
		  includeState: true
		},
		function (status, response) {
		  console.log(status, response);
		  console.log(response.channels.my_channel.occupants)
		  for (let i = 0; i < response.channels.my_channel.occupants.length; i++) {
			console.log("Occupant #"+i+":"+response.channels.my_channel.occupants[i].uuid);
			for (const [key, value] of Object.entries(players2)) {
				// console.log(key, value);
				if(key==response.channels.my_channel.occupants[i].uuid){
					// console.log("Found a match for "+response.channels.my_channel.occupants[i].uuid)
					for (let h = 0; h < presence_panel.buttons.length; h++) {
						if(value==presence_panel.buttons[h].name){
							console.log("ONLINE: "+value)
							presence_panel.buttons[h].setTexture("radio on")
							break;						
						}
					}
				}
			  }
		  }
		}
	);
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

function TurnLeft(scene){
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

	UpdatePresencePanel(scene)
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

	// this.pubnub.objects.removeChannelMetadata({
	// 	channel: "my_channel"
	// },function (status, response) {
	// 	console.log(status, response);
	// });
	
	// SET THE METADATA; Might be useful once players' 
	// moves need to be logged, just update the ships
	// that moved?
	// this.pubnub.objects.setChannelMetadata({
	// 	channel: "my_channel",
	// 	data: {
	// 		name:gameBoard.name,
	// 		description:"saved_game",
	// 		custom: {
	// 			board_data: JSON.stringify(gameBoard.Serialize())
	// 		}
	// 	}
	// },function (status, response) {
	// 	console.log(status, response);
	// });

	// // GET THE METADATA; Grab the board state and perform
	// // actions against it. Move ships, damage, etc. 
	this.pubnub.objects.getChannelMetadata({
			channel: "my_channel"
	},function (status, response) {
		console.log(status, JSON.parse(response.data.custom.board_data));
		// var tempString = response.data.custom.board_data;
		var tempValue = JSON.parse(response.data.custom.board_data)
		// console.log(tempValue.owner,tempValue.name)
	});
	
	// this.pubnub.unsubscribe({
	// 	channels: ['my_channel']
	// })
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
