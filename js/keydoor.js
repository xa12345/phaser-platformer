//get key, unlock door

export default class KeyDoor {
	constructor(scene){
		this.scene = scene;
	}
	
	getKey(sprite, tile)
    {	
    	if (sprite == this.map.player.sprite) {
    	    this.map.itemlayer.putTileAt(-1,tile.x, tile.y);
    		this.keys += 1;
    	}
    }
    
    unlockDoor(sprite, tile)
    {	
    	if (this.keys > 0 && tile.index == 69 && sprite == this.map.player.sprite){
    		this.map.groundlayer.removeTileAt(tile.x, tile.y);
    		this.keys -= 1;
    		
    		this.keydoor.recursiveDoor(this.map.groundlayer.getTileAt(tile.x, tile.y+1));
    		this.keydoor.recursiveDoor(this.map.groundlayer.getTileAt(tile.x, tile.y-1));
    		this.keydoor.recursiveDoor(this.map.groundlayer.getTileAt(tile.x+1, tile.y));
    		this.keydoor.recursiveDoor(this.map.groundlayer.getTileAt(tile.x-1, tile.y));
    		
    	} 
    }
    
    recursiveDoor(tile) {
    	//console.log(tile);
    	if (tile == null) {return;}
    	if (tile.index == 50) {
    		this.scene.map.groundlayer.putTileAt(-1,tile.x, tile.y);
    		this.recursiveDoor(this.scene.map.groundlayer.getTileAt(tile.x, tile.y+1));
    		this.recursiveDoor(this.scene.map.groundlayer.getTileAt(tile.x, tile.y-1));
    		this.recursiveDoor(this.scene.map.groundlayer.getTileAt(tile.x+1, tile.y));
    		this.recursiveDoor(this.scene.map.groundlayer.getTileAt(tile.x-1, tile.y));
    	}
    	return;
    	
    }
    
}