class Gamepiece extends Phaser.GameObjects {
	constructor(scene, x, y) {
	  super(scene, x, y, pieceName, sprite);
  
	  this.setInteractive({ useHandCursor: true })
		.on('pointerover', () => this.enterButtonHoverState() )
		.on('pointerout', () => this.enterButtonRestState() )
		.on('pointerdown', () => this.enterButtonActiveState() )
		.on('pointerup', () => {
		  this.enterButtonHoverState();
		  callback();
		});
	}
  
  }