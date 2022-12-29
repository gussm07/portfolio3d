import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor() {
    //ESTE CONTENDRA LA CAMARA, LA ESCENA, CANVAS Y TAMAÑO
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.createPerspectiveCamera();
    this.createOrthographicCamera();
    this.setOrbitControls();
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      85,
      this.sizes.aspect,
      0.1,
      1000
    );
    this.scene.add(this.perspectiveCamera);
    this.perspectiveCamera.position.z = 12;
    this.perspectiveCamera.position.x = 29;
    this.perspectiveCamera.position.y = 14;
  }

  createOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustum) / 2,
      (this.sizes.aspect * this.sizes.frustum) / 2,
      this.sizes.frustum / 2,
      -this.sizes.frustum / 2,
      -50,
      50
    );

    this.orthographicCamera.position.y = 5.65;
    this.orthographicCamera.position.z = 10;
    this.orthographicCamera.rotation.x = -Math.PI / 6;

    this.scene.add(this.orthographicCamera);

    /* this.helper = new THREE.CameraHelper(this.orthographicCamera);
    this.scene.add(this.helper);

    const size = 20;
    const divisions = 20;

    const gridHelper = new THREE.GridHelper(size, divisions);
    this.scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(10);
    this.scene.add(axesHelper); */
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = false;
  }

  //FUNCION PARA REDIMENSIONAR LA PANTALLA A DIFERENTES TAMAÑOS
  resize() {
    //UPDATING PERSPECTIVE_CAMERA ON RESIZE
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    //UPDATING ORTHOGRAPHIC_CAMERA ON RESIZE
    this.orthographicCamera.left =
      (-this.sizes.aspect * this.sizes.frustum) / 2;
    this.orthographicCamera.right =
      (this.sizes.aspect * this.sizes.frustum) / 2;
    this.orthographicCamera.top = this.sizes.frustum / 2;
    this.orthographicCamera.bottom = -this.sizes.frustum / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
    /* 
    this.helper.matrixWorldNeedsUpdate = true;
    this.helper.update();
    this.helper.position.copy(this.orthographicCamera.position);
    this.helper.position.copy(this.orthographicCamera.rotation);
   */
  }
}
