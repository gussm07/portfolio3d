import * as THREE from "three";
import Experience from "./Experience.js";

//ESTE DOCUMENTO SE ENCARGA DE REFRESCAR Y REDIMENSIONAR LA PANTALLA
//AUTOMATICAMENTE, DEFINIENDO LA CAMARA, LOS TAMAÑOS, LA ESCENA, ETC..

export default class Renderer {
  constructor() {
    //ESTE CONTENDRA LA CAMARA, LA ESCENA, CANVAS Y TAMAÑO
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.setRenderer();
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    //OPCIONES PREDETERMINADAS PARA LA ESCENA
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }

  //ESTA FUNCION ES LA QUE SE ENCARGA DE REDIMENSIONAR LA PANTALLA
  //Y SE MANDA A LLAMAR EN Experience.js linea 31
  resize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }
  //ESTA FUNCION ES LA QUE SE ENCARGA DE REFRESCAR LOS FRAMES
  //Y SE MANDA A LLAMAR EN Experience.js linea 38
  update() {
    //this.renderer.setViewport(0, 0, this.sizes.width, this.sizes.height);
    /* elige la vista en camara ortografica como principal */
    this.renderer.render(this.scene, this.camera.orthographicCamera);
    /*  this.renderer.setScissorTest(true);
    this.renderer.setViewport(
      this.sizes.width - this.sizes.width / 3,
      this.sizes.height - this.sizes.height / 3,
      this.sizes.width / 3,
      this.sizes.height / 3
    );

    this.renderer.setScissor(
      this.sizes.width - this.sizes.width / 3,
      this.sizes.height - this.sizes.height / 3,
      this.sizes.width / 3,
      this.sizes.height / 3
    ); */
    /* escoge la camara de perspectiva en la vista en miniatura */
    /*    this.renderer.render(this.scene, this.camera.perspectiveCamera);
    this.renderer.setScissorTest(false); */
  }
}
