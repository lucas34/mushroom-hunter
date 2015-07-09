function Debug_prototype() {
    this.stats = new Stats();
}

Debug_prototype.prototype = {
    start: function () {
        this.stats.setMode(0);
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.top = '0px';
        this.stats.begin();
    },

    end: function () {
        this.stats.end();
    }

};

var debug = new Debug_prototype();
