class GameBoard {

    constructor() {
 		this.data = {}
		this.players = []
		// this.data = data
		// this.ships = this.data.ships
    }

	Serialize() {
		var returnData = null
		returnData.players = []
		// We're gonna return the data object to make sure that
		// we can restore the object later, or for updating
		// game state
		for (let i = 0; i < this.players.length; i++) {
			returnData.players[i] = this.players[i].Serialize()

		}
		return this.data
	}

	AddShip(ship) {

	}

	AddPlayer(player) {
		this.players.push(player)
	}

	DeSerialize() {

	}

}
