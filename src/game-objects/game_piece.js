class GamePiece extends Phaser.GameObjects.Container {
	// Sprite for ship
	// Label for name

    constructor(scene, x, y) {
        super(scene, x, y);
		this.scene = scene
		this.uuid = PubNub.generateUUID()
        this.scene.add.existing(this);
    }

	InitializePiece(imageSheet, imageName, data) {
		this.data = data
		this.sprite=this.add(this.scene.add.sprite(0, 0, imageSheet, imageName).setScale(.5))
		this.label=this.add(this.scene.add.text(20, 30, data.name));
		this.name = data.name
		console.log("Created Image and UUID:"+this.uuid)
		console.log(data.name)
	}
}

