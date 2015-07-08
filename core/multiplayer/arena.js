var Arena = new function () {
    this.structures = {
        player: function (id) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.id = id;

            this.placer = function (x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
        },
        mushroom: function (x, z) {
            this.x = x;
            this.z = z;
        }
    };

    this.m_moi = new this.structures['player'](0,0,0);
    this.m_autres = {};
    this.m_champignons = {};
    this.evenements = {};

    this.gestionaireResaux = new function (arena) {
        this.socket = io.connect(link_server);
        this.socket.arena = arena;
        this.socket.on('defineTeam', function (data) {
            this.team = data['team'];
            if (this.arena.evenements['joinTeam'] !== undefined) {
                this.arena.evenements['joinTeam'](data['team']);
            }
        });
        this.socket.on('newPlayer', function (data) {
            var team = new this.arena.structures['player'](data['id']);
            this.arena.m_autres[data['id']] = team;
            if (this.arena.evenements['newPlayer'] !== undefined) {
                this.arena.evenements['newPlayer'](team);
            }
        });
        this.socket.on('move', function (data) {
            var position = data['position'];
            var team = this.arena.m_autres[data['id']];

            team.placer(position[0], position[1], position[2]);
            if (this.arena.evenements['playerMove'] !== undefined) {
                this.arena.evenements['playerMove'](team);
            }
        });
        this.socket.on('playerLeft', function (data) {
            delete this.arena.m_autres[data['id']];
            if (this.arena.evenements['playerLeft'] !== undefined) {
                this.arena.evenements['playerLeft'](data['id']);
            }
        });
        this.socket.on('pickupMushroom', function (data) {
            delete this.arena.m_champignons[data['position']];
            if (this.arena.evenements['pickupMushroom'] !== undefined) {
                this.arena.evenements['pickupMushroom'](data['id'], data['team'], data['position']);
            }
        });
        this.socket.on('teamWon', function (data) {
            if (this.arena.evenements['teamWon'] !== undefined) {
                this.arena.evenements['teamWon'](data['team']);
            }
        });
        this.socket.on('newRegularMushroom', function (data) {
            var position = data['position'];
            this.arena.m_champignons[position] = new arena.structures.mushroom(position[0], position[1]);
            if (this.arena.evenements['newRegularMushroom'] !== undefined) {
                this.arena.evenements['newRegularMushroom'](position);
            }
        });
        this.socket.on('newMegaMushroom', function (data) {
            var position = data['position'];
            this.arena.m_champignons[position] = new arena.structures.mushroom(position[0], position[1]);
            if (this.arena.evenements['newMegaMushroom'] !== undefined) {
                this.arena.evenements['newMegaMushroom'](position);
            }
        });
        this.socket.on('displayMushroomWave', function (data) {
            if (this.arena.evenements['displayMushroomWave'] !== undefined) {
                this.arena.evenements['displayMushroomWave']();
            }
        });
        this.socket.on('displayMegaMushroom', function () {
            if (this.arena.evenements['displayMegaMushroom'] !== undefined) {
                this.arena.evenements['displayMegaMushroom']();
            }
        });
        this.socket.on('updateScore', function (data) {
            if (this.arena.evenements['updateScore'] !== undefined) {
                this.arena.evenements['updateScore'](data['score']);
            }
        });
        this.move = function (x, y, z) {
            this.socket.emit('move', { id: this.socket.arenaID, position: [x, y, z] });
        };
        this.pickupMushroom = function (x, z) {
            this.socket.emit('pickupMushroom', { position: [x, z] });
        }
    }(this);

    this.iMove = function (x, y, z) {
        this.m_moi.x = x;
        this.m_moi.y = y;
        this.m_moi.z = z;

        this.gestionaireResaux.move(x, y, z);
    };

    this.pickupMushroom = function (x, z) {
        delete this.m_champignons[x, z];

        this.gestionaireResaux.pickupMushroom(x, z);
    };

    this.when = function (evenements) {
        for (var eventName in evenements) {
            this.evenements[eventName] = evenements[eventName];
        }
    }
};

