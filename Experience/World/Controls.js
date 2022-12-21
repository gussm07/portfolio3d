//HANDLE ALL CONTROLS
import Experience from "../Experience.js";
import * as THREE from "three";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.actualRoom;
    /* HACE A LAS LUCES PARTE DE LA ESCENA, PARA QUE AL MOMENTO
    DE ALTERAR LA ESCENA, SE ALTERE EN CONJUNTO LAS LUCES */
    this.room.children.forEach((child) => {
      if (
        child.type === "RectAreaLight" ||
        child.type === "SpotLight" ||
        child.type === "PointLight"
      ) {
        this.lights = child;
      }
    });

    this.circleFirst = this.experience.world.floor.circleFirst;
    this.circleSecond = this.experience.world.floor.circleSecond;
    this.circleThird = this.experience.world.floor.circleThird;

    GSAP.registerPlugin(ScrollTrigger);

    document.querySelector(".page").style.overflow = "visible";

    this.setSmoothScroll();
    this.setScrollTrigger();
  }

  setupASScroll() {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      ease: 0.5,
      disableRaf: true,
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on("update", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          ".gsap-marker-start, .gsap-marker-end, [asscroll]"
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll();
  }

  /* APLICA MOVIMIENTO PARA EL MODELO 3D Y DESPLAZARLO A LA DERECHA */
  setScrollTrigger() {
    ScrollTrigger.matchMedia({
      // large
      "(min-width: 969px)": () => {
        console.log("fired desktop");
        //DESKTOP
        // setup animations and ScrollTriggers for screens 960px wide or greater...
        // These ScrollTriggers will be reverted/killed when the media query doesn't match anymore.
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            /* first-move definido en linea 49 */
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        this.firstMoveTimeline.to(this.room.position, {
          x: () => {
            return this.sizes.width * 0.0014;
          },
        });

        this.secondMoveTimeline = new GSAP.timeline(
          {
            scrollTrigger: {
              /* first-move definido en linea 49 */
              trigger: ".second-move",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
          "same"
        );
        /* HACE EFECTO DE ZOOM IN A LA ESCENA 3D */

        this.secondMoveTimeline
          .to(
            this.room.scale,
            {
              x: 0.022,
              y: 0.022,
              z: 0.022,
            },
            "same"
          )
          .to(
            this.camera.orthographicCamera.position,
            {
              y: 0,
              x: 2,
              z: -5,
            },
            "same"
          );
        this.secondMoveTimeline.to(
          this.rectLight,
          {
            width: 1 * 22,
            height: 1 * 22,
          },
          "same"
        );
        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            /* first-move definido en linea 49 */
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }).to(this.camera.orthographicCamera.position, {
          y: 1.5,
          x: -1.5,
          z: 3,
        });
      },
      //STARTS Mobile responsive
      "(max-width: 968px)": () => {
        // console.log("fired mobile");

        // Resets
        this.room.scale.set(0.08, 0.08, 0.08);
        this.room.position.set(0, 1.2, 0);

        this.camera.orthographicCamera.position.set(0, 6.5, 10);

        // First section -----------------------------------------
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.scale,
            {
              x: 0.12,
              y: 0.12,
              z: 0.12,
            },
            "same"
          )
          .to(
            this.camera.orthographicCamera.position,
            {
              x: 0,
              y: 2,
              z: 0,
            },
            "same"
          );

        // Second section -----------------------------------------

        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.scale,
            {
              x: 0.25,
              y: 0.25,
              z: 0.25,
            },
            "same"
          )
          .to(
            this.camera.orthographicCamera.position,
            {
              x: 2.3,
              y: 4,
              z: 0,
            },
            "same"
          );

        this.room.children.forEach((child) => {
          if (child.name === "SillGamer001") {
            GSAP.to(child.position, {
              x: 0,
              y: -8,
              z: 0,
              duration: 3,
            });
          }
        });

        // Third section -----------------------------------------
        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.scale,
            {
              x: 0.08,
              y: 0.08,
              z: 0.08,
            },
            "same"
          )
          .to(
            this.camera.orthographicCamera.position,
            {
              x: 0,
              y: 0,
              z: 0,
            },
            "same"
          );
      },

      all: () => {
        this.secondPartTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "center center",
          },
        });

        this.room.children.forEach((child) => {
          if (child.name === "Plataforma001") {
            this.first = GSAP.to(child.position, {
              x: 0,
              duration: 2,
            });
          }
        });

        this.secondPartTimeline.add(this.first);
        this.secondPartTimeline.add(this.second);
        this.secondPartTimeline.add(this.third);
        this.secondPartTimeline.add(this.fourth);
        this.secondPartTimeline.add(this.fifth);
        this.secondPartTimeline.add(this.sixth);
        this.secondPartTimeline.add(this.seventh);

        this.sections = document.querySelectorAll(".section");
        this.sections.forEach((section) => {
          this.progressWrapper = section.querySelector(".progress-wrapper");
          this.progressBar = section.querySelector(".progress-bar");

          if (section.classList.contains("right")) {
            GSAP.to(section, {
              borderTopLeftRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              borderBottomRightRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
              pin: this.progressWrapper,
              pinSpacing: false,
            },
          });
        });

        //CIRCLE ANIMATIONS
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            /* first-move definido en linea 49 */
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }).to(this.circleFirst.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            /* first-move definido en linea 49 */
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.circleSecond.scale,
            {
              x: 3,
              y: 3,
              z: 3,
            },
            "same"
          )
          .to(
            this.room.position,
            {
              y: 0.7,
            },
            "same"
          );

        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            /* first-move definido en linea 49 */
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }).to(this.circleThird.scale, {
          x: 3,
          y: 3,
          z: 3,
        });
      },
    });
  }

  resize() {}
  update() {}
}
