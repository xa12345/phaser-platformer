// create and manage ranged enemy (stands still but fires at player)

import RangedProjectile from "./rangedprojectile.js"

export default class RangedEnemy {
	constructor(scene,x,y,juice) {
		this.scene = scene;
		this.juice = juice;
		this.charging = false;
		this.timer;
		this.cooldown = false;
		
		const anims = scene.anims;
		if (!anims.exists('angry')) {
			anims.create({
            	key: 'calm',
            	frames: anims.generateFrameNumbers('enemies', { start: 11, end: 11 }),
            	frameRate: 1,
            	repeat: -1
        	});
			anims.create({
            	key: 'angry',
            	frames: anims.generateFrameNumbers('enemies', { start: 12, end: 12 }),
            	frameRate: 1,
            	repeat: -1
        	});
		}
		this.rangedenemysprite = scene.physics.add
			.sprite(x,y,"enemies",11)
			.setPushable(false);
		this.rangedenemysprite.setScale(2);
		this.rangedenemysprite.setSize(18,18).setOffset(3,3);
		this.rangedenemysprite.body.setAllowGravity(false);
		
	}
	
	update(player) {
	
		const scene = this.scene;

		const distance = Phaser.Math.Distance.Between(this.rangedenemysprite.x, this.rangedenemysprite.y, player.x, player.y);
		if (distance > 250) {
			this.rangedenemysprite.anims.play('calm', true);
			this.charging = false;
			this.cooldown = false;
			return;
		}
		
		if (!this.cooldown) {
			if (!this.charging) {
				this.rangedenemysprite.anims.play('angry', true);
				this.charging = true;
				this.juice.shake(this.rangedenemysprite, {x: 2});
				this.timer = scene.time.addEvent({
    				delay: 800
  				});
			} else if (this.timer.getRemainingSeconds() == 0) {
				this.cooldown = true;
				this.charging = false;
				this.rangedenemysprite.anims.play('calm', true);
				this.timer = scene.time.addEvent({
					delay: 600
				});
				this.fireProjectile();
			}
		} else if (this.timer.getRemainingSeconds() == 0) {
			this.cooldown = false;
		}

	}
	
	fireProjectile() {
		this.projectile = new RangedProjectile(this.scene, this.rangedenemysprite.x, this.rangedenemysprite.y);
	}
	
}