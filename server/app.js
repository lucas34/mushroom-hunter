var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
app.set('trust proxy', 'loopback');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// map
const MAP_WIDTH = 2000;
const MAP_HEIGHT = 2000;
const WIDTH_AREA_WAVE = MAP_WIDTH / 20;
const HEIGHT_ARE_WAVE = MAP_HEIGHT / 20;

// number
const NUMBER_MUSHROOM_BEGIN = 50;
const MAX_NUMBER_OF_MUSHROOM = 80;
const NUMBER_MUSHROOM_IN_WAVE = 5;

// point
const POINT_REGULAR_MUSHROOM = 50;
const POINT_MEGA_MUSHROOM = 10 * POINT_REGULAR_MUSHROOM;
const POINT_TO_WIN = 100000;

// event
const MIN_TIME_BETWEEN_EVENT = 10000;
const MAX_TIME_BETWEEN_EVENT = 15000;

var currentNumberOfMushroom = 0;
var balanceTeam = [0, 0];
var scoreTeam = [0, 0];

server.listen(22498);

console.log('Server ready');
var randomPosition = function (width, height) {
    return [Math.floor((Math.random() * width) - (width / 2)), Math.floor((Math.random() * height) - (height / 2))];
};

var Mushroom = function (worth, position) {
    this.worth = worth;
    this.position = position;
};

var Map = function (width, height) {
    this.width = width;
    this.height = height;
    this.players = {};
    this.mushrooms = {};

    for(var i=0; i < NUMBER_MUSHROOM_BEGIN; i++) {
        this.addMushroom(POINT_REGULAR_MUSHROOM);
    }
};

Map.prototype = {

    tooMuchMushroom : function () {
        return (MAX_NUMBER_OF_MUSHROOM < currentNumberOfMushroom);
    },

    addMushroom : function (worth) {

        if(this.tooMuchMushroom()) {
            return;
        }

        currentNumberOfMushroom++;
        var position = randomPosition(this.width, this.height);
        while (this.mushrooms[position] !== undefined) {
            position = randomPosition(this.width, this.height);
        }
        this.mushrooms[position] = new Mushroom(worth, position);

        for (var id in this.players) {
            if (this.players.hasOwnProperty(id)) {
                if (worth == POINT_REGULAR_MUSHROOM) {
                    this.players[id].emit('newRegularMushroom', {position: position});
                } else {
                    this.players[id].emit('newMegaMushroom', {position: position});
                }
            }
        }
    },

    addMushroomArea : function (number) {
        if(this.tooMuchMushroom()) { return; }

        currentNumberOfMushroom += number;
        var positionInitial = randomPosition(this.width, this.height);
        for (var i = 0; i < number; i++) {
            var positionRelative = randomPosition(WIDTH_AREA_WAVE, HEIGHT_ARE_WAVE);
            var position = [positionInitial[0] + positionRelative[0], positionInitial[1] + positionRelative[1]];
            while (this.mushrooms[position] !== undefined) {
                positionRelative = randomPosition(WIDTH_AREA_WAVE, HEIGHT_ARE_WAVE);
                position = [positionInitial[0] + positionRelative[0], positionInitial[1] + positionRelative[1]];
            }
            this.mushrooms[position] = new Mushroom(POINT_REGULAR_MUSHROOM, position);
            for (var id in this.players) {
                if (this.players.hasOwnProperty(id)) {
                    this.players[id].emit('newRegularMushroom', {position: position});
                }
            }
        }
    }

};


io.sockets.on('connection', function (socket) {
    map.players[socket.id] = socket;

    if (scoreTeam[0] < scoreTeam[1]) {
        socket.team = 0;
    } else {
        socket.team = 1;
    }

    balanceTeam[socket.team]++;

    socket.emit('defineTeam', { team: socket.team });

    socket.on('move', function (data) {
        var position = data['position'];
        for (var id in map.players) {
            if (map.players.hasOwnProperty(id)) {
                if (id != this.id) {
                    map.players[id].emit('move', {id: this.id, position: position})
                }
            }
        }
    });

    socket.on('pickupMushroom', function (data) {
        var position = data['position'];
        if (map.mushrooms[position] !== undefined) {
            scoreTeam[socket.team] += map.mushrooms[position].worth;
            delete map.mushrooms[position];
            currentNumberOfMushroom--;

            for (var id in map.players) {
                if (map.players.hasOwnProperty(id)) {
                    map.players[id].emit('updateScore', {score: scoreTeam});

                    if (scoreTeam[socket.team] >= POINT_TO_WIN) {
                        map.players[id].emit('teamWon', {team: this.team})
                    }

                    if (id != this.id) {
                        map.players[id].emit('pickupMushroom', {id: this.id, team: this.team, position: position})
                    }
                }
            }
        }
    });

    socket.on('disconnect', function () {
        delete map.players[this.id];
        balanceTeam[this.team]--;
        for (var id in map.players) {
            if (map.players.hasOwnProperty(id)) {
                map.players[id].emit('playerLeft', {id: this.id});
            }
        }
    });

    for (var id in map.players) {
        if (map.players.hasOwnProperty(id)) {
            if (id != socket.id) {
                map.players[id].emit('newPlayer', {id: socket.id});
                map.players[socket.id].emit('newPlayer', {id: id});
            }
        }
    }

    for (var position in map.mushrooms) {
        if (map.mushrooms.hasOwnProperty(position)) {
            var pp = map.mushrooms[position].position;
            if (map.mushrooms[position].worth === POINT_REGULAR_MUSHROOM) {
                socket.emit('newRegularMushroom', {position: pp});
            } else {
                socket.emit('newMegaMushroom', {position: pp});
            }
        }
    }
});


var triggerEvent = function () {
    var random = Math.floor(Math.random() * 3);
    switch (random) {
        case 0:
            for (var id in map.players) {
                if (map.players.hasOwnProperty(id)) {
                    map.players[id].emit('displayMushroomWave', {});
                }
            }
            map.addMushroomArea(NUMBER_MUSHROOM_IN_WAVE);

            break;

        case 1:
            for (var id in map.players) {
                if (map.players.hasOwnProperty(id)) {
                    map.players[id].emit('displayMegaMushroom', {});
                }
            }
            map.addMushroom(POINT_MEGA_MUSHROOM);
            break;
        case 2:
            map.addMushroom(POINT_REGULAR_MUSHROOM);
            break;
    }
    setTimeout(triggerEvent, Math.floor(Math.random() * (MAX_TIME_BETWEEN_EVENT - MIN_TIME_BETWEEN_EVENT)) + MIN_TIME_BETWEEN_EVENT);
};

// init
var map = new Map(MAP_WIDTH, MAP_HEIGHT);

setTimeout(triggerEvent, Math.floor(Math.random() * (MAX_TIME_BETWEEN_EVENT - MIN_TIME_BETWEEN_EVENT)) + MIN_TIME_BETWEEN_EVENT);


var triggerAddOne = function () {
	map.addMushroom(POINT_REGULAR_MUSHROOM),
	setTimeout(triggerAddOne, 2000);
};
setTimeout(triggerAddOne, 2000);
