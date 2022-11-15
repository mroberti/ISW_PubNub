class Player {

    constructor(data) {
        this.data = data
		this.uuid = this.data.uuid
		this.empire = this.data.empire
		this.name = this.data.name
		this.ships = []
    }

	AddShip(ship) {
		this.ships.push(ship)
	}
	
	Serialize() {
		var returnData = {}
		returnData.uuid = this.uuid
		returnData.empire = this.empire
		returnData.name = this.name
		returnData.ships = []
		for (let i = 0; i < this.ships.length; i++) {
			returnData.ships[i] = this.ships[i].Serialize();
		}
		return returnData
	}

	DeSerialize() {

	}

}
