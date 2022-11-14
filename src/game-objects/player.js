class Player {

    constructor(data) {
        this.data = data
		this.uuid = this.data.uuid
		this.empire = this.data.empire
		this.name = this.data.name
    }

	AddShip(ship) {
		this.ships.push(ship)
	}
	
	Serialize() {
		// We're gonna return the data object to make sure that
		// we can restore the object later, or for updating
		// game state
		for (let i = 0; i < this.data.ships.length; i++) {
			const element = this.data.ships[i];
		}
		return this.data
	}

	DeSerialize() {

	}

}
