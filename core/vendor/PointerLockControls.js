/**
 * @author mrdoob / http://mrdoob.com/
 * Source: https://github.com/mrdoob/three.js/blob/master/examples/js/controls/PointerLockControls.js
 *
 * Adopted to common js by Javier Zapata
 */

var previousPosition = new THREE.Vector3();
THREE.PointerLockControls = function ( camera ) {

    var THREE = window.THREE || require('three');

    var scope = this;

    camera.rotation.set( 0, 0, 0 );

    var pitchObject = new THREE.Object3D();
    pitchObject.add( camera );

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add( pitchObject );

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var isOnObject = false;
    var canJump = false;

    var prevTime = performance.now();

    var velocity = new THREE.Vector3();

    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {

        if ( scope.enabled === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

    };

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 90: // z
            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 81: // q
            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 90: // z
            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 81: // q
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.enabled = false;

    this.getObject = function () {

        return yawObject;

    };

    this.update = function () {

        if ( scope.enabled === false || game.inGame == false) {
            prevTime = performance.now();
            return;
        }

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if ( moveForward ) velocity.z -= 4000.0 * delta;
        if ( moveBackward ) velocity.z += 4000.0 * delta;

        if ( moveLeft ) velocity.x -= 4000.0 * delta;
        if ( moveRight ) velocity.x += 4000.0 * delta;

        if ( isOnObject === true ) {
            velocity.y = Math.max( 0, velocity.y );
        }

        yawObject.translateX( velocity.x * delta );
        yawObject.translateY( velocity.y * delta );
        yawObject.translateZ( velocity.z * delta );

        if ( yawObject.position.y < 10 ) {

            velocity.y = 0;
            yawObject.position.y = 10;

            canJump = true;
        }

        if(game.type == TYPE_GAME.MULTIPLAYER){
            if(
                (Math.floor(game.player.position.x) != Math.floor(previousPosition.x))
                || (Math.floor(game.player.position.y) != Math.floor(previousPosition.y))
                || (Math.floor(game.player.position.z) != Math.floor(previousPosition.z)))
            {
                previousPosition.setFromMatrixPosition(camera.matrixWorld);
                if(Math.floor(Date.now()/30 )!= di){
                    di = Math.floor(Date.now()/30);
                    if(game.type == TYPE_GAME.MULTIPLAYER){
                        Arena.iMove(game.player.position.x,game.player.position.y,game.player.position.z);
                    }
                }
            }
        }


        prevTime = time;
    };

    this.bump = function (){
        if ( canJump === true ) velocity.y += 15;
        velocity.x *= 1.2;
        velocity.z *= 1.2;
        canJump = false;

    };

    this.block = function (){
        velocity.x = 1;
        velocity.z = 1;
    };

    this.slow = function (){
        velocity.x = velocity.x * 0.8;
        velocity.z = velocity.z * 0.8;
    };

};