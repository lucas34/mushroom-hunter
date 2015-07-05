var multiplayer = new function(){

	this.players = [];

	this.add_player = function(joueur){
		console.log("new player");
		var scale = [1,1,1];
		var data = {};
		data['x1'] = 0;
		data['y1'] = 0;
		elements.add_OBJ(link_mushroom_obj,link_tree_texture,data, scale,"ennemie",false, joueur.id);
	};

	this.remove_player = function(id){
		scene.remove(multiplayer.players[""+id]);
		delete multiplayer.players[""+id];
	}

};


Arena.quand({
	seDeplacer: function (joueur) {
		var local_player = multiplayer.players[""+joueur.id];
		if(local_player == undefined){
			return;
		}
		local_player.position.x = joueur.x;
		local_player.position.y = joueur.y - 15;
		local_player.position.z = joueur.z;
	},	
nouveauChampignonNormal: function (position) { 
	elements.addMushroomWithPosition(position);
},
champignonRamasser: function (id, equipe, position) {
	elements.removeElementPositionMush(position);
},
nouveauJoueur: function (joueur) {
	multiplayer.add_player(joueur);
},
joueurParti: function (id) { 
	multiplayer.remove_player(id);
},
nouveauChampignonGeant: function (position) {
	position.isMegaMushroom = true; 
	elements.addMushroomWithPosition(position);
},
	nouveauScore: function (score) {	
		Jeu_prototype.joueur.points = score[0];
		Jeu_prototype.ennemie.points = score[1];
		Message_prototype.showScore();
	},
	vagueChampignonGeant: function () { 
		Message_prototype.showStrobMessage("MEGA MUSH !!",20);
	},
	vagueChampignonsZone: function () { 
		Message_prototype.showStrobMessage("Vague de champignons !",20);
	}
});

