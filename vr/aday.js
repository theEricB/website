import { PointerLockControls } from "./modules/PointerLockControls.js";
import { GLTFLoader } from './modules/GLTFLoader.js';




let camera, scene, renderer, controls;

var camDirection = new THREE.Vector3(); // create once and reuse it!
let speed = 0.6;
let heightAcceleration = 8;
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

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.x = 5;
    camera.position.z = 20;

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

    const loader = new GLTFLoader();
    // loader.load( './models/adayinmylife.glb', function ( gltf ) {
    //     let model = gltf.scene;
    //     console.log(model);
    //     // model.scale.x = 0.1;
    //     // model.scale.y = 0.1;
    //     // model.scale.z = 0.1;
    //     scene.add( model );
    // });
    
    loader.load( './models/life3.glb', function ( gltf ) {
        let model = gltf.scene;
        model.position.x = 0;
        scene.add( model );
    });
    loader.load( './models/study3.glb', function ( gltf ) {
        let model = gltf.scene;
        model.position.x = 5;
        scene.add( model );
    });
    loader.load( './models/qmb3.glb', function ( gltf ) {
        let model = gltf.scene;
        model.position.x = 10;
        scene.add( model );
    });

    const box1 = new THREE.BoxGeometry( 4, 4, 4 );
    const box2 = new THREE.BoxGeometry( 4, 4, 4 );
    const box3 = new THREE.BoxGeometry( 4, 4, 4 );
    box2.translate(5, 0, 0);
    box3.translate(10, 0, 0);

    let lineW = 10;

    var wox1 = new THREE.EdgesGeometry( box1 ); 
    var mat1 = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: lineW } );
    var wireframe1 = new THREE.LineSegments( wox1, mat1 );
    
    var wox2 = new THREE.EdgesGeometry( box2 ); 
    var mat2 = new THREE.LineBasicMaterial( { color: 0x00ffff, linewidth: lineW } );
    var wireframe2 = new THREE.LineSegments( wox2, mat2 );
    
    var wox3 = new THREE.EdgesGeometry( box3 ); 
    var mat3 = new THREE.LineBasicMaterial( { color: 0xffff00, linewidth: lineW } );
    var wireframe3 = new THREE.LineSegments( wox3, mat3 );
    
    scene.add( wireframe1, wireframe2, wireframe3 );




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

