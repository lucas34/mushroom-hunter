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
            for (var i = 0; i < self.mushrooms.length; i++) {
                if (lib.isClose(self.mushrooms[i], game.player)) {
                    if (game.type == TYPE_GAME.MULTIPLAYER) {
                        Arena.pickupMushroom(self.mushrooms[i].position.x, self.mushrooms[i].position.z);

                        if (self.mushrooms[i].megaMushroom) {
                            game.player.boost += 30;
                        } else {
                            game.player.boost += 10;
                        }
                    }
                    if (game.secondes > 0) {
                        if (game.type != 2) {
                            if (self.mushrooms[i].isMegamush) {
                                game.player.points += 5;
                                game.player.boost += 40;
                            } else {
                                game.player.boost += 20;
                                game.player.points++;
                            }
                        }
                        if (game.player.boost > 100) {
                            game.player.boost = 100;
                        }
                        $("#pross_bar").css("width", game.player.boost + "%");
                        message.showScore();
                    }
                    if (game.type == TYPE_GAME.MULTIPLAYER) {
                        elements.removeElementObjectMush(self.mushrooms[i]);
                    } else {
                        elements.moveToRandomPosition(self.mushrooms[i]);
                    }
                    break;
                }
            }
        })(this);
    }
};

var collision = new Collision_prototype();
