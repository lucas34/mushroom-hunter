function BotEngine_prototype() {
    this.etat = 0;
    this.idObject = -1;
}

BotEngine_prototype.prototype = {

    move : function () {
        switch (botEngine.etat) {
            case 0 :
                botEngine.idObject = botEngine.findMushroom();
                botEngine.etat = 1;
                break;
            case 1 :
                horse.moveTo(botEngine.idObject);
                break;
        }
    },

    findMushroom : function () {
        var distMin = 50000;
        var id = 0;
        for (var i = 0; i < collision.mushrooms.length; i++) {
            if (collision.mushrooms[i]) {
                var a = Math.abs(collision.mushrooms[i].position.x - game.opponent.element.position.x);
                var b = Math.abs(collision.mushrooms[i].position.z - game.opponent.element.position.z);
                var dis = lib.pythagore(a, b);
                if (dis < distMin) {
                    distMin = dis;
                    id = i;
                }
            }
        }
        return id;
    }
};

var botEngine = new BotEngine_prototype();