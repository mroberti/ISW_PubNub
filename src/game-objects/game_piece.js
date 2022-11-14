class GamePiece extends Phaser.GameObjects.Container {
	// Sprite for ship
	// data 

    constructor(scene, x, y) {
        super(scene, x, y);
		this.scene = scene
        this.scene.add.existing(this);
    }

}

