function Collision_prototype() {
    this.arbres = [];
    this.mushrooms = [];
    this.rivers = [];
    this.nenuphars = [];
}

Collision_prototype.prototype = {

    manage : function() {

        (function manageWaterlily(self) {
            for (var j = 0; j < self.nenuphars.length; j++) {
                if (lib.isClose(self.nenuphars[j], game.player)) {
                    controls.bump();
                }
            }
        })(this);

        (function manageThree (self) {
            for (var j = 0; j < self.arbres.length; j++) {
                if (lib.isClose(self.arbres[j], game.player)) {
                    controls.block();
                }
            }
        })(this);

        (function manageRiver (self) {
            for (var j = 0; j < self.rivers.length; j++) {
                if (game.player.position.y < 22) {
                    if (lib.isOnRiver(self.rivers[j], game.player.position)) {
                        controls.slow();
                    }
                }
            }
        })(this);

        (function manageMushroom (self) {
            if (game.secondes < 0) { return; }

            for (var i = 0; i < self.mushrooms.length; i++) {

                var mushroom = self.mushrooms[i];
                if(mushroom == undefined) console.log("collison mushroom "+i+" is undefined");

                if (lib.isClose(mushroom, game.player)) {

                    if (game.type == TYPE_GAME.MULTIPLAYER) { // notify
                        Arena.pickupMushroom(self.mushrooms[i].position.x, self.mushrooms[i].position.z);
                        elements.removeElementObjectMush(self.mushrooms[i]);
                    } else if (game.type == TYPE_GAME.BOT){
                        elements.moveToRandomPosition(self.mushrooms[i]);
                    }

                    // add boost
                    if (mushroom.isMegamush) {
                        game.player.boost += 30;
                        message.updateBoost();
                    } else {
                        game.player.boost += 10;
                    }
                    if (game.player.boost > 100) {
                        game.player.boost = 100;
                    }
                    message.updateBoost();

                    // add score
                    if (game.type == TYPE_GAME.BOT){
                        if (mushroom.isMegamush) {
                            game.player.points += 5;
                        } else {
                            game.player.points++;
                        }
                        message.showScore();
                    }

                    break;
                }
            }
        })(this);
    }
};

var collision = new Collision_prototype();
