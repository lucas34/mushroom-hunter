function Animation_prototype() {
    this.diff = 0;
    this.clock = new THREE.Clock();
}

Animation_prototype.prototype = {

    isContinue: function (id) {
        if (jeu.type == TYPE_GAME.BOT) {
            if (jeu.joueur.points >= 100 || jeu.ennemie.points >= 100) {
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

        jeu.joueur.position.setFromMatrixPosition(camera.matrixWorld);
        animation.moveLight(jeu.joueur, jeu.joueur.light);

        jeu.collision.manage();

        if (jeu.inGame) {
            if (jeu.type == TYPE_GAME.BOT) {
                bot.move();
                bot.animate();
            }
        }

        THREE.AnimationHandler.update(animation.clock.getDelta());
        debug.end();
        var id = requestAnimationFrame(animation.play);
        animation.isContinue(id);
    }
};

var animation = new Animation_prototype();