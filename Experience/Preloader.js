import { EventEmitter } from "events";
import gsap from "gsap";
import Experience from "./Experience.js";

export default class Preloader extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.world = this.experience.world;
    this.device = this.sizes.device;

    this.sizes.on("switchdevice", (device) => {
      this.device = device;
    });

    this.world.on("worldready", () => {
      this.setAssets();
      this.playIntro();
    });
  }

  setAssets() {
    this.room = this.experience.world.room.actualRoom;
    this.roomChildren = this.experience.world.room.roomChildren;
    //console.log(this.roomChildren);
  }

  firstIntro() {
    return new Promise((resolve) => {
      this.timeline = new gsap.timeline();
      if (this.device === "desktop") {
        this.timeline.to(this.room.scale, {
          x: 0.017,
          y: 0.017,
          z: 0.017,
          ease: "power1.out",
          duration: 0.7,
          onComplete: resolve,
        });
      } else {
        this.timeline.to(this.room.position, {
          x: 0,
          ease: "power1.out",
          duration: 0.7,
          onComplete: resolve,
        });
      }
    });
  }

  onScroll(e) {
    if (e.deltaY > 0) {
      //console.log("added event");
      window.removeEventListener("wheel", this.scrollOnceEvent);
    }
  }

  async playIntro() {
    await this.firstIntro();
    this.scrollOnceEvent = this.onScroll.bind(this);
    window.addEventListener("wheel", this.scrollOnceEvent);
  }
}
