class GameBoard {

    constructor(create_date,owner,name,description) {
 		this.whose_turn = 0
		// this.create_date = new Date()
		this.owner = owner
		this.created = create_date
		this.players = []
		this.description = description
		this.name = name
    }

	Serialize() {
		var returnData = {}
		returnData.owner = this.owner
		returnData.players = []
		returnData.description = this.description
		returnData.name = this.name
		// We're gonna return the data object to make sure that
		// we can restore the object later, or for updating
		// game state
		for (let i = 0; i < this.players.length; i++) {
			returnData.players[i] = this.players[i].Serialize()

		}
		return returnData
	}

	AddPlayer(player) {
		this.players.push(player)
	}

	DeSerialize() {

	}

}
