function Message_prototype() {
}

Message_prototype.prototype = {

    updateBoost: function() {
        $("#pross_bar").css("width", game.player.boost + "%");
    },

    showInstruction: function () {
        if (game.type == TYPE_GAME.BOT) {
            instructions.innerHTML = '<span style="font-size:40px">Be the first to earn 100 points !</span><br />(ESPACE = Jump, MOUSE = Look around, ESC = Pause)';
        } else if (game.type == TYPE_GAME.MULTIPLAYER) {
            instructions.innerHTML = '<span style="font-size:40px">Mushroom Arena</span><br />(ESPACE = Jump, MOUSE = Look around, ESC = Pause)';
        }
    },

    showScore: function () {
        score.innerHTML = game.player.name + ' : <b>' + game.player.points + '</b> <br /> ' + game.opponent.name + ' : <b>' + game.opponent.points + '</b>';
    },

    showMessage: function (mess) {
        instructions.innerHTML = '<span style="font-size:40px">' + mess + '</span>';
    },

    showShortMessage: function (mess) {
        if (game.inGame) {
            this.showMessage(mess);
            setTimeout(function () {
                instructions.innerHTML = '';
            }, 1500);
        }
    },

    showStrobMessage: function (mess, time) {
        console.log(time);
        if (game.inGame && time > 0) {
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
            if (game.inGame) {
                message.updateTime();
            }
            message.startTimeManager();
        }, 1000);
    },

    updateTime: function () {
        game.secondes++;
        divTemps.innerHTML = 'Time : ' + game.secondes;
    },
    endGame: function () {

        game.inGame = false;
        game.endGame = true;

        if (game.player.points > game.opponent.points) {
            instructions.innerHTML =
                '<div style="height:50px">' +
                '<div><span style="font-size:40px">End of the game !<br />You Win' + game.opponent.name + ' in ' + game.secondes + ' secondes !</span></div>'
                + '(F5 to restart)</div>';
            document.getElementById("form_temps").value = game.secondes;
        } else {
            instructions.innerHTML = '<span style="font-size:40px">You loose !</span><br /><a onclick="game.restart();" class="btn btn-large"> Restart</a>';
        }
    }
};

var message = new Message_prototype();


