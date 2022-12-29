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

    //SCROLL ON MOBILE
    if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.setSmoothScroll();
    }
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
        //console.log("fired desktop");
        this.room.scale.set(0.08, 0.08, 0.08);
        this.camera.orthographicCamera.position.set(0, 6.5, 10);
        this.room.position.set(0, 1, 0);
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

        this.firstMoveTimeline
          .to(this.room.position, {
            x: () => {
              return this.sizes.width * 0.0014;
            },
          })
          .to(
            this.room.scale,
            {
              x: 0.11,
              y: 0.11,
              z: 0.11,
            },
            "same"
          );

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
              x: 0.15,
              y: 0.15,
              z: 0.15,
            },
            "same"
          )
          .to(this.room.position, {
            x: () => {
              return this.sizes.width * 0.0014;
            },
          })
          .to(
            this.camera.orthographicCamera.position,
            {
              y: 0,
              x: 2,
              z: -4,
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
        })
          .to(this.camera.orthographicCamera.position, {
            y: 2,
            x: 4,
            z: 1,
          })
          .to(this.room.position, {
            x: 5,
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
              x: 1,
              y: 2,
              z: 1,
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
              x: 4,
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
              x: 0.25,
              y: 0.25,
              z: 0.25,
            },
            "same"
          )
          .to(
            this.camera.orthographicCamera.position,
            {
              x: 0,
              y: 1,
              z: -1,
            },
            "same"
          );
      },

      // all
      all: () => {
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

        // All animations
        // First section -----------------------------------------
        this.firstCircle = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }).to(this.circleFirst.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        // Second section -----------------------------------------
        this.secondCircle = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
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

        // Third section -----------------------------------------
        this.thirdCircle = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }).to(this.circleThird.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        // Mini Platform Animations
        this.secondPartTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "center center",
          },
        });

        this.room.children.forEach((child) => {
          if (child.name === "MiniFloor") {
            this.first = GSAP.to(child.position, {
              x: -5.44055,
              z: 13.6135,
              duration: 0.3,
            });
          }
          if (child.name === "Mailbox") {
            this.second = GSAP.to(child.position, {
              x: 2,
              y: -3,
              z: 18,
              duration: 0.3,
            });
          }
          if (child.name === "FlowerPot") {
            this.seventh = GSAP.to(child.position, {
              x: -2,
              y: -3,
              z: 18,
              ease: "back.out(2)",
              duration: 0.3,
            });
          }
          if (child.name === "Flowers") {
            this.eighth = GSAP.to(child.position, {
              x: -2,
              y: -3,
              z: 15,
              ease: "back.out(2)",
              duration: 0.3,
            });
          }
        });
        this.secondPartTimeline.add(this.first);
        this.secondPartTimeline.add(this.second);
        this.secondPartTimeline.add(this.third);
        this.secondPartTimeline.add(this.fourth, "-=0.2");
        this.secondPartTimeline.add(this.fifth, "-=0.2");
        this.secondPartTimeline.add(this.sixth, "-=0.2");
        this.secondPartTimeline.add(this.seventh, "-=0.2");
        this.secondPartTimeline.add(this.eighth);
        this.secondPartTimeline.add(this.ninth, "-=0.1");
      },
    });
  }

  resize() {}
  update() {}
}
