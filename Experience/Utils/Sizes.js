import { EventEmitter } from "events";

export default class Sizes extends EventEmitter {
  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.frustum = 5;
    //LA FUNCION FLECHA ES INDISPENSABLE PARA REDIMENSIONAR LA PANTALLA
    //YA QUE AL FINAL EN this.emit("resize") SE DA UNA ALERTA DE QUE
    //SE NECESITA REDIMENSIONAR LA PANTALLA

    /* OCUPAMOS ESTA CONDICION PARA APLICAR ANIMACION CORRESPONDIENTE
    SI ES EN MOBILE O DESKTOP EN PRELOADER.JS */
    if (this.width < 968) {
      this.device = "mobile";
    } else {
      this.device = "desktop";
    }

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      //LIBRERIA events QUE ES DE NODE.JS Y AYUDA A MANDAR ALERTAS
      //DE ALGO QUE SUCEDIO, ESTA SE MANDA A LLAMAR EN Experience.js
      //LINEA 30 Y AHI SE ENCARGA DE REDIMENSIONAR LA PANTALLA
      this.emit("resize");

      if (this.width < 968 && this.device !== "mobile") {
        this.device = "mobile";
        this.emit("switchdevice", this.device);
        //console.log("mobile");
      } else if (this.width >= 968 && this.device !== "desktop") {
        this.device = "desktop";
        this.emit("switchdevice", this.device);
        //console.log("desktop");
      }
    });
  }
}
