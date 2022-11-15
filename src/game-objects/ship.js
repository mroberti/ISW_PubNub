class Ship extends GamePiece {
	// Sprite for ship
	// Label for name
	// Bar for health
	// Bar for shield

	InitializePiece(imageSheet, imageName, data) {
		this.data = data
		this.name = data.name
		this.owner = data.owner
		// Note the 'add' keyword, it's Phaser3's way of adding
		// a child to the parent object; which is a container. 
		this.sprite=this.add(this.scene.add.sprite(0, 0, imageSheet, imageName).setScale(.5))
		this.label=this.add(this.scene.add.text(20, 30, this.data.name+"\n"+this.data.owner));
		this.data.imageURL = imageName
		this.data.sheet = imageSheet
		// console.log(this.name,this.owner)
	}

	Serialize() {
		// We're gonna return the data object to make sure that
		// we can restore the object later, or for updating
		// game state
		this.data.x = this.x
		this.data.y = this.y
		this.data.rotation = this.sprite.rotation
		this.data.label = this.label.text
		return this.data
	}

	DeSerialize() {
		// We're gonna return the data object to make sure that
		// we can restore the object later, or for updating
		// game state
		this.data.x = this.x
		this.data.y = this.y
		this.data.rotation = this.sprite.rotation
		this.data.label = this.label.text
		return this.data
	}
}

