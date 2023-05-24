// base parameters
let renderer = new THREE.WebGLRenderer({antialiasL:true});
renderer.setSize(window.innerWidth, window.innerHeight);

if(window.innerWidth > 800){
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.tyep = THREE.PCFSoftShadowMap;
    renderer.shadowMap.needsUpdate = true;
}
document.body.appendChild(renderer.domElement);


// make it responsive
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);   
}
window.addEventListener("resize", onWindowResize, false);

let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 2, 14);

let scene = new THREE.Scene();
let city = new THREE.Object3D();
let smoke = new THREE.Object3D();
let town = new THREE.Object3D();
let createCarPos = true;
let uSpeed = 0.001;

// fog background
let setcolor = 0xF02050;
scene.background = new THREE.Color(setcolor);
scene.fog = new THREE.Fog(setcolor, 10, 16);

// randow fnc
const mathRandom = (num = 8) => {
    let numValue = - Math.random() * num + Math.random() * num;
    return numValue;
}

// change building colors
let setTintNum = true;
const setTintColor = () => {
    let setColor;
    if(setTintNum){
        setTintNum = false;
        setColor = 0x000000;
    } else {
        setTintNum = true;
        setColor = 0x000000;
    };
    return setColor;
}

// create city
const init = () => {
    let segments = 2;
    for(let i = 0; i < 100; i++){
        let geometry = new THREE.CubeGeometry(1, 0, 0, segments, segments, segments);
        let material = new THREE.MeshStandardMaterial({
            color : setTintColor(),
            wireframe : false,
            shading : THREE.SmoothShading,
            side : THREE. DoubleSide,
        });
        let wmaterial = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            wireframe: true,
            transparent: true,
            opacity: 0.03,
            side: THREE.DoubleSide
        });

        let cube = new THREE.Mesh(geometry, material);
        let wire = new THREE.Mesh(geometry, material);
        let floor = new THREE.Mesh(geometry, material);
        let wfloor = new THREE.Mesh(geometry, material);

        cube.add(wfloor);
        cube.setShadow = true;
        cube.receiveShadow = true;
        cube.rotationValue = 0.1 + Math.abs(mathRandom(8));
        floor.scale.y = 0.05;
        cube.scale.y = 0.1 + Math.abs(mathRandom(8));

        let cubeWidth = 0.9;
        cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
        cube.position.x = Math.round(mathRandom());
        cube.position.z = Math.round(mathRandom());

        floor.position.set(cube.position.x, 0, cube.position.z);

        town.add(floor);
        town.add(cube);
    };

    // Particulars
    let gmaterial = new THREE.MeshToonMaterial({color:0xFFF00, side: THREE.DoubleSide});
    let gparticular = new THREE.CircleGeometry(0.01, 3);
    let aparticular = 5;

    for(let h = 0; h < 300, h++;){
        let particular = new THREE.Mesh(gparticular, gmaterial);
        particular.position.set(mathRandom(aparticular),
        mathRandom(aparticular), mathRandom(aparticular));
        particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
        smoke.add(particular);
    };

    let pmaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        roughness : 10,
        metalness : 0.6,
        opacity : 0.9,
        transparent : true
    });

    let pgeometry = new THREE.PlaneGeometry(60, 60);
    let pelement = new THREE.Mesh(pgeometry, pmaterial);
    pelement.rotation.x = -90 * Math.PI / 180;
    pelement.position.y = -0.001;
    pelement.receiveShadow = true;
    city.add(pelement);
};

// Mouse fncs
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(), INTERSECTED;
let intersected;

const onMouseMove = (e) => {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
};

const onDocumentTouchStart = (e) => {
    if(e.touches.length === 1){
        e.preventDefault();
        mouse.x = e.touches[0].pageX - window.innerWidth / 2;
        mouse.y = e.touches[0].pageY - window.innerHeight / 2;
    };
};

const onDocumentTouchMove = (e) => {
    if(e.touches.length === 1){
        e.preventDefault();
        mouse.x = e.touches[0].pageX - window.innerWidth / 2;
        mouse.y = e.touches[0].pageY - window.innerHeight / 2;
    };
};

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchstart', onDocumentTouchStart, false);
window.addEventListener('touchmove', onDocumentTouchMove, false);

// Create lights
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
let lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
let lightBack = new THREE.PointLight(0xFFFFFF, 0.5);
let spotLightHelper = new THREE.SpotLightHelper(lightFront);

lightFront.rotation.x = 45 * Math.PI / 180;
lightFront.rotation.z = -45 * Math.PI / 180;
lightFront.position.set(5, 5, 5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 6000;
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
lightFront.penumbra = 0.1;
lightBack.position.set(0, 6, 0);

smoke.position.y = 2;
scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

// Grid Helper
let gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
city.add(gridHelper);

// Cars World
const createCars = (cScale = 2, cPos = 20, cColor=0xFFFF00) => {
    let cMat = new THREE.MeshToonMaterial({color: cColor, side: THREE.DoubleSide});
    let cGeo = new THREE.CubeGeometry(1, cScale / 40, cScale / 40);
    let cElem = new THREE.Mesh(cGeo, cMat);
    let cAmp = 3;

    if(createCarPos){
        createCarPos = false;
        cElem.position.x = -cPos;
        cElem.position.z = (mathRandom(cAmp));

        TweenMax.to(cElem.position, 3, {x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3)});
    } else {
        createCarPos = true;
        cElem.position.x = (mathRandom(cAmp));
        cElem.position.z = -cPos;
        cElem.rotation.y = 90 * Math.PI / 180;

        TweenMax.to(cElem.position, 5, {z: cPos, repeat: -1, yoyo: true, delay: mathRandom(3), ease: Power1.easeInOut});
    };
    cElem.receiveShadow = true;
    cElem.castShadow = true;
    cElem.position.y = Math.abs(mathRandom(5));
    city.add(cElem);
};

const generateLines = () => {
    for(let i = 0; i < 60; i++){
        createCars(0.1, 20);
    }
}

// camera position
const cameraSet = () => {
    createCars(0.1, 20, 0xFFFFFF);
}

//animate fncs
const animate = () => {
    let time = Date.now() * 0.00005;
    requestAnimationFrame(animate);
    
    city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
    city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
    if(city.rotation.x < -0.005){
        city.rotation.x = -0.005;
    } else if (city.rotation.x > 1){
        city.rotation.x = 1;
    }
    let cityRotation = Math.sin(Date.now() / 5000) * 13;
    for(let i = 0, l = town.children.length; i < l; i++){
        let object = town.children[i];
    }

    smoke.rotation.y += 0.01;
    smoke.rotation.x += 0.01;

    camera.lookAt(city.position);
    renderer.render(scene, camera);
}

// call main fncs
generateLines();
init();
animate();