import * as THREE from "three";

export default class Environment extends THREE.Object3D {
  constructor() {
    super();

    this._initView();
  }

  _initView() {
    const backgroundGeometry = new THREE.BoxGeometry(10, 5, 0.05);
    const backgroundMaterial = new THREE.MeshPhongMaterial({ map: THREE.Cache.get("bg_image") });
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(-10, -3, -3);
    const backgroundMesh2 = backgroundMesh.clone();
    const backgroundMesh3 = backgroundMesh.clone();

    backgroundMesh2.position.set(0, -3, -3);
    backgroundMesh3.position.set(10, -3, -3);

    this.add(backgroundMesh);
    this.add(backgroundMesh2);
    this.add(backgroundMesh3);

    const shelfGeometry = new THREE.BoxGeometry(5, 0.05, 1);
    const shelfMaterial = new THREE.MeshPhysicalMaterial({ color: 0x999999 });
    const shelfMesh = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelfMesh.receiveShadow = true;
    shelfMesh.position.set(0, 0, 1);
    shelfMesh.rotateOnAxis.z = 180;

    this.add(shelfMesh);

    let table = THREE.Cache.get('assets').scene.children.find((child) => child.name === "Table");

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
