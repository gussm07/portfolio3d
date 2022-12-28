import * as THREE from "three";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";

import Camera from "./Camera.js";

import Theme from "./Theme.js";
import Renderer from "./Renderer.js";

import Preloader from "./Preloader.js";
import Resources from "./Utils/Resources.js";

import World from "./World/World.js";
import Controls from "./World/Controls.js";

import assets from "./Utils/assets.js";

export default class Experience {
  static instance;
  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    this.canvas = canvas;
    //TODO LO QUE PASA DEBAJO DE ESTA LINEA DE CODIGO,
    //SE CONVIERTE EN LA VARIABLE INSTANCE
    this.scene = new THREE.Scene();
    this.sizes = new Sizes();
    this.camera = new Camera();
    this.theme = new Theme();
    this.renderer = new Renderer();
    this.resources = new Resources(assets);
    this.time = new Time();
    this.world = new World();
    this.preloader = new Preloader();

    /* this.preloader.on("enablecontrols", () => {
      this.controls = new Controls();
    }); */

    //Every action on a computer is an event.
    //Like when a connection is made or a file is opened.
    //EL .on ES UN EVENTO EMISOR PARA QUE HAGA UNA ACCION, ESTE CASO
    //ES EL DE REDIMENSIONAR LA PANTALLA CADA QUE SE REQUIERE
    //EL "resize" SE DEFINIO EN Sizes.js LO CUAL, SE ENCARGA DE
    //AJUSTAR EL ANCHO Y EL ALTO DE LA PANTALLA
    this.sizes.on("resize", () => {
      this.resize();
    });
    //EL .on ES UN EVENTO EMISOR PARA QUE HAGA UNA ACCION, ESTE CASO
    //ES EL DE ACTUALIZAR LA PANTALLA CADA QUE SE REQUIERE
    //EL "update" SE DEFINIO EN Time.js LO CUAL, SE ENCARGA DE
    //LOS FRAMES TRANSCURRIDOS Y DEL TIEMPO
    this.time.on("update", () => {
      this.update();
    });
  }
  resize() {
    this.camera.resize();
    this.world.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }
}
