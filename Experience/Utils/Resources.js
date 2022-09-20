import { EventEmitter } from "events";
import Experience from "../Experience.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";

export default class Resources extends EventEmitter {
  constructor(assets) {
    super();
    this.experience = new Experience();
    this.renderer = this.experience.renderer;

    this.assets = assets;
    // console.log(this.assets);
    //CARGA LOS ASSETS QUE SE TIENE EN LA CARPETA public
    //VARIABLE PARA GUARDAR EL VIDEO Y EL RENDER3D
    this.items = {};
    //VARIABLE PARA CONOCER TODO EL CONTENIDO DE LA VARIABLE ASSETS
    this.queue = this.assets.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }
  //Draco is an open source library for compressing and decompressing 3D meshes and point clouds.
  //Compressed geometry can be significantly smaller,
  //at the cost of additional decoding time on the client device.
  //DRACO ES UNA FUNCION QUE PROVEE ThreeJS
  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
  }

  startLoading() {
    for (const asset of this.assets) {
      //CARGA EL MODELO EXPORTADO EN 3D CON TERMINACION .gbl
      if (asset.type === "glbModel") {
        this.loaders.gltfLoader.load(asset.path, (file) => {
          this.singleAssetLoaded(asset, file);
        });
        //CARGA EL VIDEO MP4
      } else if (asset.type === "videoTexture") {
        this.video = {};
        this.videoTexture = {};

        this.video[asset.name] = document.createElement("video");
        this.video[asset.name].src = asset.path;
        this.video[asset.name].muted = true;
        this.video[asset.name].playsInline = true;
        this.video[asset.name].autoplay = true;
        this.video[asset.name].loop = true;
        this.video[asset.name].play();

        this.videoTexture[asset.name] = new THREE.VideoTexture(
          this.video[asset.name]
        );
        this.videoTexture[asset.name].flipY = true;
        this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].generateMipmaps = false;
        this.videoTexture[asset.name].encoding = THREE.sRGBEncoding;

        this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
      }
    }
  }

  singleAssetLoaded(asset, file) {
    this.items[asset.name] = file;
    //BUSCA CADA ASSET QUE ESTE EN ITEMS
    this.loaded++;

    //console.log("asset is loading");
    //SI LO QUE YA ESTA CARGADO ES IGUAL AL TAMAÑO DE LOS ASSETS
    if (this.loaded === this.queue) {
      //ASSETS CARGADOS
      //console.log("all assets is done");
      //MANDA UNA SEÑAL DE LISTO A World.js LINEA 18
      this.emit("ready");
    }
  }
}
