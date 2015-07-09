var multiplayer = new function(){

	this.players = [];

	this.add_player = function(player){
		console.log("new player");
		var scale = [1,1,1];
		var data = {};
		data['x1'] = 0;
		data['y1'] = 0;
		elements.add_OBJ(link_mushroom_obj,link_tree_texture,data, scale,"opponent",false, player.id);
	};

	this.remove_player = function(id){
		scene.remove(multiplayer.players[""+id]);
		delete multiplayer.players[""+id];
	}

};

Arena.when({
	playerMove: function (player) {
		var local_player = multiplayer.players[""+player.id];
		if(local_player == undefined){
			return;
		}
		local_player.position.x = player.x;
		local_player.position.y = player.y - 15;
		local_player.position.z = player.z;
	},
	newRegularMushroom: function (position) {
		elements.addMushroomWithPosition(position);
	},
	pickupMushroom: function (id, team, position) {
		elements.removeElementPositionMush(position);
	},
	newPlayer: function (player) {
		multiplayer.add_player(player);
	},
	playerLeft: function (id) {
		multiplayer.remove_player(id);
	},
	newMegaMushroom: function (position) {
		position.isMegamush = true;
		elements.addMushroomWithPosition(position);
	},
	updateScore: function (score) {
		game.player.points = score[0];
		game.opponent.points = score[1];
		message.showScore();
	},
	displayMegaMushroom: function () {
		message.showStrobMessage("MEGA MUSH !!",20);
	},
	displayMushroomWave: function () {
		message.showStrobMessage("Vague de champignons !",20);
	}
});

