var Arena = new function () {
    this.structures = {
        Joueur: function (id) {
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
        Champignon: function (x, z) {
            this.x = x;
            this.z = z;
        }
    };

    this.m_moi = new this.structures['Joueur'](0,0,0);
    this.m_autres = {};
    this.m_champignons = {};
    this.evenements = {};

    this.gestionaireResaux = new function (arena) {
        this.socket = io.connect(link_server);
        this.socket.arena = arena;
        this.socket.on('definirEquipe', function (data) {
            this.equipe = data['equipe'];
            if (this.arena.evenements['rejoindreEquipe'] !== undefined) {
                this.arena.evenements['rejoindreEquipe'](data['equipe']);
            }
        });
        this.socket.on('nouveauJoueur', function (data) {
            var joueur = new this.arena.structures['Joueur'](data['id']);
            this.arena.m_autres[data['id']] = joueur;
            if (this.arena.evenements['nouveauJoueur'] !== undefined) {
                this.arena.evenements['nouveauJoueur'](joueur);
            }
        });
        this.socket.on('deplacement', function (data) {
            var position = data['position'];
            var joueur = this.arena.m_autres[data['id']];

            joueur.placer(position[0], position[1], position[2]);
            if (this.arena.evenements['seDeplacer'] !== undefined) {
                this.arena.evenements['seDeplacer'](joueur);
            }
        });
        this.socket.on('joueurParti', function (data) {
            delete this.arena.m_autres[data['id']];
            if (this.arena.evenements['joueurParti'] !== undefined) {
                this.arena.evenements['joueurParti'](data['id']);
            }
        });
        this.socket.on('champignonRamasser', function (data) {
            delete this.arena.m_champignons[data['position']];
            if (this.arena.evenements['champignonRamasser'] !== undefined) {
                this.arena.evenements['champignonRamasser'](data['id'], data['equipe'], data['position']);
            }
        });
        this.socket.on('equipeGagnante', function (data) {
            if (this.arena.evenements['equipeGagnante'] !== undefined) {
                this.arena.evenements['equipeGagnante'](data['equipe']);
            }
        });
        this.socket.on('nouveauChampignonNormal', function (data) {
            var position = data['position'];
            this.arena.m_champignons[position] = new arena.structures.Champignon(position[0], position[1]);
            if (this.arena.evenements['nouveauChampignonNormal'] !== undefined) {
                this.arena.evenements['nouveauChampignonNormal'](position);
            }
        });
        this.socket.on('nouveauChampignonGeant', function (data) {
            var position = data['position'];
            this.arena.m_champignons[position] = new arena.structures.Champignon(position[0], position[1]);
            if (this.arena.evenements['nouveauChampignonGeant'] !== undefined) {
                this.arena.evenements['nouveauChampignonGeant'](position);
            }
        });
        this.socket.on('vagueChampignonsNormal', function (data) {
            if (this.arena.evenements['vagueChampignonsNormal'] !== undefined) {
                this.arena.evenements['vagueChampignonsNormal']();
            }
        });
        this.socket.on('vagueChampignonGeant', function (data) {
            if (this.arena.evenements['vagueChampignonGeant'] !== undefined) {
                this.arena.evenements['vagueChampignonGeant']();
            }
        });
        this.socket.on('vagueChampignonsZone', function (data) {
            if (this.arena.evenements['vagueChampignonsZone'] !== undefined) {
                this.arena.evenements['vagueChampignonsZone']();
            }
        });
        this.socket.on('nouveauScore', function (data) {
            if (this.arena.evenements['nouveauScore'] !== undefined) {
                this.arena.evenements['nouveauScore'](data['score']);
            }
        });
        this.deplacement = function (x, y, z) {
            this.socket.emit('deplacement', { id: this.socket.arenaID, position: [x, y, z] });
        };
        this.ramassageChampignon = function (x, z) {
            this.socket.emit('champignonRamasser', { position: [x, z] });
        }
    }(this);

    this.meDeplacer = function (x, y, z) {
        this.m_moi.x = x;
        this.m_moi.y = y;
        this.m_moi.z = z;

        this.gestionaireResaux.deplacement(x, y, z);
    };

    this.ramasserChampignon = function (x, z) {
        delete this.m_champignons[x, z];

        this.gestionaireResaux.ramassageChampignon(x, z);
    };

    this.quand = function (evenements) {
        for (var nomEvenement in evenements) {
            this.evenements[nomEvenement] = evenements[nomEvenement];
        }
    }
};

