function Message_prototype() {
}

Message_prototype.prototype = {

    showInstruction: function () {
        if (jeu.type == TYPE_GAME.BOT) {
            instructions.innerHTML = '<span style="font-size:40px">Le premier qui arrive à 100 points !</span><br />(ESPACE = Sauter, SOURIS = Regarder autour, ESC = Pause)';

        } else if (jeu.type == TYPE_GAME.MULTIPLAYER) {
            instructions.innerHTML = '<span style="font-size:40px">Mushroom Arena</span><br />(ESPACE = Sauter, SOURIS = Regarder autour, ESC = Pause)';

        }
    },

    showScore: function () {
        score.innerHTML = jeu.joueur.name + ' : <b>' + jeu.joueur.points + '</b> <br /> ' + jeu.ennemie.name + ' : <b>' + jeu.ennemie.points + '</b>';
    },

    showMessage: function (mess) {
        instructions.innerHTML = '<span style="font-size:40px">' + mess + '</span>';
    },

    showShortMessage: function (mess) {
        if (jeu.inGame) {
            this.showMessage(mess);
            setTimeout(function () {
                instructions.innerHTML = '';
            }, 1500);
        }
    },

    showStrobMessage: function (mess, time) {
        console.log(time);
        if (jeu.inGame && time > 0) {
            this.showMessage(mess);
            setTimeout(function () {
                instructions.innerHTML = '';
            }, 100);
            setTimeout(function () {
                this.showStrobMessage(mess, time - 1);
            }, 150);
        }

    },

    startTimeManager: function () {
        setTimeout(function () {
            if (jeu.inGame) {
                message.updateTime();
            }
            message.startTimeManager();
        }, 1000);
    },

    updateTime: function () {
        jeu.secondes++;
        divTemps.innerHTML = 'Temps : ' + jeu.secondes;
    },
    endGame: function () {

        jeu.inGame = false;
        jeu.endGame = true;

        if (jeu.joueur.points > jeu.ennemie.points) {
            instructions.innerHTML =
                '<div style="height:50px">' +
                '<div><span style="font-size:40px">Fin du jeu !<br /> Vous avez battu le ' + jeu.ennemie.name + ' en ' + jeu.secondes + ' secondes !</span></div>'
                + '(F5 pour recommencer)</div>';
            document.getElementById("form_temps").value = jeu.secondes;
        } else {
            instructions.innerHTML = '<span style="font-size:40px">Tu as perdu !</span><br /><a onclick="jeu.restart();" class="btn btn-large"> Recommencer</a>';
        }
    }
};

var message = new Message_prototype();


