import './style.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Experience {
  constructor(container) {
    this.container = document.querySelector(container);

    // Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Parameters
    this.parameters = {
      time: 0,
      duration: 3,
      fps: 60,
      playhead: 0,
      activeRows: 4,
    };

    this.parameters.step = 1 / (this.parameters.fps * this.parameters.duration);

    this.animation = [];

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
    this.scene.position.y = 3;
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 4, 8);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.container.appendChild(this.renderer.domElement);

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  createMesh() {
    const count = 12;
    const radius = 3;
    const rows = 10;
    let angle = null;
    let width = null;
    let random = Array(this.parameters.activeRows)
      .fill()
      .map((el) => Array(el));

    this.group = new THREE.Group();
    this.scene.add(this.group);

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < this.parameters.activeRows; j++) {
        random[j][i] = Math.random() < 0.5 ? 0 : 1;
      }
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < count; j++) {
        angle =
          (Math.PI * 2 * j) / count +
          ((i % this.parameters.activeRows) * Math.PI) / count;

        width = radius * 2 * Math.sin(Math.PI / count);

        this.material = new THREE.MeshLambertMaterial({
          color: random[j % this.parameters.activeRows][i]
            ? 0xffffff
            : 0xff0000,
        });
        this.geometry = new THREE.BoxGeometry(width, 1, 1);

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.duplicateMesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(
          (radius + 0.39) * Math.sin(angle),
          0,
          (radius + 0.39) * Math.cos(angle)
        );
        this.duplicateMesh.position.set(
          (radius + 0.39) * Math.sin(angle),
          0,
          (radius + 0.39) * Math.cos(angle)
        );

        this.mesh.position.setY(-i);
        this.duplicateMesh.position.setY(-i);

        this.mesh.rotation.y = angle;
        this.duplicateMesh.rotation.y = angle;

        this.group.add(this.mesh, this.duplicateMesh);

        this.duplicateMesh.visible = false;

        this.animation.push({
          y: -i,
          rows: i,
          mesh: this.mesh,
          duplicateMesh: this.duplicateMesh,
          offset:
            i / this.parameters.activeRows +
            Math.random() / this.parameters.activeRows,
        });
      }
    }
  }

  createLight() {
    this.pointLight = new THREE.PointLight(0xffffff, 10, 100);
    this.pointLight.position.set(0, 0, 6);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(4, 2, 3);

    this.scene.add(this.pointLight, this.ambientLight, this.directionalLight);
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

    this.parameters.time += this.parameters.step;

    this.parameters.playhead = this.parameters.time % 1;

    this.group.position.setY(
      -this.parameters.playhead * this.parameters.activeRows
    );

    this.animation.forEach((animation) => {
      if (animation.rows < this.parameters.activeRows) {
        let theta = this.parameters.playhead + animation.offset;

        if (theta > 1) {
          theta = (theta - 1) ** 3;

          animation.mesh.position.setY(
            animation.y +
              (1 - theta) * 10 +
              this.parameters.playhead * this.parameters.activeRows
          );
          animation.duplicateMesh.visible = true;
        } else {
          theta = theta ** 3;
          animation.mesh.position.setY(animation.y + (1 - theta) * 10);
          animation.duplicateMesh.visible = false;
        }
      } else {
        animation.duplicateMesh.visible = false;
      }
    });
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
