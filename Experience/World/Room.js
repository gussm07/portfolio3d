import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import * as dat from "dat.gui";
import { GUI } from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.resources = this.experience.resources;
    this.room = this.resources.items.room;
    //AQUI OBTENEMOS LOS OBJETOS DEL MODELO3D
    this.actualRoom = this.room.scene;
    //MUESTRA LOS OBJETOS DEL MODELO3D EN CONSOLA
    //console.log(this.actualRoom);
    //FUNCION PARA AÑADIR LA ESCENA 3D PERO SIN LUZ
    //

    this.roomChildren = {};
    //console.log(this.room);

    const clock = new THREE.Clock();

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };
    this.setModel();
    this.onMouseMove();
  }

  //AÑADE LA ESCENA3D A LA PAGINA
  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }

      //AÑADE EL VIDEO COMO MATERIAL EN LA PANTALLA
      //BUSCA DENTRO DE LOS RECURSOS EL NOMBRE DE "screen"
      //CON EL QUE FUE DADO DE ALTA EL VIDEO, COMO UN TAG
      if (child.name === "Pantalla") {
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }

      if (child.name === "SillGamer") {
        (child.position.x = 0),
          (child.position.y = 23.38),
          (child.position.z = 1.34);
      }

      /*  if (
        child.name === "Correo" ||
        child.name === "LadrillosPiso" ||
        child.name === "Planta" ||
        child.name === "Flowers" ||
        child.name === "Planta1" ||
        child.name === "Planta2"
      ) {
        child.scale.set = (0, 0, 0);
      } */

      this.actualRoom.scale.set(0.01, 0.01, 0.01);
      //this.actualRoom.position.set(0, 0, 2);
      if (child.name === "Cube") {
      }

      this.roomChildren[child.name.toLowerCase()] = child;
    });

    /* LUZ ROJA */
    const light = new THREE.PointLight(0xff0000, 0.5, 0.5);
    light.position.set(1, 1, -0.55);
    light.intensity = 1;
    light.rotation.y = Math.PI / 4;

    /* LUZ AZUL */
    const light2 = new THREE.PointLight(0x0040ff, 0.5, 0.5);
    light2.position.set(0.5, 1, -0.9);
    light2.intensity = 1;
    light2.rotation.y = Math.PI / 4;

    /* LUZ VERDE */
    const light3 = new THREE.PointLight(0x80ff80, 1, 0.5);
    light3.position.set(0, 1, -1.3);
    light3.intensity = 1;
    light3.rotation.y = Math.PI / 4;

    const PointLightHelper = new THREE.PointLightHelper(light);
    //light.add(PointLightHelper);

    const PointLightHelper2 = new THREE.PointLightHelper(light);
    //light2.add(PointLightHelper2);

    const PointLightHelper3 = new THREE.PointLightHelper(light);
    //light3.add(PointLightHelper3);

    /* LUZ DE MAC Y TECLADO */
    const width = 1;
    const height = 1;
    const intensity = 10;
    const rectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );
    rectLight.position.set(-1, 1, -0.45);
    rectLight.rotation.y = -Math.PI / 2;

    const RectLightHelper = new RectAreaLightHelper(rectLight);
    //rectLight.add(RectLightHelper);

    /* VARIABLES SPOTLIGHT */
    const distanceSpotlight = 2.5;
    const angleSpotlight = 0.5;
    const intensity2 = 5;
    const penumbraSpotlight = 0;
    const decaySpotlight = 1.7;
    const spotLight = new THREE.SpotLight(
      0xffffff,
      intensity2,
      distanceSpotlight,
      angleSpotlight,
      penumbraSpotlight,
      decaySpotlight
    );
    spotLight.position.set(0.95, 1.48, 0);
    spotLight.rotation.y = 100;

    this.scene.add(spotLight);

    const helperSpot = new THREE.SpotLightHelper(spotLight);
    //this.scene.add(helperSpot);

    /*  const stats = Stats();
    document.body.appendChild(stats.dom);

    const data = {
      color: light.color.getHex(),
      mapsEnabled: true,
    };

    const gui = new GUI();
    const lightFolder = gui.addFolder("THREE.Light");
    lightFolder.addColor(data, "color").onChange(() => {
      light.color.setHex(Number(data.color.toString().replace("#", "0x")));
    });
    lightFolder.add(spotLight, "intensity", 0, 1, 0.01);
    lightFolder.open();
    const spotLightFolder = gui.addFolder("THREE.SpotLight");
    spotLightFolder.add(spotLight, "distance", 0, 100, 0.01);
    spotLightFolder.add(spotLight, "decay", 0, 4, 0.1);
    spotLightFolder.add(spotLight, "angle", 0, 1, 0.1);
    spotLightFolder.add(spotLight, "penumbra", 0, 1, 0.1);
    spotLightFolder.add(spotLight.position, "x", -50, 50, 0.01);
    spotLightFolder.add(spotLight.position, "y", -50, 50, 0.01);
    spotLightFolder.add(spotLight.position, "z", -50, 50, 0.01);
    spotLightFolder.add(spotLight.rotation, "z", -50, 50, 0.01);
    spotLightFolder.open();
    const meshesFolder = gui.addFolder("Meshes");
    meshesFolder.add(data, "mapsEnabled").onChange(() => {
      material.forEach((m) => {
        if (data.mapsEnabled) {
          m.map = texture;
        } else {
          m.map = null;
        }
        m.needsUpdate = true;
      });
    }); */
    /* TERMINA SPOTLIGHT */

    this.roomChildren["rectLight"] = rectLight;

    this.scene.add(rectLight);
    this.scene.add(light);
    this.scene.add(light2);
    this.scene.add(light3);

    this.scene.add(this.actualRoom);

    //this.actualRoom.scale.set(0, 0, 0);
    this.actualRoom.rotation.y = -120;
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      //console.log(e);
      /* CONVIERTE EL ANCHO DE LA PANTALLA, SEA CUAL SEA EL TAMAÑO
      DE -1 0 1 */
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation;
      //console.log(this.rotation);
    });
  }

  setRoomGroup() {
    // New group so we can rotate the bike with GSAP without intefering with our mouse rotation lerping
    // Like a spinning plateform that can spin independetly from others
    this.group = new THREE.Group();
    this.group.add(this.actualRoom);
    this.scene.add(this.group);
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualRoom.rotation.y = this.lerp.current;
  }
}