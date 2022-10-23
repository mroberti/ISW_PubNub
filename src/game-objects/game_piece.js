class GamePiece extends Phaser.GameObjects.Container {
	// Sprite for ship
	// Label for name
	// Bar for health
	// Bar for shield

    constructor(scene, x, y) {
        super(scene, x, y);
		this.name = "GamePiece";
		this.hp = 100;
		this.shields = 100;
        scene.add.existing(this);
    }

	CreateImage(imageSheet, imageName) {	
		this.add = sprite(0, 0, imageSheet, imageName)
	}
}

