var tut = false;
var loadedGame;
var xlength = 1000;
var ylength = 1000;

function game(){
	//creation of the map
	for (x = 1; x < xlength ; x+=3){
		var col = new Array();
		for (y = 1; y < ylength; y++){
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
	build(-1, 5, 50, 5000, 1, map);
	build(3, 5, 0, 500, 1, map);
	build(0, 6, 5, 200, 1, map);
	build(1, 6, 0, 200, 1, map);
	build(2, 6, 0, 100, 1, map);
	build(2, 5, 0, 150, 1, map);
	sqrSeed(-1, 7, 1000000, .03, map);
	reverseSqrSeed(-1, 8, 1, .49, map);
	build(-1, 7, 25, 0, 1, map);
	//build(4, 8, 0,1 , .3, map);
	//----------------------

	//plant stuff
	plant = new Plant(map[X_FLAG][Y_FLAG]);	
	//----------------------
	
	//control stuff
	control = new Station(map[X_FLAG][Y_FLAG-2]);
	//----------------------
	
	hud = new UI();
	
	arrow = new arrow();
};

var timer = 0;
game.prototype.update = function(){
	player.move();
	find_player(map,player);
	cam_map();
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	player.draw(CAM_WIDTH/2,CAM_HEIGHT/2);
	hud.draw();
	arrow.draw();
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
	
	if(!tut){
		screenManager[screenManager.length] = new tutorial();
		tut = true;
	}
	
	if(timer == 30){
		timer = 0; 
		keybuf = false;
	}
	else{
		timer++;
	}
	
	if(control.EnergyDown){
		control.EnergyDown = false;
		energyDown.play();
	}
	
	if(checkMovement){
		if(player.right || player.left || player.up || player.down){
			moving.play();
			checkMovement = false;
		}
	}
	if(!checkMovement){
		if(!player.right && !player.left && !player.up && !player.down){
			moving.pause();
			checkMovement = true;
		}
	}
};

game.prototype.buttonPress = function(){};

game.prototype.type = "game";

function keyDown(e){
	if(screenManager[screenManager.length - 1].type == "game"){
		switch (e.keyCode){
			case 68:
				keyspressed[RIGHT_KEY] = true;
				player.right = true;
				player.dir = "right";
				//player.image = playermoverightimg;
				break;
			case 65:
				keyspressed[LEFT_KEY] = true;
				player.left = true;
				player.dir = "left";
				//player.image = playermoveleftimg;
				break;
			case 87:
				keyspressed[UP_KEY] = true;
				player.up = true;
				//if (player.dir == "right"){player.image = playermoverightimg;}else{player.image = playermoveleftimg;}
				break;
			case 83:
				keyspressed[DOWN_KEY] = true;
				player.down = true;
				//if (player.dir == "right"){player.image = playermoverightimg;}else{player.image = playermoveleftimg;}
				break;
			case 32:
				if(player.onPlant){
					if((plant.growthPoints > 0 && map[X_FLAG][Y_FLAG].plant.type == plantEnum.ROOT) || (control.Enzyme > 0 && map[X_FLAG][Y_FLAG].plant.type == plantEnum.TREE)){
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
				if(player.inControl){
					bootUp.play();
					screenManager[screenManager.length] = new stationMenu();
					break;
				}
            	if(player.onWater == true && player.capacity < player.capacityMax && keybuf == false && map[X_FLAG][Y_FLAG].resource > 0){
					keybuf = true;
					player.capacity+=10;
					player.hasWater+=10;
					map[X_FLAG][Y_FLAG].resource -= 10;
					if (player.dir == "right"){player.image = playerpickingrightimg;}else{player.image = playerpickingleftimg;}
					if (map[X_FLAG][Y_FLAG].resource < 10){
						if (map[X_FLAG][Y_FLAG].hasPlant == true){
							if(map[X_FLAG][Y_FLAG].color == "green"){
								map[X_FLAG][Y_FLAG].image = hextreeimg;
							}else{
								map[X_FLAG][Y_FLAG].image = hexsproutimg;
							}
						}
						else{
							map[X_FLAG][Y_FLAG].color = TILE_COLORS[map[X_FLAG][Y_FLAG].h];
							map[X_FLAG][Y_FLAG].realcolor = TILE_COLORS[map[X_FLAG][Y_FLAG].h];
							map[X_FLAG][Y_FLAG].image = 0;
						}	
					}
				}
				if(player.onMinerals == true && player.capacity < player.capacityMax && keybuf == false && map[X_FLAG][Y_FLAG].resource > 0){
					keybuf = true;
					player.capacity+=10;
					player.hasMinerals+=10;
					map[X_FLAG][Y_FLAG].resource -= 10;
					if (player.dir == "right"){player.image = playerpickingrightimg;}else{player.image = playerpickingleftimg;}
					if (map[X_FLAG][Y_FLAG].resource < 10){
						if (map[X_FLAG][Y_FLAG].hasPlant == true){
							if(map[X_FLAG][Y_FLAG].color == "green"){
								map[X_FLAG][Y_FLAG].image = hextreeimg;
							}else{
								map[X_FLAG][Y_FLAG].image = hexsproutimg;
							}
						}
						else{
							map[X_FLAG][Y_FLAG].color = TILE_COLORS[map[X_FLAG][Y_FLAG].h];
							map[X_FLAG][Y_FLAG].realcolor = TILE_COLORS[map[X_FLAG][Y_FLAG].h];
							map[X_FLAG][Y_FLAG].image = 0;
						}
					}
				}
				break;			
			case 80:
				screenManager[screenManager.length] = new pauseMenu();
				break;
			default:
				break;
		}
	}
};

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
			player.image = playeridlerightimg;
			break;
		case 65:
			keyspressed[LEFT_KEY] = false;
			player.left = false;
			player.image = playeridleleftimg;
			break;
		case 87:
			keyspressed[UP_KEY] = false;
			player.up = false;
			if (player.dir == "right"){player.image = playeridlerightimg;}else{player.image = playeridleleftimg;}
			break;
		case 83:
			keyspressed[DOWN_KEY] = false;
			player.down = false;
			if (player.dir == "right"){player.image = playeridlerightimg;}else{player.image = playeridleleftimg;}
			break;
		case 32:
			if(control.HoldingGrow){
				control.Growing = true;
				control.HoldingGrow = false;
			} 
			if (player.image == playerpickingleftimg || player.image == playerpickingrightimg){
			if (player.dir == "right"){player.image = playeridlerightimg;}else{player.image = playeridleleftimg;}
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
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,CAM_HEIGHT,600);
	TOP = Y_FLAG;
	LEFT = X_FLAG;
	var NUMOFF;
	if (Y_FLAG%2){
		NUMOFF = -16;
	} 
	else {
		NUMOFF = -16;
	}
	CAM_X_OFFSET = player.x-((CAM_WIDTH/2)+(1.5*cw));
	CAM_Y_OFFSET = player.y-((CAM_HEIGHT/2));
	for (y = NUMOFF;y<(CAM_HEIGHT/cw)-13;++y){
		for (x = -6;x < Math.floor((CAM_WIDTH/cw)/3)-1;++x){
			map[LEFT+x][TOP+y].paint(player.height,CAM_X_OFFSET,CAM_Y_OFFSET);
		}
	}
};
	
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
	} 
	else {// more precise surounding check;
		if ((Y_FLAG%2)){
			if (map[X_FLAG+1][Y_FLAG+1].collision(player.x,player.y,player)){
				X_FLAG +=1;
				Y_FLAG +=1;
			} 
			else if (map[X_FLAG+1][Y_FLAG-1].collision(player.x,player.y,player)){
				X_FLAG +=1;
				Y_FLAG -=1;
			} 
			else if (map[X_FLAG][Y_FLAG-2].collision(player.x,player.y,player)){
				Y_FLAG -=2;
			} 
			else if (map[X_FLAG][Y_FLAG+2].collision(player.x,player.y,player)){
				Y_FLAG +=2;
			} 
			else if (map[X_FLAG][Y_FLAG-1].collision(player.x,player.y,player)){
				Y_FLAG -=1;
			} 
			else if (map[X_FLAG][Y_FLAG+1].collision(player.x,player.y,player)){
				Y_FLAG +=1;
			}
		}
		else{
			if (map[X_FLAG-1][Y_FLAG+1].collision(player.x,player.y,player)){
				X_FLAG -=1;
				Y_FLAG +=1;
			} 
			else if (map[X_FLAG-1][Y_FLAG-1].collision(player.x,player.y,player)){
				X_FLAG -=1;
				Y_FLAG -=1;
			} 
			else if (map[X_FLAG][Y_FLAG-2].collision(player.x,player.y,player)){
				Y_FLAG -=2;
			} 
			else if (map[X_FLAG][Y_FLAG+2].collision(player.x,player.y,player)){
				Y_FLAG +=2;
			} 
			else if (map[X_FLAG][Y_FLAG-1].collision(player.x,player.y,player)){
				Y_FLAG -=1;
			} 
			else if (map[X_FLAG][Y_FLAG+1].collision(player.x,player.y,player)){
				Y_FLAG +=1;
			}
		}
	}
};