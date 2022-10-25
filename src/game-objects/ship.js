class Ship extends GamePiece {
	// Sprite for ship
	// Label for name
	// Bar for health
	// Bar for shield

    constructor(scene, x, y) {
        super(scene, x, y);
		this.name = "GamePiece";
		this.scene = scene
		this.sprite = null
		this.hp = 100;
		this.uuid = PubNub.generateUUID()
		this.shields = 100;
        scene.add.existing(this);
    }

	InitializePiece(imageSheet, imageName, data) {	
		this.sprite=this.add(this.scene.add.sprite(0, 0, imageSheet, imageName))
		console.log("Created Image and UUID:"+this.uuid)
	}
}

