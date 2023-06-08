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
    backgroundMesh.position.set(0, -3, 3);
    backgroundMesh.rotateOnAxis.x = 180;

    this.add(backgroundMesh);

    const asset = THREE.Cache.get('assets').scene.children;
    const table = this._table = asset[4].clone();

    table.scale.set(0.4, 0.4, 0.4);
    table.position.set(0, 0, 0.3);
    table.material = new THREE.MeshPhysicalMaterial({
      roughness: 0.4,
      metalness: 0.15,
      reflectivity: 0,
    });
    table.castShadow = true;
    table.receiveShadow = true;
    this.add(table);

    const shelfGeometry = new THREE.BoxGeometry(4, 0.94, 0.05);

  }
}
