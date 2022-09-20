import * as THREE from "three";
import Experience from "../Experience.js";

import Room from "./Room.js";
import Floor from "./Floor.js";
import Controls from "./Controls.js";
import Environment from "./Environment.js";
import Theme from "../Theme.js";

import { EventEmitter } from "events";
//ESTE DOCUMENTO SE ENCARGA DE CARGAR EL MUNDO 3D Y LA LUZ

export default class World extends EventEmitter {
  constructor() {
    super();
    //ESTE CONTENDRA LA CAMARA, LA ESCENA, CANVAS Y TAMAÑO
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    //INICIALIZA EL RECURSO DE EL MODELO 3D Y EL VIDEO DESCRITO EN Resources.js
    this.resources = this.experience.resources;
    this.theme = this.experience.theme;
    //MANDA UN AVISO DE QUE ESTA CREADO EL MODELO PROVENIENTE
    //DE Resources.js LINEA 82
    this.resources.on("ready", () => {
      //SE AÑADE LUZ A LA ESCENA
      //LUZ DEFINIDA EN Environment.js
      this.environment = new Environment();
      this.floor = new Floor();
      //SE CREA LA ESCENA 3D
      this.room = new Room();
      //console.log("created room");
      this.controls = new Controls();
      this.emit("worldready");
    });
    this.theme.on("switch", (theme) => {
      this.switchTheme(theme);
    });
  }

  switchTheme(theme) {
    if (this.environment) {
      this.environment.switchTheme(theme);
    }
  }

  resize() {}

  update() {
    if (this.controls) {
      this.controls.update();
    }
  }
}
