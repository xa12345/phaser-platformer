// create and move the ranged enemy projectile towards the player

export default class RangedProjectile {
	constructor(scene,x,y) {
		this.scene = scene;
		
		const anims = scene.anims;
		if (!anims.exists('passive')) {
			anims.create({
            	key: 'passive',
            	frames: anims.generateFrameNumbers('enemies', { start: 13, end: 14 }),
            	frameRate: 4,
            	repeat: -1
        	});
		}
		
		this.rangedprojectilesprite = scene.physics.add
			.sprite(x,y,"enemies",13)
			.setPushable(false)
		this.rangedprojectilesprite.body.setAllowGravity(false);
		this.rangedprojectilesprite.setSize(10,10).setOffset(7,7).setScale(1.5);
		scene.physics.add.overlap(this.rangedprojectilesprite, scene.map.player.sprite, scene.gameOver, null, scene);
		
		const rotation = Phaser.Math.Angle.Between(x, y, scene.map.player.sprite.x, scene.map.player.sprite.y);
		this.rangedprojectilesprite.rotation = rotation + 1.57;
		console.log(x);
		
		this.timer = scene.time.addEvent({
			delay: 1000
		});
		
		scene.physics.moveToObject(this.rangedprojectilesprite,scene.map.player.sprite,200);
		this.rangedprojectilesprite.anims.play('passive',true);
		
	}
	
}