import * as THREE from "three";
export default class Menu extends THREE.Object3D {
    constructor() {
        super();

        this._initView();
    }

    _initView() {
        const asset = THREE.Cache.get('assets').scene.children;

        const menu = this._menu = asset[0].clone();
        menu.scale.set(0.01, 0.01, 0.01);
        menu.rotation.z = Math.PI;
        menu.position.x = 0;
        menu.position.y = 0;
        menu.position.z = -0.2;
        menu.castShadow = true; // Enable shadow casting for the menu
        this.add(menu);

        const cornFlakes = menu.children[0].material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0.15,
            map: THREE.Cache.get('corn_flakes'),
            reflectivity: 2,
            side: THREE.DoubleSide
        });
        cornFlakes.castShadow = true;

        const detergentBox = menu.children[1].material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0.15,
            map: THREE.Cache.get('detergent'),
            reflectivity: 2,
            side: THREE.DoubleSide
        });
        detergentBox.castShadow = true;

        const riceBag = menu.children[2];
        riceBag.children[0].material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0.15,
            map: THREE.Cache.get('rice_bag'),
            reflectivity: 2,
            side: THREE.FrontSide
        });
        riceBag.castShadow = true;

        riceBag.children[1].material = new THREE.MeshPhysicalMaterial({ color: 0xffed3c });

        const scentBooster = menu.children[3];
        const scentBoosterCap = scentBooster.children[0].material = new THREE.MeshPhysicalMaterial({
            color: 0x7DCDFF,
            roughness: 0.4,
            reflectivity: 10
        });

        const scentBoosterBottle = scentBooster.children[1].material = new THREE.MeshPhysicalMaterial({
            roughness: 0,
            metalness: 0,
            map: THREE.Cache.get('scent_booster'),
            reflectivity: 10,
            side: THREE.DoubleSide
        });

        scentBooster.castShadow = true;

        const shelfGeometry = new THREE.BoxGeometry(4, 0.94, 0.05);
        const shelfMaterial = new THREE.MeshPhysicalMaterial({ color: 0xD6DADD });
        const shelfMesh = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelfMesh.receiveShadow = true; // Enable shadow reception for the shelf
        shelfMesh.position.set(0, 0, -1);
        shelfMesh.rotation.x = Math.PI * 0.5;
        this.add(shelfMesh);
    }
}