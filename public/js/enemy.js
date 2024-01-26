// create and update the ground enemies
//

export default class Enemy {
	constructor(scene,x,y) {
		this.scene = scene;
		this.moveleft = true;
		
		const anims = scene.anims;
		if (!anims.exists('walk')){
			anims.create({
            	key: 'walk',
            	frames: anims.generateFrameNumbers('enemies', { start: 21, end: 22 }),
            	frameRate: 2,
            	repeat: -1
        	});
        }
		this.enemysprite = scene.physics.add
			.sprite(x,y,"enemies",21)
		this.enemysprite.setSize(20,20).setOffset(2,4);
		
	}

	update(l){
		if (!this.enemysprite || !this.enemysprite.scene) {
			return;
		}
		
		let layer = l;
		var fronttile;
		//if moveleft is false the enemy will move right
		if (this.moveleft == true){
			fronttile = layer.getTileAt( (Math.floor((this.enemysprite.x+5)/18))-1 , Math.floor(this.enemysprite.y/18), true );
			if (fronttile != null) {
				//fronttile is null if enemy is at world border
				if (fronttile.index == -1) {
					this.enemysprite.setVelocityX(-20);
					this.enemysprite.anims.play('walk',true);
				} else {
					this.moveleft = false;
					this.enemysprite.setFlipX(true);
				}
			} else {
				this.moveleft = false;
				this.enemysprite.setFlipX(true);
			}
		//moving right
		} else {
			fronttile = layer.getTileAt( (Math.floor((this.enemysprite.x-5)/18))+1 , Math.floor(this.enemysprite.y/18), true );
			if (fronttile != null) {
				if (fronttile.index == -1) {
					this.enemysprite.setVelocityX(20);
					this.enemysprite.anims.play('walk',true);
				} else {
					//console.log(fronttile);
					this.moveleft = true;
					this.enemysprite.setFlipX(false);
				}
			} else {
				this.moveleft = true;
				this.enemysprite.setFlipX(false);
			}
		}
	
		
	}
	
	destroyEnemy(sprite, tile) {
		if (typeof sprite.scene != 'undefined') {
			sprite.destroy();
		}
	}
	
}