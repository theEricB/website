import { OrbitControls } from "./modules/OrbitControls.js";
import { PointerLockControls } from "./modules/PointerLockControls.js";




let camera, scene, renderer, controls;

var camDirection = new THREE.Vector3(); // create once and reuse it!

// height speed
let heightAcceleration = 8;

// planar speed
let speed = 0.6;
let planarAcceleration = 80;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();


init();
animate();



function init() {

    // CAMERA CONTROLS

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 10;

    scene = new THREE.Scene();
 

    controls = new PointerLockControls( camera, document.body );

    // unlock mouse controls
    document.addEventListener( 'click', function () {
        controls.lock();
    } );

    scene.add( controls.getObject() );

    const onKeyDown = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
        }

    };

    const onKeyUp = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );


    // OBJECTS

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

}



function animate() {

    requestAnimationFrame( animate );


    const time = performance.now();


    const delta = ( time - prevTime ) / (1000/speed);

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.y -= velocity.y * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;


    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions


    if ( moveForward || moveBackward ) velocity.z -= direction.z * planarAcceleration * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * planarAcceleration * delta;


    controls.moveRight( - velocity.x * delta );
    controls.moveForward( - velocity.z * delta );


    
    camera.getWorldDirection( camDirection );
    if ( moveForward ) velocity.y = camDirection.y * heightAcceleration * delta;
    if ( moveBackward ) velocity.y = -1*(camDirection.y * heightAcceleration * delta);

    controls.getObject().position.y += velocity.y

    prevTime = time;

    renderer.render( scene, camera );

}

