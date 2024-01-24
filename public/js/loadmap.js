// load the map and its layers
// also load stuff on the map like enemies and the player

import phaserJuice from "../plugins/phaserJuice.min.js";

import Enemy from "./enemy.js";
import FlyingEnemy from "./flyingenemy.js"
import RangedEnemy from "./rangedenemy.js"
import Player from "./player.js"

export default class TileMap {
	constructor(scene) {
		this.scene = scene;
		
		//set up the map and its layers
    	const mapstring = 'map' + scene.level;
        const map = scene.make.tilemap({ key: mapstring });
        this.mapwidth = map.widthInPixels;
        this.mapheight = map.heightInPixels;
        const tileset = map.addTilesetImage("tilemap_extruded","tilemap_extruded");
        const backgroundtiles = map.addTilesetImage("tilemap-backgrounds_packed_resized","tilemap-backgrounds_packed_resized");
        const shadowtileset = map.addTilesetImage("shadowtiles","shadowtiles");
        this.backgroundlayer = map.createLayer("Background", backgroundtiles, 0, 0);
        this.indoorbackgroundlayer = map.createLayer("IndoorBackground", tileset, 0, 0);
        this.shadowlayer = map.createLayer("ShadowTiles", shadowtileset, 0, 0);
        this.foregroundlayer = map.createLayer("Foreground", tileset, 0, 0);
        this.itemlayer = map.createLayer("Items", tileset, 0, 0);
        this.groundlayer = map.createLayer("Ground", tileset, 0, 0);
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        const helpText = map.findObject("Objects", obj => obj.name === "Help Text");
        const auraHelpText = map.findObject("Objects", obj => obj.name === "Aura Help Text")
        
        this.juice = new phaserJuice(scene);
        
		this.addObjects(); //replace spike and coin tiles with objects
        
        if (typeof scene.spawnX == "undefined" || scene.startatcheckpoint == false){
			scene.spawnX = spawnPoint.x;
			scene.spawnY = spawnPoint.y;
		}
        
        //make player (will be this.map.player.sprite in mainscene)
        this.player = new Player (scene, scene.spawnX, scene.spawnY);
        
        this.addEnemies(map);
		
		this.addHelpText(helpText,auraHelpText);
    	
    	map.setCollisionByProperty({ collides: true }, true, true, this.groundlayer);
		
		scene.physics.world.setBounds(0,0,this.mapwidth,this.mapheight);
		scene.cameras.main.setBounds(0,0,this.mapwidth,this.mapheight);
		
	}
	
	resetSpring(spring) {
		spring.anims.play('springidle', true);
	}
	
	updateEnemies(){
			
		let a = 0;
		for (a; a < this.enemylist.length; a++){
			this.enemylist[a].update(this.groundlayer);
		}
		
		let b = 0;
		for (b; b < this.flyingenemylist.length; b++){
			this.flyingenemylist[b].update(this.groundlayer);
		}
		
		let c = 0;
		for (c; c < this.rangedenemylist.length; c++){
			this.rangedenemylist[c].update(this.player.sprite);
		}
	}
	
	addHelpText(helpText, auraHelpText) {
		if (this.scene.level == 0 && helpText != null) {
    		this.scene.startingtext = this.scene.add.text(helpText.x,helpText.y, 'Move around with arrow keys, hold up to boost! \nKeys unlock doors and flags are checkpoints! \nReach the door to enter the next level.', {
    			fontSize: '10px',
    			fill: '#000000',
    			strokeThickness: 5
    		});
    	}
    	
    	if (auraHelpText != null) {
    		this.scene.auraHelpText = this.scene.add.text(auraHelpText.x, auraHelpText.y, 'The circle around you is your aura.\nClick on black tiles inside your aura to teleport to them!', {
    			fontSize: '10px',
    			fill: '#000000',
    			strokeThickness: 5
    		});
    		
    	}
	}
	
	addObjects(){
		const scene = this.scene;
	
		this.spikeGroup = scene.physics.add.staticGroup();
		this.groundlayer.forEachTile(tile => {
		// Loop over each Tile and replace spikes (tile index 77) with custom sprites
  		if (tile.index === 109) {
  		  // A sprite has its origin at the center, so place the sprite at the center of the tile
  		  const x = tile.getCenterX();
  		  const y = tile.getCenterY();
  		  const spike = this.spikeGroup.create(x, y, "spike");

  		  // The map has spike tiles that have been rotated in Tiled ("z" key), so parse out that angle
  		  // to the correct body placement
  		  spike.rotation = tile.rotation;
  		  if (spike.angle === 0) spike.body.setSize(12,8).setOffset(3,5);
    	  else if (spike.angle === -90) spike.body.setSize(8, 12).setOffset(10,-2);
    	  else if (spike.angle === 90) spike.body.setSize(8, 12).setOffset(0,-2);
    	  else {spike.body.setSize(12, 8).setOffset(3,-5); }
    	  spike.displayOriginY = 0;

   		 // And lastly, remove the spike tile from the layer
   		 this.groundlayer.removeTileAt(tile.x, tile.y);
  		 }
		});
		const anims = scene.anims;
		if (!anims.exists('coinmove')) {
			anims.create({
            	key: 'coinmove',
            	frames: anims.generateFrameNumbers('coin', { start: 0, end: 1 }),
            	frameRate: 1,
            	repeat: -1
        	});
        	
        	anims.create({
        		key: 'springidle',
        		frames: anims.generateFrameNumbers('spring', {start: 0, end: 0}),
        		frameRate: 0,
        		repeat: -1
        	});
        	anims.create({
        		key: 'springactive',
        		frames: anims.generateFrameNumbers('spring', {start: 1, end: 1}),
        		frameRate: 0,
        		repeat: -1
        	});
		}
		this.coinGroup = scene.physics.add.staticGroup();
		this.itemlayer.forEachTile(tile => {
			if (tile.index === 192) {
				const x = tile.getCenterX();
  				const y = tile.getCenterY();
  				// create png image of the 2 coin frames first
  				// also make sure to create the animation for it
  				const coin = this.coinGroup.create(x, y, "coin");
  				coin.setSize(18,18);
  				coin.anims.play('coinmove', true);
  				this.itemlayer.removeTileAt(tile.x, tile.y);
			}
		});
		
		this.springGroup = scene.physics.add.staticGroup();
		this.foregroundlayer.forEachTile(tile => {
			if (tile.index === 148) {
				const x = tile.getCenterX();
  				const y = tile.getCenterY();
  				const spring = this.springGroup.create(x, y, "spring");
  				
  				spring.rotation = tile.rotation;
  		  		if (spring.angle === 0) spring.body.setSize(14,10).setOffset(2,8);
    	  		else if (spring.angle === -90) spring.body.setSize(10, 14).setOffset(8,2);
    	 		else if (spring.angle === 90) spring.body.setSize(10, 14).setOffset(0,2);
    	  		else {spring.body.setSize(14, 10).setOffset(2,0); }
    	 		
  				spring.anims.play('springidle', true);
  				this.foregroundlayer.removeTileAt(tile.x, tile.y);
			}
		});
		
	}
	
	addEnemies(map){
		const scene = this.scene;
	
		this.enemies = map.filterObjects("Objects", obj => obj.name === "Enemy");
        this.enemylist = [];
		let n=0;
		for (n; n < this.enemies.length; n++){
			this.enemy = new Enemy(scene,this.enemies[n].x,this.enemies[n].y);
			scene.physics.add.collider(this.enemy.enemysprite, this.groundlayer);
			scene.physics.add.collider(this.enemy.enemysprite, this.player.sprite, scene.gameOver, null, scene);
			scene.physics.add.collider(this.enemy.enemysprite, this.spikeGroup, this.enemy.destroyEnemy, null, scene);
			this.enemylist.push(this.enemy);
		}
		//console.log(this.enemylist);
		
		this.flyingenemyobjectlist = map.filterObjects("Objects", obj => obj.name === "Flying Enemy");
		this.flyingenemylist = [];
		n=0;
		for (n; n < this.flyingenemyobjectlist.length; n++){
			this.flyingenemy = new FlyingEnemy(scene,this.flyingenemyobjectlist[n].x, this.flyingenemyobjectlist[n].y);
			scene.physics.add.collider(this.flyingenemy.flyenemysprite, this.player.sprite, scene.gameOver, null, scene);
			this.flyingenemylist.push(this.flyingenemy);
		}
		
		this.rangedenemyobjectlist = map.filterObjects("Objects", obj => obj.name === "Ranged Enemy");
		this.rangedenemylist = [];
		n=0;
		for (n; n < this.rangedenemyobjectlist.length; n++){
			this.rangedenemy = new RangedEnemy(scene, this.rangedenemyobjectlist[n].x, this.rangedenemyobjectlist[n].y, this.juice);
			scene.physics.add.collider(this.rangedenemy.rangedenemysprite, this.player.sprite, scene.gameOver, null, scene);
			this.rangedenemylist.push(this.rangedenemy);
		}
	}
	
}