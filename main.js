import './style.css';
import * as THREE from 'three';
import { OrbitControls }  from 'three/examples/jsm/controls/OrbitControls';

// Set up scene
const scene = new THREE.Scene();
//const spaceTexture = new THREE.TextureLoader().load('/8k_stars_milky_way.jpg');
const space360Texture = new THREE.TextureLoader().load('/eso0932a.jpg');
space360Texture.colorSpace = THREE.SRGBColorSpace;
space360Texture.anisotropy = 4;
space360Texture.matrixAutoUpdate = true;

var backgroundSphere = new THREE.Mesh(
  new THREE.SphereGeometry(600, 64, 64),
  new THREE.MeshBasicMaterial({
    map: space360Texture,
    side: THREE.BackSide,
    transparent: true,
    opacity: 1,
    color: 0x333333
  })
);
scene.add(backgroundSphere);

// Set up renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set up camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,0);

// temp controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.minDistance = 50;
controls.maxDistance = 50;

// Set up helpers
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

// add stars
Array(2000).fill().forEach(addStar);

// add sun
const sun1 = createSun(14.8, 1, 0xdddd00);
const sun4 = createSun(14.85, 0.5, 0xeeee00);
const sun2 = createSun(14.9, 0.5, 0xaaaa00);
const sun3 = createSun(15, 0.5, 0xffee00);
scene.add( sun1,  sun2,  sun3,  sun4);
// add sunlight
const sunLight = new THREE.PointLight(0xffffff);
scene.add(sunLight);

const sizeFactor = 0.3;

// add Mercury
const mercury = createPlanet(0.38 * sizeFactor , "2k_mercury.jpg");
scene.add(mercury);

const venus = createPlanet(0.94 * sizeFactor, "2k_venus_surface.jpg");
scene.add(venus);

const earth = createPlanet(0.99 * sizeFactor, "2k_earth_daymap.jpg");
const earthClouds = createPlanet(1 * sizeFactor, "2k_earth_clouds.jpg", 0.5);
const moon = createPlanet(0.2 * sizeFactor, "2k_moon.jpg");
scene.add(moon);


const e = new THREE.Group();
e.add(earth);
e.add(earthClouds);
scene.add(e);


const moonOrbit = new THREE.Object3D();
e.add(moonOrbit);
moonOrbit.add(moon);
moon.position.x = 1;

const mars = createPlanet(0.53 * sizeFactor, "2k_mars.jpg");
scene.add(mars);

const jupiter = createPlanet(11 * sizeFactor, "2k_jupiter.jpg");
scene.add(jupiter);

const saturn = createPlanet(9.9 * sizeFactor, "2k_saturn.jpg");
scene.add(saturn);

const uranus = createPlanet(4 * sizeFactor, "2k_uranus.jpg");
scene.add(uranus);

const neptune = createPlanet(3.7 * sizeFactor, "2k_neptune.jpg");
scene.add(neptune);



document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('wheel', onScroll, false);

let trip = 0;

camera.position.set(earth.position.x, earth.position.y, earth.position.z);
camera.lookAt(sun1.position);
//render loop
function animate() {
  requestAnimationFrame(animate);

  sun1.rotation.y -= 0.001;
  sun2.rotation.z += 0.001;
  sun3.rotation.x += 0.001;
  sun4.rotation.z += 0.001;
  sun4.rotation.y += 0.001;

  earth.rotation.y -= 0.01;
  earthClouds.rotation.y -= 0.011;
  earthClouds.rotation.x -= 0.0005;

  moon.rotation.x -= 0.001;
  moon.rotation.y -= 0.001;

  const distanceFactor = 20;
  const sunRadius = 15;
  const speedFactor = 0.00002;

  orbit(mercury, sunRadius + (0.39 * distanceFactor), speedFactor / 0.62);
  orbit(venus, sunRadius + (0.72 * distanceFactor), speedFactor / 0.2);
  orbit(e, sunRadius + (1 * distanceFactor), speedFactor / 1);

  moonOrbit.rotation.y += 0.01;
  moonOrbit.rotation.x += 0.001;

  orbit(mars, sunRadius + (1.52 * distanceFactor), speedFactor / 2.3);
  orbit(jupiter, sunRadius + (5 * distanceFactor), speedFactor / 3.82);
  orbit(saturn, sunRadius + (9 * distanceFactor), speedFactor / 4.80);
  orbit(uranus, sunRadius + (15 * distanceFactor), speedFactor / 6.9);
  orbit(neptune, sunRadius + (25 * distanceFactor), speedFactor / 6.9, 100);

  //orbit(camera, sunRadius + (1 * distanceFactor), speedFactor / 1, 0, -6);

  if (trip == 0) {
    controls.target = new THREE.Vector3();
    controls.minDistance = 50;
    controls.maxDistance = 50;
  }
  if (trip == 1) {
    controls.target = mercury.position;
    controls.minDistance = 6;
    controls.maxDistance = 6;
  }
  if (trip == 2) {
    controls.target = venus.position;
    controls.minDistance = 6;
    controls.maxDistance = 6;
  }
  if (trip == 3) {
    controls.target = e.position;
    controls.minDistance = 6;
    controls.maxDistance = 6;
  }
  if (trip == 4) {
    controls.target = mars.position;
    controls.minDistance = 6;
    controls.maxDistance = 6;
  }
  if (trip == 5) {
    controls.target = jupiter.position;
    controls.minDistance = 10;
    controls.maxDistance = 10;
  }
  if (trip == 6) {
    controls.target = saturn.position;
    controls.minDistance = 10;
    controls.maxDistance = 10;
  }
  if (trip == 7) {
    controls.target = uranus.position;
    controls.minDistance = 10;
    controls.maxDistance = 10;
  }
  if (trip == 8) {
    controls.target = neptune.position;
    controls.minDistance = 10;
    controls.maxDistance = 10;
  }

  // Earth follow camera
  //camera.position.set(earth.position.x*2, earth.position.y*2, earth.position.z*2);
  // camera.lookAt(new THREE.Vector3(
  //   earth.position.x * 0.95,
  //   earth.position.y * 0.95,
  //   earth.position.z * 0.95,
  //   ));
  
  
  controls.update();
  renderer.render(scene, camera);
}
animate();


// helper methods

function orbit(object, radius, speed, offset = 0) {
  const angle = (Date.now() + (offset * 1000)) * speed;
  const x = Math.cos(angle) * radius;
  const y = 0;
  const z = Math.sin(angle) * radius;
  object.position.set(x, y, z);
}

function createSun(size, opacity, color) {
  const sunTexture = new THREE.TextureLoader().load("/2k_sun.jpg");
  // Create Sun
  const sunGeometry = new THREE.SphereGeometry(size, 64, 64);
  const sunMaterial = new THREE.MeshBasicMaterial({ opacity: opacity, transparent: true, map: sunTexture, color: color });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  return sun;
}

//create planet 
function createPlanet(size, texture_url, opacity = 1) {
  const texture = new THREE.TextureLoader().load(`/${texture_url}`);
  const geometry = new THREE.SphereGeometry(size, 64, 64);
  const material = new THREE.MeshStandardMaterial({ map: texture, opacity: opacity, transparent: 1, color: 0xdddddd});
  const planet = new THREE.Mesh(geometry, material);
  return planet;
} 

function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: THREE.MathUtils.randFloatSpread(0.5) + 0.5, transparent: true});
  const star = new THREE.Mesh(geometry, material);

  const MIN_DISTANCE = 200;
  let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));

  while (Math.sqrt(x * x + y * y + z * z) < MIN_DISTANCE) {
    [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
  }
  star.position.set(x,y,z);
  scene.add(star);
}


function onMouseMove(event) {
  // Calculate normalized device coordinates
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the mouse position
  // Do something with the mouse position
  //console.log(mouse.x, mouse.y);
}

function onScroll(event) {
  // Get the scroll wheel delta
  const delta = event.deltaY;
  console.log(trip);
  // Do something with the scroll wheel delta
  // For example, you can zoom the camera based on the scroll direction
  if (delta < 0) {
    // Zoom in
    trip += 1;
    if (trip > 90) trip = 90; 
  } else {
    // Zoom out
    trip -= 1;
    if (trip < 0) trip = 0; 
  }
}