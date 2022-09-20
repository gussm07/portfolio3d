import { EventEmitter } from "events";

export default class Theme extends EventEmitter {
  constructor() {
    super();
    this.theme = "light";

    this.toggleButton = document.querySelector(".toggle-button");
    this.toggleCircle = document.querySelector(".toggle-circle");

    this.setEventListener();
  }

  /* evento que se manda a llamar en environment.js
  linea 30 */

  setEventListener() {
    this.toggleButton.addEventListener("click", () => {
      this.toggleCircle.classList.toggle("slide");
      this.theme = this.theme === "light" ? "dark" : "light";
      /* CAMBIA LOS COLORES DE DARK O LIGHT THEME DEFINIDOS EN EL CSS EN CLASE .light-theme */
      document.body.classList.toggle("dark-theme");
      document.body.classList.toggle("light-theme");

      this.emit("switch", this.theme);
    });
  }
}
