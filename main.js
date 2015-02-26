var control;
$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var cw = 20;
   var keybuf = false;
	
	//global declarations
	var RIGHT_KEY = 68;
	var LEFT_KEY = 65;
	var UP_KEY = 87;
	var DOWN_KEY = 83;
	var X_FLAG = -1;
	var Y_FLAG = -1;
	var map = new Array();
	var player = new Player();
	X_FLAG = Math.floor(player.x/cw/3);
	Y_FLAG = Math.floor(player.y/cw);
	
	//cam stuff
	var CAM_HEIGHT = 600;
	var CAM_WIDTH = 600;
	var TOP;
	var LEFT;
	var CAM_X_OFFSET;
	var CAM_Y_OFFSET;
	
	//keyboard
	var keyspressed = {};
	keyspressed[RIGHT_KEY] = false;
	keyspressed[LEFT_KEY] = false;
	keyspressed[UP_KEY] = false;
	keyspressed[DOWN_KEY] = false;
	
	//tile colors
	var TILE_COLORS = [ '#CC5200', '#E65C00', '#FF6600', '#FF7519', '#FF8533', '#FFC299'];
	
	//declaration of map
	for (x = 1; x < 1000 ; x+=3){
		var col = new Array();
		for (y = 1; y < 1000; y++){
			var newHex = new Hex(x,y,cw,TILE_COLORS[0],0);
			col.push(newHex);
		}
		map.push(col);
	}
	
	build(0, 1, 60, 100, 1, map);
	build(1, 1, 30, 0, 1, map);
	build(1, 2, 55, 150, 1, map);
	build(2, 3, 55, 150, 1, map);
	build(3, 4, 55, 150, 1, map);
	build(4, 5, 5, 500, 1, map);
	build(3, 5, 0, 500, 1, map);
	build(0, 6, 5, 200, 1, map);
	build(1, 6, 0, 200, 1, map);
	build(2, 6, 0, 100, 1, map);
	build(2, 5, 0, 150, 1, map);
	build(-1, 7, 25, 1000000, .03, map);
	//build(4, 8, 0,1 , .3, map);
	//----------------------
	//plant shit
	var plant = new Plant(map[X_FLAG][Y_FLAG]);
	var growTiles = [];
	var growSourceTile;
	
	/**
	 * Check whether a given tile can contain a new plantNode
	 * 
	 * @param {hex} tile: hex tile checked for ability to contain new plantNode
	 */
	function checkTileGrowable(tile){
		if(TILE_COLORS.indexOf(tile.color) > -1){
			tile.color = 'green';
			growTiles.push(tile);
		}
	}
	
	/**
	 * Grows a new plantNode and separates the corresponding tile from the array of non-chosen tiles
	 */
	function growPlant(){
		plant.grow(growSourceTile.plant, map[X_FLAG][Y_FLAG]);
		for(var numTile = 0; numTile < growTiles.length; ++numTile){
			if(map[X_FLAG][Y_FLAG].x == growTiles[numTile].x && map[X_FLAG][Y_FLAG].y == growTiles[numTile].y)
				growTiles.splice(numTile, 1);
		}
	}
	
	//----------------------
	//control shit
	control = new Station(map[X_FLAG][Y_FLAG-2]);
	//----------------------
	
	document.addEventListener('keydown',keyDown,false);
	document.addEventListener('keyup',keyUp,false);
	
	/**
	 * actualizes displacement of player
	 */
	Player.prototype.move = function(){
		if (keyspressed[RIGHT_KEY])this.x += this.speed;
		if (keyspressed[LEFT_KEY])this.x -= this.speed;
		if (keyspressed[UP_KEY])this.y -= this.speed;
		if (keyspressed[DOWN_KEY])this.y += this.speed;
	};

	/**
	 * Handles 'keydown' events
	 * 
	 * @param {event} e: the keyup event being handled
	 */
	function keyDown(e){
		switch (e.keyCode){
			case 68:
				keyspressed[RIGHT_KEY] = true;
				player.right = true;
				break;
			case 65:
				keyspressed[LEFT_KEY] = true;
				player.left = true;
				break;
			case 87:
				keyspressed[UP_KEY] = true;
				player.up = true;
				break;
			case 83:
				keyspressed[DOWN_KEY] = true;
				player.down = true;
				break;
			case 32:
				if(player.onPlant){
					if(plant.growthPoints > 0){
						control.HoldingGrow = true;
						growSourceTile = map[X_FLAG][Y_FLAG];
						if ((Y_FLAG%2)){
							checkTileGrowable(map[X_FLAG+1][Y_FLAG+1]);
							checkTileGrowable(map[X_FLAG+1][Y_FLAG-1]);
						}
						else{
							checkTileGrowable(map[X_FLAG-1][Y_FLAG+1]);
							checkTileGrowable(map[X_FLAG-1][Y_FLAG-1]);
						}
						checkTileGrowable(map[X_FLAG][Y_FLAG-2]);
						checkTileGrowable(map[X_FLAG][Y_FLAG+2]);
						checkTileGrowable(map[X_FLAG][Y_FLAG-1]);
						checkTileGrowable(map[X_FLAG][Y_FLAG+1]);
					}
				}
				if(player.inControl)map[X_FLAG][Y_FLAG].color = 'red';
            if(player.onWater == true && player.capacity < player.capacityMax && keybuf == false && map[X_FLAG][Y_FLAG].resource > 0){
					keybuf = true;
					player.capacity+=10;
					player.capacityMax+=10;
					player.hasMinerals+=10;
					map[X_FLAG][Y_FLAG].resource -= 10;}
				if(player.onMinerals == true && player.capacity < player.capacityMax && keybuf == false && map[X_FLAG][Y_FLAG].resource > 0){
					keybuf = true;
					player.capacity+=10;
					player.capacityMax+=10;
					player.hasWater+=10;
					map[X_FLAG][Y_FLAG].resource -= 10;}
				break;
			default:
				break;
		}
	}
	
	/**
	 * Handles 'keyup' events
	 * 
	 * @param {event} e: the keyup event being handled
	 */
	function keyUp(e){
		switch (e.keyCode){
			case 68:
				keyspressed[RIGHT_KEY] = false;
				player.right = false;
				break;
			case 65:
				keyspressed[LEFT_KEY] = false;
				player.left = false;
				break;
			case 87:
				keyspressed[UP_KEY] = false;
				player.up = false;
				break;
			case 83:
				keyspressed[DOWN_KEY] = false;
				player.down = false;
				break;
			case 32:
				if(control.HoldingGrow){
					control.Growing = true;
					control.HoldingGrow = false;
				} 
				if(player.inControl == true)map[X_FLAG][Y_FLAG].color = 'grey';
            keybuf = false;
				break;
			default:
				break;
		}
	}
	
	/**
	 * Controls viewable area of map
	 */
	function cam_map(){
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		TOP = Y_FLAG;
		LEFT = X_FLAG;
		var NUMOFF;
		if (Y_FLAG%2){
			NUMOFF = -16;
		} else {
			NUMOFF = -16;
		}
		CAM_X_OFFSET = player.x-((CAM_WIDTH/2)+(1.5*cw));
		CAM_Y_OFFSET = player.y-((CAM_HEIGHT/2));
		for (x = -6;x < Math.floor((CAM_WIDTH/cw)/3)-1;++x){
			for (y = NUMOFF;y<(CAM_HEIGHT/cw)-8;++y){
				map[LEFT+x][TOP+y].paint(player.height,CAM_X_OFFSET,CAM_Y_OFFSET);
			}
		}
	}
	
	/**
	 * Finds the coordinates of the player on the map
	 * 
 	 * @param {2D Array} map: 2-dimensional Array of the hex tiles making up the map
 	 * @param {Player} player: ...the player object
	 */
	function find_player(map,player){
		if (X_FLAG == -1 && Y_FLAG == -1){//brute force starting check
			for(x = 0;x < map.length;x++){
				for (y = 0; y < map[x].length;y++){
					if (map[x][y].collision(player.x,player.y,player.height)){
						X_FLAG = (map[x][y].x-1)/3;
						Y_FLAG = map[x][y].y-1;
					}
				}
			}
		} else {// more precise surrounding check;
			if ((Y_FLAG%2)){
				if (map[X_FLAG+1][Y_FLAG+1].collision(player.x,player.y,player)){
					X_FLAG +=1;
					Y_FLAG +=1;
				} else if (map[X_FLAG+1][Y_FLAG-1].collision(player.x,player.y,player)){
					X_FLAG +=1;
					Y_FLAG -=1;
				} else if (map[X_FLAG][Y_FLAG-2].collision(player.x,player.y,player)){
					Y_FLAG -=2;
				} else if (map[X_FLAG][Y_FLAG+2].collision(player.x,player.y,player)){
					Y_FLAG +=2;
				} else if (map[X_FLAG][Y_FLAG-1].collision(player.x,player.y,player)){
					Y_FLAG -=1;
				} else if (map[X_FLAG][Y_FLAG+1].collision(player.x,player.y,player)){
					Y_FLAG +=1;
				}
			}
			else{
				if (map[X_FLAG-1][Y_FLAG+1].collision(player.x,player.y,player)){
					X_FLAG -=1;
					Y_FLAG +=1;
				} else if (map[X_FLAG-1][Y_FLAG-1].collision(player.x,player.y,player)){
					X_FLAG -=1;
					Y_FLAG -=1;
				} else if (map[X_FLAG][Y_FLAG-2].collision(player.x,player.y,player)){
					Y_FLAG -=2;
				} else if (map[X_FLAG][Y_FLAG+2].collision(player.x,player.y,player)){
					Y_FLAG +=2;
				} else if (map[X_FLAG][Y_FLAG-1].collision(player.x,player.y,player)){
					Y_FLAG -=1;
				} else if (map[X_FLAG][Y_FLAG+1].collision(player.x,player.y,player)){
					Y_FLAG +=1;
				}
			}
		}
	}
	
	
	function update(d){
		player.move();
		find_player(map,player);
		cam_map();
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		player.draw(CAM_WIDTH/2,CAM_HEIGHT/2);
		ctx.fillStyle = "white";
		ctx.font = "20px Georgia";
		ctx.fillText("Water : " + control.Water, 10,25);
		ctx.fillText("Minerals : " + control.Minerals, 10,45);
		ctx.fillText("Enzymes : " + control.Enzyme, 10,65);
		if(control.Growing){
			for(var numTile = 0; numTile < growTiles.length; ++numTile){
				if(map[X_FLAG][Y_FLAG].x == growTiles[numTile].x && map[X_FLAG][Y_FLAG].y == growTiles[numTile].y){
					growPlant();
					player.onPlant = true;
					break;
				}
			}
			growSourceTile = null;
			while(growTiles.length != 0){
				growTiles[0].color = growTiles[0].realcolor;
				growTiles.shift();
			}
			control.Growing = false;
		}
	}
	setInterval ( update, 1000 / 30 );
});

