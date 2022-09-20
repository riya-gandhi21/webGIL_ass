//import the libaries

import * as THREE from "./three/build/three.module.js";
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "./three/examples/jsm/loaders/RGBELoader.js";

const canvas = document.querySelector("#renderCanvas");
const scene = new THREE.Scene(); // define scene
const geometry = new THREE.SphereGeometry(80, 64, 32); //define geometry
const loader = new GLTFLoader(); //define loader

// load the model
loader.load(
  "assets/Car.glb",
  function (glb) {
    console.log(glb);
    const root = glb.scene;
    root.scale.set(0.04, 0.1, 0.1);
    scene.add(root);
  },
  function (x) {
    console.log((x.loaded / x.total) * 100 + "% loaded"); // load the coordinte
  },
  function (error) {
    console.log("an error occurred", error);
  }
);
//setup the lights
let ambientLight = new THREE.AmbientLight(
  new THREE.Color("hsl(0, 0%, 100%)"),
  0.75
);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//setup camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
//manual changes to the camera's transform
camera.position.set(0.2, 0.2, 0.5);
camera.lookAt(new THREE.Vector3(0.1, 0.1, 0.1));

var controls = new OrbitControls(camera, canvas);
scene.add(camera);

// to cast shadows
let SpotLight = new THREE.SpotLight(0xffa95c, 4);
SpotLight.castshadow = true;
scene.add(SpotLight);

const HD = new RGBELoader();
// load hdr
HD.load("assets/Sample.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});

// setup renderer

const renderer = new THREE.WebGL1Renderer({
  canvas: canvas,
  alpha: true,
});
renderer.toneMapping = THREE.ReinhardToneMapping;

renderer.toneMappingExposure = 2.3;
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
animate();

//give the texture
const textureLoader = new THREE.TextureLoader();
// load a resource
textureLoader.load(
  // resource URL
  "assets/EXTERIOR_AO_NEW.png"
);

textureLoader.encoding = THREE.sRGBEncoding;
textureLoader.wrapS = THREE.RepeatWrapping;
textureLoader.wrapT = THREE.RepeatWrapping;
textureLoader.repeat = 10;
textureLoader.repeat = 10;

// paint model
let material = new THREE.MeshPhysicalMaterial({
  clearcoat: 0.21,
  clearcoatRoughness: 0.11,
  metalness: 0.626,
  roughness: 0.5,
  color: 0x0000ff,
  emissive: 995656,
  normalScale: new THREE.Vector3(0.15, 0.15, 0.15),
});
// rotae the model
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  SpotLight.position.set(
    camera.position.x + 10,
    camera.position.y + 10,
    camera.position.z + 10
  );
}
