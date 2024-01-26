// location of the player's movement, animations, etc.
// 

export default class Player {
	constructor(scene,x,y) {
		this.scene = scene;
		this.auranum = 1; //aura boost scale
		this.clicked = false;
		this.teleporting = false;
		this.teleportin = false;
		this.worldPoint;
		this.auraExists = false;
		
		//scene.testvar = true; //will change the actual variable!!!!
		
		//animations for the player
		const anims = scene.anims;
		if (!anims.exists('idle')){
		anims.create({
            key: 'move',
            frames: anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        anims.create({
            key: 'idle',
            frames: anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 5,
            repeat: -1
        });
        anims.create({
            key: 'moveup',
            frames: anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        anims.create({
            key: 'die',
            frames: anims.generateFrameNumbers('player', { start: 4, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        anims.create({
            key: 'teleportIn',
            frames: anims.generateFrameNumbers('player', { start: 5, end: 15 }),
            frameRate: 20,
            repeat: 0
        });
        anims.create({
            key: 'teleportOut',
            frames: anims.generateFrameNumbers('player', { start: 15, end: 5 }),
            frameRate: 20,
            repeat: 0
        });
        
        }
        
        //create the actual player (and aura)
        if (this.scene.level > 3) {
        	this.aura = scene.physics.add
    			.image(x,y,"aura")
    			.setCircle(64,0,0)
        		.setAlpha(0.5)
        	this.aura.body.setAllowGravity(false);
        	this.auraExists = true;
        }
        
        this.sprite = scene.physics.add
        	.sprite(x,y,"player",0)
        	.setBounce(0.1)
        
        //now add the physics and camera stuff
        this.sprite.setCollideWorldBounds(true,0.1,0.1);
        
    	scene.cameras.main.startFollow(this.sprite,true,0.8,0.8,0,0);
        
    	// start tracking wasd and arrow key presses
    	const { LEFT, RIGHT, UP, SPACE, A, D } = Phaser.Input.Keyboard.KeyCodes;
   	 	this.keys = scene.input.keyboard.addKeys({
      		left: LEFT,
      		right: RIGHT,
      		up: UP,
      		space: SPACE,
      		a: A,
      		d: D,
   		 });
  	    }
  	    
	update(b,l) {
		let boost = b; //take boost variable from mainscene
		let layer = l;
		const {keys, sprite} = this;
		
		if (!this.teleporting) {
			boost = this.runMovement(boost);
			
			if (this.auraExists) {
				this.checkTeleport(layer);
			
				this.auranum = boost/100+0.5;
				this.aura.scale = this.auranum;
				this.aura.setPosition(sprite.x,sprite.y);
			}
		} 
		else {
			this.runTeleport(boost);
		}
		
		if (this.scene.game.config.didTeleport) {
			this.scene.game.config.didTeleport = false;
			boost = Math.max(0,boost - 10);
		}
		
		return boost;
	}
  	
  	runMovement(boost) {
  		const {keys, sprite} = this;
  			 // do the movement
		let currentvelocity = sprite.body.velocity;
		
        if (keys.left.isDown || keys.a.isDown)
        {
            sprite.anims.play('move', true);
            sprite.setFlipX(true);
            if ((keys.up.isDown || keys.space.isDown) && boost > 0) {
            	if (currentvelocity.x < -150){
            		sprite.body.setVelocityX(currentvelocity.x + 3);
            	} else {
                	sprite.body.setVelocityX(Math.max(currentvelocity.x - 10, -150));
            	}
            } else {
                if (currentvelocity.x < -100){
            		sprite.body.setVelocityX(currentvelocity.x + 5);
            	} else {
                	sprite.body.setVelocityX(Math.max(currentvelocity.x - 10, -100));
            	}
            }
        }
        else if (keys.right.isDown || keys.d.isDown)
        {
            sprite.anims.play('move', true);
            sprite.setFlipX(false);
            if ((keys.up.isDown || keys.space.isDown) && boost > 0) {
            	if (currentvelocity.x > 150){
            		sprite.body.setVelocityX(currentvelocity.x - 3);
            	} else {
                	sprite.body.setVelocityX(Math.min(currentvelocity.x + 10, 150));
            	}
            } else {
            	if (currentvelocity.x > 100){
            		sprite.body.setVelocityX(currentvelocity.x - 5);
            	} else {
                	sprite.body.setVelocityX(Math.min(currentvelocity.x + 10, 100));
            	}
            }
        }
        else { //not moving left or right, slow down horizontal movement then
        	let velocityX = currentvelocity.x;
			if (velocityX > 0){
				if (sprite.body.onFloor()){
					velocityX = Math.max(velocityX-15,0);
				} else {
					velocityX = Math.max(velocityX-5,0);
				}
			} else if (velocityX < 0){
				if (sprite.body.onFloor()){
					velocityX = Math.min(velocityX+15,0);
				} else {
					velocityX = Math.min(velocityX+5,0);
				}
			}
			sprite.body.setVelocityX(velocityX);
        }
        
        //le vertical
        if ((keys.up.isDown || keys.space.isDown) && boost > 0){
        	if (sprite.anims.isPlaying && sprite.anims.currentAnim.key !== 'move' || (currentvelocity.x > -10 && currentvelocity.x < 10) ) {
        		sprite.anims.play('moveup',true);
			}
			if (currentvelocity.y > -200) {
			    sprite.body.setVelocityY(Math.max(currentvelocity.y - 8, -200));
			} else {
				sprite.body.setVelocityY(currentvelocity.y - 5);
			}
        	boost -= 1;
        }
        
        
        if (!keys.up.isDown && !keys.left.isDown && !keys.right.isDown && !keys.a.isDown && !keys.space.isDown && !keys.d.isDown)
        {
            sprite.anims.play('idle', true);
        }
		
		if (sprite.body.onFloor()){
			if (boost < 100) {
				boost = Math.min(boost+2,100);
			}
		}
		return boost;
  	}
  	
  	checkTeleport(layer) {
  		// check if tile is clicked
  		if (this.scene.input.manager.activePointer.leftButtonDown()) {
  			this.worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);
  			this.clicked = true;
  		}
  		
  		if (this.scene.input.manager.activePointer.leftButtonReleased() && this.clicked) {
  			this.clicked = false;
  			let clickedtile = layer.getTileAt(Math.floor(this.worldPoint.x/18), Math.floor(this.worldPoint.y/18));
  			if (clickedtile != null) {
  				let distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.worldPoint.x, this.worldPoint.y);
  				if (distance < 64*this.auranum){
  					this.teleporting = true;
  					this.teleportin = true;
  					this.sprite.anims.play('teleportIn',true);
  					this.scene.cameras.main.setLerp(0.1, 0.1);
  				}
  			}
  		}
  	}
  	
  	runTeleport(boost) {
  		const {keys, sprite} = this;
  		sprite.setVelocity(0,0);
		sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'teleportIn', () => {
			sprite.setPosition(this.worldPoint.x, this.worldPoint.y);
  			this.teleportin = false;
  			sprite.anims.play('teleportOut',true);
		});
		sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'teleportOut', (boost) => {
			this.scene.cameras.main.setLerp(0.8, 0.8);
			this.teleporting = false;
			this.scene.game.config.didTeleport = true;
  		});
  	}

  	destroy() {
  		this.sprite.destroy()
  	}

}