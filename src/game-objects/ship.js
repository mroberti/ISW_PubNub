class Ship extends GamePiece {
	// Sprite for ship
	// Label for name
	// Bar for health
	// Bar for shield

    constructor(scene, x, y, data) {
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
		this.data = data
		this.name = this.data.name
		this.owner = this.data.owner
		// console.log("Created Image and UUID:"+this.uuid)
		console.log(this.name,this.owner)
	}
}

