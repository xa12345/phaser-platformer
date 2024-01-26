// create and update the enemies that fly
//

export default class FlyingEnemy {
	constructor(scene,x,y) {
		this.scene = scene;
		this.movedown = true;
		
		const anims = scene.anims;
		if (!anims.exists('fly')){
			anims.create({
            	key: 'fly',
            	frames: anims.generateFrameNumbers('enemies', { start: 24, end: 26 }),
            	frameRate: 4,
            	repeat: -1
        	});
        }
		this.flyenemysprite = scene.physics.add
			.sprite(x,y,"enemies",24)
		this.flyenemysprite.setSize(18,18).setOffset(3,4);		
	}
	
	update(l) {
		let layer = l;
		let fronttile;
		
		if (this.movedown) {
			fronttile = layer.getTileAt( Math.floor((this.flyenemysprite.x)/18) , (Math.floor((this.flyenemysprite.y-5)/18))+1, true );
			if (fronttile != null && fronttile.index == -1){
				this.flyenemysprite.setVelocityY(40);
				this.flyenemysprite.anims.play('fly',true);
			} else {
				this.movedown = false;
			}
		} else {
			fronttile = layer.getTileAt( Math.floor((this.flyenemysprite.x)/18) , (Math.floor((this.flyenemysprite.y+5)/18))-1, true );
			if (fronttile != null && fronttile.index == -1){
				this.flyenemysprite.setVelocityY(-40);
				this.flyenemysprite.anims.play('fly',true);
			} else {
				this.movedown = true;
			}
		}
		
	}

}