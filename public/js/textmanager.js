// handle the text that is always on the top left of the screen
// not responsible for help text

export default class TextManager {
	constructor (scene) {
		this.scene = scene;
		
		this.text = scene.add.text(16, 16, '', {
            fontSize: '10px',
            strokeThickness: 3,
            //padding: { x: 20, y: 10 },
            //backgroundColor: '#ffffff',
            fill: '#000000'
        });
        this.text.setScrollFactor(0);
        this.updateText();
	}
	
	updateText() {
        this.text.setText([
            `Boost: ${this.scene.boost}`,
            //'Dead: ' + this.isdead,
        	//'Debug: (press c): ' + this.debug.showDebug,
        	'Number of keys: ' + this.scene.keys,
        	'Current level: ' + this.scene.level
        	 //'testvar: ' + this.spawnX + ', ' + this.spawnY
        ]);
   	}
}