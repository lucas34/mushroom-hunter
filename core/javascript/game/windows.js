function Windows_prototype() {
}

Windows_prototype.prototype = {

    resize: function () {

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', this.onResize, false);

    },

    onResize: function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

    },

    init: function () {
        this.resize();
    }

};

var windows = new Windows_prototype();
