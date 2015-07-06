function Animation_prototype() {
    this.diff = 0;
    this.clock = new THREE.Clock();
}

Animation_prototype.prototype = {

    isContinue: function (id) {
        if (game.type == TYPE_GAME.BOT) {
            if (game.player.points >= 100 || game.opponent.points >= 100) {
                this.stop(id);
                message.endGame();
            }
        }
    },

    moveLight: function (player, light) {
        light.position.set(player.position.x, player.position.y + 50, player.position.z);
        light.updateMatrix();
        light.updateMatrixWorld();
    },

    stop: function (id) {
        cancelAnimationFrame(id);
    },

    play: function () {
        debug.start();

        renderer.render(scene, camera);
        controls.update();

        game.player.position.setFromMatrixPosition(camera.matrixWorld);
        animation.moveLight(game.player, game.player.light);

        collision.manage();

        if (game.inGame) {
            if (game.type == TYPE_GAME.BOT) {
                horse.move();
            }
        }

        THREE.AnimationHandler.update(animation.clock.getDelta());
        debug.end();
        var id = requestAnimationFrame(animation.play);
        animation.isContinue(id);
    }
};

var animation = new Animation_prototype();