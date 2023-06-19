import * as THREE from "three";
import Helpers from "../../helpers/helpers";

export default class Environment extends THREE.Object3D {
  constructor() {
    super();

    this._initView();
  }

  _initView() {
    const backgroundGeometry = new THREE.BoxGeometry(8, 5, 0.05);
    const backgroundMaterial = new THREE.MeshPhongMaterial({ map: THREE.Cache.get("bg_image") });
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, -3, -3);
    backgroundMesh.rotateOnAxis.x = 180;

    this.add(backgroundMesh);


    const shelfGeometry = new THREE.BoxGeometry(5, 0.05, 1);
    const shelfMaterial = new THREE.MeshPhysicalMaterial({ color: 0x999999 });
    const shelfMesh = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelfMesh.receiveShadow = true;
    shelfMesh.position.set(0, 0, 1);
    shelfMesh.rotateOnAxis.z = 180;

    this.add(shelfMesh);

    const asset = THREE.Cache.get('assets').scene.children;
    const table = this._table = asset[4];
    table.scale.set(0.4, 0.4, 0.4);
    table.position.set(0, 0, -0.4);

    table.material = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      roughness: 0.8,
      metalness: 0,
      reflectivity: 10,
      side: THREE.DoubleSide,
      transparent: false,
    });
    table.castShadow = true;
    table.receiveShadow = true;

    this.add(table);

  }
}
