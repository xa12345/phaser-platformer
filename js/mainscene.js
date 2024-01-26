// location of the preload, create, and update functions
// this one will call a lot of other files, which is why its the main scene

import Player from "./player.js"
import DebugGraphics from "./debug.js"
import KeyDoor from "./keydoor.js"
import TileMap from "./loadmap.js"
import TextManager from "./textmanager.js"
import Firework from "./firework.js"

export default class MainScene extends Phaser.Scene
{

    preload ()
    {	
    	let numberoflevels = 6; //from level 0 to level 5 (6 in total)
    	
    	for (let x = 0; x < numberoflevels; x++) {
    		this.load.tilemapTiledJSON('map' + x, 'levels/level' + x + '.json');
    	}
    	
        this.load.image('tilemap_extruded', 'assets/tilemap_extruded.png');
        this.load.image('shadowtiles', 'assets/shadowtiles.png');
        this.load.image('tilemap-backgrounds_packed_resized','assets/tilemap-backgrounds_packed_resized.png');
        this.load.image('spike','assets/spike.png');
        this.load.image('aura', 'assets/aura.png');
        this.load.spritesheet('coin','assets/coin.png', {frameWidth: 20, frameHeight: 20});
        this.load.spritesheet('spring','assets/spring.png', {frameWidth: 18, frameHeight: 18, spacing: 2});
        this.load.spritesheet('fireworks','assets/firework.png', {frameWidth: 20, frameHeight: 20});
        this.load.spritesheet('player', 'assets/shadowplayer.png', { frameWidth: 16, frameHeight: 21, margin: 1, spacing: 1 });
        this.load.spritesheet('enemies', 'assets/tilemap-characters.png', {frameWidth: 24, frameHeight: 24, spacing: 1});
    }
    
    create ()
    {	
    	this.isdead = false;
    	this.boost = 100;
    	this.keys = 0; //number of keys the player has
    	this.fadeinlevel; //if true the camera will fade in when map loads
    	this.startatcheckpoint; //if true use spawnX and spawnY instead of spawnPoint object
    	this.spawnX; // number to show x and y of last checkpoint
    	this.spawnY;
    	this.timedevent = 0;
    	
    	this.cam = this.cameras.main;
    	
    	this.level;
    	//allow changing of level through scene restarts
    	if (typeof this.level == "undefined") {this.level = 0; }
    	
    	//smooth fade in if the player just died
    	if (this.fadeinlevel) {
    		this.cam.fadeIn(400,0,0,0);
    	}
    	
    	this.map = new TileMap(this);
    	this.playersprite = this.map.player.sprite; //qol
    	
    	this.physics.add.collider(this.playersprite, this.map.groundlayer);
    	this.physics.add.collider(this.playersprite,this.map.spikeGroup,this.gameOver,null,this);
    	this.physics.add.overlap(this.playersprite, this.map.coinGroup, function hitCoin(sprite,coin) {
    		this.boost += 10;
    		coin.destroy();
    	}, null, this);
    	
    	this.physics.add.overlap(this.playersprite, this.map.springGroup, function useSpring(sprite, spring) {
    		
    		//dont trigger if a spring is still charging
    		if (this.timedevent != 0 && this.timedevent.getRemaining() != 0) return;
    		
    		spring.anims.play('springactive', true);
    		const currentvelocity = sprite.body.velocity;
    		if (spring.angle === 0) sprite.setVelocity(0, Math.min(currentvelocity.y, 0) -300);
    	 	else if (spring.angle === -90) sprite.setVelocity(Math.min(currentvelocity.x, 0)-300,0);
    	    else if (spring.angle === 90) sprite.setVelocity(Math.max(currentvelocity.x, 0)+300,0);
    	    else {sprite.setVelocity(0,Math.max(currentvelocity.y, 0)+200)}
    		this.timedevent = this.time.delayedCall(400, this.map.resetSpring, [spring], this);
    	}, null, this);
        
        this.keydoor = new KeyDoor(this);
        
        this.debug = new DebugGraphics(this);
        
        this.fireworks = new Firework(this);
        
        this.text = new TextManager(this);

        this.itemcollider = this.physics.add.overlap(this.playersprite, this.map.itemlayer);
        this.map.itemlayer.setTileIndexCallback(68, this.keydoor.getKey, this);
        this.map.itemlayer.setTileIndexCallback(171, this.endLevel, this);
        this.map.itemlayer.setTileIndexCallback(152, this.checkpoint, this);
        this.map.groundlayer.setTileIndexCallback(69, this.keydoor.unlockDoor, this);
    
    }

    update (time, delta)
    {	
        this.text.updateText();
        this.map.updateEnemies();
        if (!this.isdead)
        {
        	// call the player's update function and get its boost calculations for future use
        	this.boost = this.map.player.update(this.boost, this.map.shadowlayer);
        	//collide with bottom of the world
			if (this.playersprite.y > this.map.mapheight - 30) {
				this.gameOver();
			}
        }

    }
    
    gameOver ()
    {	
    	//restart the current level
    	this.playersprite.setTint(0xff0000);
    	this.playersprite.anims.play('idle');
    	this.playersprite.setVelocityX(0);
    	this.isdead = true;
    	this.playersprite.setCollideWorldBounds(false);
    	
    	this.playersprite.anims.play('die',true);
    	this.cam.shake(300,0.001);
    	this.cam.fade(500,0,0,0);
    	
    	this.cam.once("camerafadeoutcomplete", () => {
    		this.map.player.destroy();
    		this.scene.restart();
    		this.fadeinlevel = true;
    		this.startatcheckpoint = true;
    	});
    }
    
    endLevel (sprite, tile)
    {	
    	this.level += 1
    	this.fadeinlevel = true;
    	this.startatcheckpoint = false;
    	this.itemcollider.destroy();
    	this.cam.fade(500,0,0,0)
    	
    	this.cam.once("camerafadeoutcomplete", () => {
    	    this.scene.restart();
    	})
    }
    
    checkpoint(sprite, tile)
    {	
    	// pixel coords should be in center of tile
    	this.spawnX = tile.x*18+9;
    	this.spawnY = tile.y*18+9;
    	this.boost = Math.max(this.boost, 100);
    	this.map.itemlayer.putTileAt(153,tile.x,tile.y);
    	this.fireworks.makeFireworks(tile.x, tile.y);
    }
    
}
