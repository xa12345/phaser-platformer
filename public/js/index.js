// index.js is meant to handle the phaser config only
// it calls the main scene to use as its own to load the game

import MainScene from "./mainscene.js";

const config = {
    type: Phaser.AUTO,
    scale: {
      parent: 'phaser-game',
      mode: Phaser.Scale.ENVELOP,
      width: 600,
      height: 300,
      zoom: 1,
    },
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: { 
       		gravity: { y: 250 },
       		debug: true
        }
    },
    render: {
    	antialias: false,
    	pixelart: true
	},
    scene: MainScene,
    didTeleport: false
};

const game = new Phaser.Game(config);

