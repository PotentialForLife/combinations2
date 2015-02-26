//CONSTS
var TILE_COLORS = [ '#CC5200', '#E65C00', '#FF6600', '#FF7519', '#FF8533', '#FF9900', '#80FFFF', '#FFC299', '#FF0000'];

/*var VIEW_WIDTH = 1000;
var VIEW_HEIGHT = 1000;
var VIEW_TILE_WIDTH = Math.floor ( VIEW_WIDTH / TILE_SIZE );
var VIEW_TILE_HEIGHT = Math.floor ( VIEW_HEIGHT / TILE_SIZE );
*/
//INITIALIZATION
function seed(base, next, seeds, distance,map){
	if(next != 8){
		for(x = 0; x < seeds; x++){
			var row = Math.floor ((Math.random() * map.length));
			var col = Math.floor ((Math.random() * map[0].length));
			var height;
			if(base == -1){
				height = true;
			}
			else
			{
				height = (map[row][col].color == TILE_COLORS[base]);
			}
			if( height && (row < map.length*distance || row > map.length-map.length*distance || col < map[0].length*distance || col > map[0].length-map[0].length*distance)){
				map[row][col].color = TILE_COLORS[next];
				map[row][col].realcolor = TILE_COLORS[next];
				if (next == 5 || next == 6){
					map[row][col].h = base;
					if (next == 5){map[row][col].type = "mineral";}else{map[row][col].type = "water";}
				} else{
					map[row][col].h = next;
				}
			}
		}
	}
	else{
		var row = Math.floor ((Math.random() * map.length));
		var col = Math.floor ((Math.random() * map[0].length));
		while(!(map[row][col].color == TILE_COLORS[base] && (row < map.length*distance || row > map.length-map.length*distance || col < map[0].length*distance || col > map[0].length-map[0].length*distance))){
			row = Math.floor ((Math.random() * map.length));
			col = Math.floor ((Math.random() * map[0].length));
		}
		map[row][col].color = TILE_COLORS[next];
		map[row][col].realcolor = TILE_COLORS[next];
		if (next == 5 || next == 6){
			map[row][col].h = base;
			if (next == 5){map[row][col].type = "mineral";}else{map[row][col].type = "water";}
		} else{
			map[row][col].h = next;
		}
	}
}

function build(base, next, chance, seeds, distance, map){
	seed(base, next, seeds, distance,map);
	var next = next;
	if (next == 5 || next == 6){next = base;}
	for (x = 0; x < map.length; x++ ) {
		for ( y = 1; y < map[x].length-2; y++ ) {
     		var num = Math.floor ( Math.random() * 100);
        	if(map[x][y].color == TILE_COLORS[next]){
        		 if(num <= chance){
        	 		map[x][y-1].color = TILE_COLORS[next];
        	 		map[x][y-1].h = next;
        	 		map[x][y-1].realcolor = TILE_COLORS[next];
        	 		map[x][y+1].color = TILE_COLORS[next];
        	 		map[x][y+1].h = next;
        	 		map[x][y+1].realcolor = TILE_COLORS[next];
        	 		if (next == 5){map[x][y-1].type = "mineral";}
        	 		if (next == 6){map[x][y-1].type = "water";}
        	 		if (next == 5){map[x][y+1].type = "mineral";}
        	 		if (next == 6){map[x][y+1].type = "water";}
        	 		if(x > 0){
        	 			map[x-1][y].color = TILE_COLORS[next];
        	 			map[x-1][y].h = next;
        	 			map[x-1][y].realcolor = TILE_COLORS[next];
        	 			if (next == 5){map[x-1][y].type = "mineral";}
        	 			if (next == 6){map[x-1][y].type = "water";}
        	 		}
        	 		if(x != map.length-1){
        	 			map[x+1][y].color = TILE_COLORS[next];
        	 			map[x+1][y].h = next;
        	 			map[x+1][y].realcolor = TILE_COLORS[next];
        	 			if (next == 5){map[x+1][y].type = "mineral";}
        	 			if (next == 6){map[x+1][y].type = "water";}
        	 		}
        	 	}
         	}
     	}
	}

	for (x = map.length-1; x > 0; x-- ) {
    	 for ( y = map[x].length-2; y > 0; y-- ) {
     		var num = Math.floor ( Math.random() * 100);
        	if(map[x][y].color == TILE_COLORS[next]){
        		 if(num <= chance){
        	 		map[x][y-1].color = TILE_COLORS[next];
        	 		map[x][y-1].h = next;
        	 		map[x][y-1].realcolor = TILE_COLORS[next];
        	 		map[x][y+1].color = TILE_COLORS[next];
        	 		map[x][y+1].h = next;
        	 		map[x][y+1].realcolor = TILE_COLORS[next];
        	 		if (next == 5){map[x][y-1].type = "mineral";}
        	 		if (next == 6){map[x][y-1].type = "water";}
        	 		if (next == 5){map[x][y+1].type = "mineral";}
        	 		if (next == 6){map[x][y+1].type = "water";}
        	 		if(x > 0){
        	 			map[x-1][y].color = TILE_COLORS[next];
        	 			map[x-1][y].h = next;
        	 			map[x-1][y].realcolor = TILE_COLORS[next];
        	 			if (next == 5){map[x-1][y].type = "mineral";}
        	 			if (next == 6){map[x-1][y].type = "water";}
        	 		}
        	 		if(x != map.length-1){
        	 			map[x+1][y].color = TILE_COLORS[next];
        	 			map[x+1][y].h = next;
        	 			map[x+1][y].realcolor = TILE_COLORS[next];
        	 			if (next == 5){map[x+1][y].type = "mineral";}
        	 			if (next == 6){map[x+1][y].type = "water";}
        	 		}	
        		 }
        	 }
    	 }
	}

	for (x = 0; x < map.length; x++ ) {
    	 for ( y = map[x].length-2; y > 0; y-- ) {
     		var num = Math.floor ( Math.random() * 100);
        	if(map[x][y].color == TILE_COLORS[next]){
        		if(num <= chance){
        	 		map[x][y-1].color = TILE_COLORS[next];
        	 		map[x][y-1].h = next;
        	 		map[x][y-1].realcolor = TILE_COLORS[next];
        	 		map[x][y+1].color = TILE_COLORS[next];
        	 		map[x][y+1].h = next;
        	 		map[x][y+1].realcolor = TILE_COLORS[next];
        	 		if (next == 5){map[x][y-1].type = "mineral";}
        	 		if (next == 6){map[x][y-1].type = "water";}
        	 		if (next == 5){map[x][y+1].type = "mineral";}
        	 		if (next == 6){map[x][y+1].type = "water";}
        	 		if(x > 0){
        	 			map[x-1][y].color = TILE_COLORS[next];
        	 			map[x-1][y].h = next;
        	 			map[x-1][y].realcolor = TILE_COLORS[next];
        	 			if (next == 5){map[x-1][y].type = "mineral";}
        	 			if (next == 6){map[x-1][y].type = "water";}
        	 		}
        	 		if(x != map.length-1){
        	 			map[x+1][y].color = TILE_COLORS[next];
        	 			map[x+1][y].h = next;
        	 			map[x+1][y].realcolor = TILE_COLORS[next];
        	 			if (next == 5){map[x+1][y].type = "mineral";}
        	 			if (next == 6){map[x+1][y].type = "water";}
        	 		}
        	 	}
         	}
     	}
	}

	for (x = map.length-1; x > 0; x-- ) {
    	 for ( y = 2; y < map[x].length-1; y++ ) {
     		var num = Math.floor ( Math.random() * 100);
        	if(map[x][y].color == TILE_COLORS[next]){
        		 if(num <= chance){
        	 		map[x][y-1].color = TILE_COLORS[next];
        	 		map[x][y-1].h = next;
        	 		map[x][y-1].realcolor = TILE_COLORS[next];
        	 		map[x][y+1].color = TILE_COLORS[next];
        	 		map[x][y+1].h = next;
        	 		map[x][y+1].realcolor = TILE_COLORS[next];
        	 		if (next == 5){map[x][y-1].type = "mineral";}
        	 		if (next == 6){map[x][y-1].type = "water";}
        	 		if (next == 5){map[x][y+1].type = "mineral";}
        	 		if (next == 6){map[x][y+1].type = "water";}
        	 		if(x > 0){
        	 			map[x-1][y].color = TILE_COLORS[next];
        	 			map[x-1][y].h = next;
        	 			map[x-1][y].realcolor = TILE_COLORS[next];
        	 			if (next == 5){map[x-1][y].type = "mineral";}
        	 			if (next == 6){map[x-1][y].type = "water";}
        	 		}
        	 		if(x != map.length-1){
        	 			map[x+1][y].color = TILE_COLORS[next];
        	 			map[x+1][y].h = next;
        	 			map[x+1][y].realcolor = TILE_COLORS[next];
        	 			if (next == 5){map[x+1][y].type = "mineral";}
        	 			if (next == 6){map[x+1][y].type = "water";}
        	 		}
        	 	}
         	}
     	}
	}
}

/* build(0, 1, 55, 100, 1);
 build(1, 1, 30, 0, 1);
 build(1, 2, 50, 100, 1);
 build(2, 3, 50, 100, 1);
 build(3, 4, 40, 100, 1);
 build(4, 5, 5, 500, 1);
 build(3, 5, 0, 500, 1);
 build(0, 6, 5, 200, 1);
 build(1, 6, 0, 200, 1);
 build(2, 6, 0, 100, 1);
 build(2, 5, 0, 150, 1);
 build(-1, 7, 25, 1000000, .03);
 build(4, 8, 0,1 , .3);

//seed(0,1,10000);*/
