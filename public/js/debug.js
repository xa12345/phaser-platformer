// debug graphics for colliding tiles
// (press c to enable it)

export default class DebugGraphics {
	constructor(scene) {
		this.scene = scene;
		
		this.debugGraphics = scene.add.graphics();
        scene.input.keyboard.on('keydown-C', event =>
        {	
            this.showDebug = !this.showDebug;
            this.drawDebugTiles();
        });
        
        scene.physics.world.drawDebug = false;
        scene.input.keyboard.on('keydown-V', event => {
        	this.drawDebugObjects();
        });
		
	}
	
	drawDebugTiles ()
    {
        this.debugGraphics.clear();

        if (this.showDebug)
        {
            // Pass in null for any of the style options to disable drawing that component
            this.scene.map.groundlayer.renderDebug(this.debugGraphics, {
                tileColor: null, // Non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
            });
        }
    }
    
    drawDebugObjects()
    {	
        if (this.scene.physics.world.drawDebug) {
      		this.scene.physics.world.drawDebug = false;
      		this.scene.physics.world.debugGraphic.clear();
    	}
    	else {
      		this.scene.physics.world.drawDebug = true;
    	}
    }
    
}