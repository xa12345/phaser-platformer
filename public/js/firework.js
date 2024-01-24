// handle firework anims and firework creation
//

export default class Firework {
	constructor(scene) {
		this.scene = scene;
		//make anims
    	if (!scene.anims.exists('firework')){
			scene.anims.create({
            	key: 'firework',
            	frames: scene.anims.generateFrameNumbers('fireworks', { start: 0, end: 9 }),
            	frameRate: 9,
            	repeat: 2
        	});
        }
	}
	
	makeFireworks(x,y) {
		//magic numbers to place around checkpoint tile coordinates
		let firework1 = this.scene.physics.add.staticSprite( (x*18)+9, (y*18)+17,'firework');
    	firework1.anims.play('firework',true);
    	let firework2 = this.scene.physics.add.staticSprite( (x*18)+5, (y*18)+4,'firework');
    	firework2.anims.play('firework',true);
    	let firework3 = this.scene.physics.add.staticSprite( (x*18)+14, (y*18)+11,'firework');
    	firework3.anims.play('firework',true);
	}
	
}