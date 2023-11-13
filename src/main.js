import './style.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Experience {
  constructor(container) {
    this.container = document.querySelector(container);

    // Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.resize = () => this.onResize();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createMesh();
    this.createLight();
    this.createControls();
    this.createClock();
    this.addListeners();

    this.renderer.setAnimationLoop(() => {
      this.render();
      this.update();
    });
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 2);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.container.appendChild(this.renderer.domElement);

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  createMesh() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshPhysicalMaterial({ color: 0x0060ff });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  createLight() {
    this.pointLight = new THREE.PointLight(0xff0000, 10, 100);
    this.pointLight.position.set(2, 2, -2);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(1, 1, 3);

    this.scene.add(this.pointLight, this.directionalLight);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  createClock() {
    this.clock = new THREE.Clock();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.controls.update();
  }

  addListeners() {
    window.addEventListener('resize', this.resize, { passive: true });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

const experience = new Experience('#app').init();
